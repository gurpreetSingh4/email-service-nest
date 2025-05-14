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
  // Session,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Response, Request } from 'express';
import { Session } from 'src/common/decorators/session.decorator';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {
    console.log("hello ji email controller me h")
  }


  @Get('/getemaillabelstats')
  async getEmailLabelStats(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Get('/currentuser')
  async getCurrentUser(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Get('/users')
  async getUsers(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Get('/labels')
  async getLabels(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Get('/email')
  async getEmail(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Get('/searchemails')
  async searchEmails(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Get('/drafts')
  async getDraft(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/createlabel')
  async createLabel(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/deletelabel')
  async deleteLabel(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/updateemailstarred')
  async updateEmailStarred(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/moveemail')
  async moveEmail(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/applylabel')
  async applyLabel(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/removelabel')
  async removeLabel(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/savedraft')
  async saveDraft(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }
  @Post('/sendemail')
  async sendEmail(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
    
  }

}
