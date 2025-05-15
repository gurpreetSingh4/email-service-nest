import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  Inject,
  Post,
  HttpException,
  HttpStatus,
  Delete,
  Body,
  // Session,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Response, Request } from 'express';
import { Session } from 'src/common/decorators/session.decorator';
import { EmailUtilFunctions } from 'src/utils/Email.util';

@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private emailUtilFn: EmailUtilFunctions,
  ) {
    console.log("hello ji email controller me h")
  }


  @Get('/getemaillabelstats')
  async getEmailLabelStats(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Session() session: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.getEmailLabelStats(accessToken);
  }
  @Get('/currentuser')
  async getCurrentUser(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Session() session: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    return this.emailService.findRegisteredEmailData(userId, regEmail);

  }
  @Get('/users')
  async getUsers(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string }, @Session() session: Record<string, any>) {
    const userId = query.userid;
    return this.emailService.getUserEmailInfo(userId);
  }

  @Get('/emails')
  async fetchEmailsByFolder(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.fetchEmailsByFolder(accessToken, body.folder);
  }

  @Get('/labels')
  async getLabels(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.getLabels(accessToken);
  }
  @Get('/email')
  async getEmail(@Req() req: Request, @Res() res: Response, @Body() body: { id: string }, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.getEmailById(accessToken, body.id);

  }
  @Get('/searchemails')
  async searchEmails(@Req() req: Request, @Res() res: Response, @Body() body: { query: string }, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.searchEmails(accessToken, body.query);
  }
  @Get('/drafts')
  async getDraft(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.getDraftEmails(accessToken)
  }

  @Post('/createlabel')
  async createLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.createLabel(accessToken, body.name)
  }
  @Post('/deletelabel')
  async deleteLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.deleteLabel(accessToken, body.id)

  }
  @Post('/updateemailstarred')
  async updateEmailStarred(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.updateEmailStarred(accessToken, body.id, body.isStarred)

  }

  @Post('/moveemail')
  async moveEmail(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.moveEmail(accessToken, body.id, body.folder)
  }

  @Post('/applylabel')
  async applyLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.applyLabel(accessToken, body.emailId, body.labelId)
  }

  @Post('/removelabel')
  async removeLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.removeLabel(accessToken, body.emailId, body.labelId)
  }
  @Post('/savedraft')
  async saveDraft(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: { subject: string; body: string; recipients: string[]; }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.saveDraft(accessToken, body)
  }
  @Post('/sendemail')
  async sendEmail(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: { subject: string; body: string; recipients: string[]; }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    return this.emailService.sendEmail(accessToken, body)
  }

}
