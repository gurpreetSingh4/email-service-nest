import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { gmail_v1 } from 'googleapis/build/src/apis/gmail';

@Injectable()
export class GmailServiceUtilFn {
  getGmailClient(accessToken: string): gmail_v1.Gmail {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    return google.gmail({ version: 'v1', auth });
  }
}
