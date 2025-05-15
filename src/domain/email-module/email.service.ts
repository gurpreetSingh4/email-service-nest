import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { REGISTERED_EMAIL_DATA_MODEL, RegisteredEmailDataModel } from "src/schemas/common/registeredEmailData.schema";
import { USER_MODEL, UserDocument } from "src/schemas/common/user.schema";
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataModel } from "src/schemas/UserRegisteredEmailsData.schema";

import { RedisService } from "../redis/redis.service";
import { GmailServiceUtilFn } from "src/utils/gmailClient.util";

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    private extractHeader(headers: { name?: string | null; value?: string | null }[] = [], key: string): string {
        const match = headers.find((h) => h.name === key);
        return match?.value ?? '';
    }

    private decodeBody(payload: any): string {
        const bodyData =
            payload?.body?.data ||
            payload?.parts?.[0]?.body?.data ||
            '';
        return Buffer.from(bodyData, 'base64').toString('utf-8');
    }

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly gmailServiceUtilFn: GmailServiceUtilFn,
        @InjectModel(USER_REG_EMAIL_DATA_MODEL) private readonly userRegEmailsModel: Model<UserRegisteredEmailsDataModel>,
        @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
        @InjectModel(REGISTERED_EMAIL_DATA_MODEL) registeredEmailDataModel: Model<RegisteredEmailDataModel>,

    ) { }



    async getEmailLabelStats(accessToken: string) {
        try {
            const labelListRes = await axios.get(
                'https://gmail.googleapis.com/gmail/v1/users/me/labels',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            const labels = labelListRes.data.labels;

            const stats = await Promise.all(
                labels.map(async (label, index) => {
                    const labelRes = await axios.get(
                        `https://gmail.googleapis.com/gmail/v1/users/me/labels/${label.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );

                    const data = labelRes.data;
                    return {
                        labelId: data.id,
                        name: data.name,
                        total: data.messagesTotal,
                        unread: data.messagesUnread,
                        color: this.COLORS[index % this.COLORS.length],
                    };
                }),
            );

            return {
                labels: labels.map(label => ({
                    id: label.id,
                    name: label.name,
                    type: label.type,
                })),
                stats,
            };
        } catch (error) {
            this.logger.error('Error fetching labels', error?.response?.data || error.message);
            throw new Error('Failed to fetch labels');
        }

    }

    async findRegisteredEmailData(userId: string, regEmail: string) {
        const data = await this.userRegEmailsModel.findOne(
            {
                user: new Types.ObjectId(userId),
                registeredEmailsData: {
                    $elemMatch: { regEmail },
                },
            },
            {
                'registeredEmailsData.$': 1, // Only include matched email
            },
        );

        const matchedEmail = data?.registeredEmailsData?.[0];
        if (!matchedEmail) return null;

        return {
            id: userId.toString(),
            email: matchedEmail.regEmail,
            name: matchedEmail.regEmailName,
            avatar: matchedEmail.regEmailPicture,
        };
    }


    async getUserEmailInfo(userId: string) {
        try {
            if (!userId) {
                throw new Error('User ID is missing');
            }

            const user = await this.userRegEmailsModel.findOne({ user: new Types.ObjectId(userId) });

            if (!user) {
                throw new Error('User not found in database');
            }

            if (!user.registeredEmailsData?.length) {
                return [];
            }

            const userData = user.registeredEmailsData.map((entry) => ({
                name: entry.regEmailName,
                email: entry.regEmail,
                avatar: entry.regEmailPicture,
                id: userId,
            }));

            return userData;
        } catch (error) {
            this.logger.error('Error during usersDataInfo', error);
            throw new Error('Failed to fetch user registered email info');
        }
    }

    async fetchEmailsByFolder(accessToken: string, folder: string = '') {
        const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);
        const query = {
            inbox: 'in:inbox',
            sent: 'in:sent',
            drafts: 'in:drafts',
            trash: 'in:trash',
        }[folder] || '';

        try {
            const response = await gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: 50,
            });

            console.log("list bhi h", response)
            const messages = response.data.messages || [];

            const emails = await Promise.all(
                messages.map(async (msg) => {
                    const fullMessage = await gmail.users.messages.get({
                        userId: 'me',
                        id: msg.id as string,
                    });

                    const headers = fullMessage.data.payload?.headers || [];

                    const getHeader = (name: string) =>
                        headers.find((h) => h.name === name)?.value || '';

                    const bodyData =
                        fullMessage.data.payload?.body?.data ||
                        fullMessage.data.payload?.parts?.[0]?.body?.data ||
                        '';

                    const emailBody = Buffer.from(bodyData, 'base64').toString('utf-8');

                    return {
                        id: fullMessage.data.id,
                        subject: getHeader('Subject'),
                        sender: {
                            name: getHeader('From'),
                            email: getHeader('From'),
                        },
                        recipients: [], // Optional: Can be filled from 'To' header
                        body: emailBody,
                        date: fullMessage.data.internalDate,
                        isStarred: fullMessage.data.labelIds?.includes('STARRED') || false,
                        folder,
                        labels: (fullMessage.data.labelIds || []).map((labelId) => ({
                            id: labelId,
                            name: labelId,
                        })),
                    };
                }),
            );

            return emails;
        } catch (error) {
            this.logger.error('Failed to fetch emails', error?.response?.data || error.message);
            throw new Error('Unable to retrieve emails');
        }
    }

    async getLabels(accessToken: string) {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);
            const response = await gmail.users.labels.list({ userId: 'me' });
            const labels = response.data.labels || [];

            return labels.map(label => ({
                id: label.id,
                name: label.name,
            }));
        } catch (error) {
            this.logger.error('Error fetching labels', error?.response?.data || error.message);
            throw new Error('Failed to fetch labels');
        }
    }

    async getEmailById(accessToken: string, messageId: string) {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);
            const fullMessage = await gmail.users.messages.get({ userId: 'me', id: messageId });

            const headers = fullMessage.data.payload?.headers || [];

            const getHeader = (name: string) =>
                headers.find(h => h.name === name)?.value || '';

            const bodyData =
                fullMessage.data.payload?.body?.data ||
                fullMessage.data.payload?.parts?.[0]?.body?.data || '';

            return {
                id: fullMessage.data.id,
                subject: getHeader('Subject'),
                sender: {
                    name: getHeader('From'),
                    email: getHeader('From'),
                },
                recipients: [], // Could parse 'To' and 'Cc' if needed
                body: Buffer.from(bodyData, 'base64').toString('utf-8'),
                date: fullMessage.data.internalDate,
                isStarred: fullMessage.data.labelIds?.includes('STARRED') || false,
                folder: '', // Can be derived if needed
                labels: (fullMessage.data.labelIds || []).map(labelId => ({
                    id: labelId,
                    name: labelId,
                })),
            };
        } catch (error) {
            this.logger.error('Error fetching email by ID', error?.response?.data || error.message);
            throw new Error('Failed to fetch email');
        }
    }

    async searchEmails(accessToken: string, query: string) {
        const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

        const response = await gmail.users.messages.list({
            userId: 'me',
            q: query,
            maxResults: 20,
        });

        const messages = response.data.messages || [];

        const emails = await Promise.all(
            messages.map(async (msg) => {
                const fullMessage = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id!,
                });

                const headers = fullMessage.data.payload?.headers || [];

                return {
                    id: fullMessage.data.id,
                    subject: this.extractHeader(headers, 'Subject'),
                    sender: {
                        name: this.extractHeader(headers, 'From'),
                        email: this.extractHeader(headers, 'From'),
                    },
                    body: this.decodeBody(fullMessage.data.payload),
                    date: fullMessage.data.internalDate,
                };
            }),
        );

        return emails;
    }

    async getDraftEmails(accessToken: string) {
        const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

        const listResponse = await gmail.users.drafts.list({
            userId: 'me',
            maxResults: 50,
        });

        const drafts = listResponse.data.drafts || [];

        const fullDrafts = await Promise.all(
            drafts.map(async (draftItem) => {
                const draftResponse = await gmail.users.drafts.get({
                    userId: 'me',
                    id: draftItem.id!,
                });

                const draft = draftResponse.data;
                const headers = draft.message?.payload?.headers || [];

                const subject = this.extractHeader(headers, 'Subject');
                const to = this.extractHeader(headers, 'To');
                const body = this.decodeBody(draft.message?.payload);

                return {
                    id: draft.id,
                    subject,
                    body,
                    recipients: to ? to.split(',').map((email) => email.trim()) : [],
                };
            }),
        );
        return fullDrafts;
    }

    async createLabel(accessToken: string, name: string): Promise<{ id: string; name: string }> {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

            const response = await gmail.users.labels.create({
                userId: 'me',
                requestBody: {
                    name,
                    labelListVisibility: 'labelShow',
                    messageListVisibility: 'show',
                },
            });

            return {
                id: response.data.id || '',
                name: response.data.name || '',
            };
        } catch (error) {
            this.logger.error('Failed to create label', error?.response?.data || error.message);
            throw new Error('Unable to create label');
        }
    }

    async deleteLabel(accessToken: string, labelId: string): Promise<boolean> {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);
            await gmail.users.labels.delete({
                userId: 'me',
                id: labelId,
            });
            return true;
        } catch (error) {
            this.logger.error('Failed to delete label', error?.response?.data || error.message);
            throw new Error('Unable to delete label');
        }
    }

    async updateEmailStarred(accessToken: string, id: string, isStarred: boolean): Promise<{ id: string; isStarred: boolean }> {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

            await gmail.users.messages.modify({
                userId: 'me',
                id,
                requestBody: {
                    addLabelIds: isStarred ? ['STARRED'] : [],
                    removeLabelIds: !isStarred ? ['STARRED'] : [],
                },
            });

            return { id, isStarred };
        } catch (error) {
            this.logger.error('Failed to update starred status', error?.response?.data || error.message);
            throw new Error('Unable to update starred status');
        }
    }

    async moveEmail(accessToken: string, id: string, folder: string): Promise<{ id: string; folder: string }> {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

            const labelMap: Record<string, string> = {
                trash: 'TRASH',
                spam: 'SPAM',
                drafts: 'DRAFT',
                sent: 'SENT',
            };

            await gmail.users.messages.modify({
                userId: 'me',
                id,
                requestBody: {
                    addLabelIds: [labelMap[folder] || 'INBOX'],
                },
            });

            return { id, folder };
        } catch (error) {
            this.logger.error('Failed to move email', error?.response?.data || error.message);
            throw new Error('Unable to move email');
        }
    }

    async applyLabel(accessToken: string, emailId: string, labelId: string): Promise<{ id: string; labels: { id: string; name: string }[] }> {
        const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);
        await gmail.users.messages.modify({
            userId: 'me',
            id: emailId,
            requestBody: {
                addLabelIds: [labelId],
            },
        });

        return { id: emailId, labels: [{ id: labelId, name: labelId }] };
    }

    async removeLabel(accessToken: string, emailId: string, labelId: string): Promise<{ id: string; labels: [] }> {
        const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);
        await gmail.users.messages.modify({
            userId: 'me',
            id: emailId,
            requestBody: {
                removeLabelIds: [labelId],
            },
        });

        return { id: emailId, labels: [] };
    }

    async saveDraft(accessToken: string, input: { subject: string; body: string; recipients: string[] }): Promise<{
        id: string;
        subject: string;
        body: string;
        recipients: string[];
        folder: string;
    }> {
        const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

        const emailLines = [
            `To: ${input.recipients.join(', ')}`,
            `Subject: ${input.subject || ''}`,
            'Content-Type: text/plain; charset="UTF-8"',
            '',
            input.body || '',
        ];

        const emailContent = emailLines.join('\n');

        const encodedMessage = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const draftResponse = await gmail.users.drafts.create({
            userId: 'me',
            requestBody: {
                message: {
                    raw: encodedMessage,
                },
            },
        });

        const draft = draftResponse.data;

        return {
            id: draft.id || '',
            subject: input.subject || '',
            body: input.body || '',
            recipients: input.recipients,
            folder: 'drafts',
        };
    }

    async sendEmail(accessToken: string, input: { subject: string; body: string; recipients: string[] }): Promise<{
        id: string;
        subject: string;
        body: string;
        recipients: string[];
        date: string;
        folder: string;
    }> {
        try {
            const gmail = this.gmailServiceUtilFn.getGmailClient(accessToken);

            const message = [
                `To: ${input.recipients.join(', ')}`,
                `Subject: ${input.subject || ''}`,
                'Content-Type: text/plain; charset="UTF-8"',
                '',
                input.body || '',
            ].join('\n');

            const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, ''); // Gmail expects URL-safe base64

            const response = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });

            return {
                id: response.data.id || '',
                subject: input.subject,
                body: input.body,
                recipients: input.recipients,
                date: new Date().toISOString(),
                folder: 'sent',
            };
        } catch (error) {
            this.logger.error('Failed to send email', error?.response?.data || error.message);
            throw new Error('Unable to send email');
        }
    }


}
