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
    const result = await this.emailService.getEmailLabelStats(accessToken);
    res.status(200).json(result)

  }
  @Get('/currentuser')
  async getCurrentUser(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Session() session: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const result = await this.emailService.findRegisteredEmailData(userId, regEmail);
    res.status(200).json(result)

  }
  @Get('/users')
  async getUsers(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string }, @Session() session: Record<string, any>) {
    console.log(query)
    const userId = query.userid;
    const result = await this.emailService.getUserEmailInfo(userId);
    res.status(200).json(result)

  }

  @Get('/emails')
  async fetchEmailsByFolder(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string, folder: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const folder = query.folder
    console.log(userId, regEmail, "h yha nk")
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    console.log("acc token", accessToken)
    const result = await this.emailService.fetchEmailsByFolder(accessToken, folder);
    console.log(result, "kutaa")
    res.status(200).json(result)
  }

  @Get('/labels')
  async getLabels(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.getLabels(accessToken);
    res.status(200).json(result)

  }
  @Get('/email')
  async getEmail(@Req() req: Request, @Res() res: Response, @Body() body: { id: string }, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.getEmailById(accessToken, body.id);
    res.status(200).json(result)

  }
  @Get('/searchemails')
  async searchEmails(@Req() req: Request, @Res() res: Response, @Body() body: { query: string }, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.searchEmails(accessToken, body.query);
    res.status(200).json(result)

  }
  @Get('/drafts')
  async getDraft(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>, @Query() query: { userid: string, regemail: string }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.getDraftEmails(accessToken)
    res.status(200).json(result)

  }

  @Post('/createlabel')
  async createLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.createLabel(accessToken, body.name)
    res.status(200).json(result)

  }
  @Post('/deletelabel')
  async deleteLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.deleteLabel(accessToken, body.id)
    res.status(200).json(result)


  }
  @Post('/updateemailstarred')
  async updateEmailStarred(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.updateEmailStarred(accessToken, body.id, body.isStarred)
    res.status(200).json(result)


  }

  @Post('/moveemail')
  async moveEmail(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.moveEmail(accessToken, body.id, body.folder)
    res.status(200).json(result)

  }

  @Post('/applylabel')
  async applyLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.applyLabel(accessToken, body.emailId, body.labelId)
    res.status(200).json(result)

  }

  @Post('/removelabel')
  async removeLabel(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: Record<string, any>) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.removeLabel(accessToken, body.emailId, body.labelId)
    res.status(200).json(result)

  }
  @Post('/savedraft')
  async saveDraft(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: { subject: string; body: string; recipients: string[]; }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.saveDraft(accessToken, body)
    res.status(200).json(result)

  }
  @Post('/sendemail')
  async sendEmail(@Req() req: Request, @Res() res: Response, @Query() query: { userid: string, regemail: string }, @Body() body: { subject: string; body: string; recipients: string[]; }) {
    const userId = query.userid;
    const regEmail = query.regemail
    const accessToken = await this.emailUtilFn.getAccessToken(userId, regEmail)
    const result = await this.emailService.sendEmail(accessToken, body)
    res.status(200).json(result)

  }

}
