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




    // @Get('auth-url')
    // getAuthUrl() {
    //     return this.authService.getGoogleOAuthUrl();
    // }

    // @Get('callback')
    // async finalizeOAuth(@Req() req: Request, @Res() res: Response) {
    //     try {
    //         const code = req.query.code as string;
    //         if (!code) throw new HttpException('Missing code', HttpStatus.BAD_REQUEST);

    //         const sessionUserId = req.session?.user?.userId;
    //         if (!sessionUserId) throw new HttpException('Session missing userId', HttpStatus.UNAUTHORIZED);

    //         const tokens = await this.authService.getTokens(code);
    //         const userInfo = await this.authService.getUserInfo(tokens.access_token);

    //         // Follow same logic: check DB for email, save, set redis, redirect response, etc.

    //         return res.redirect(
    //             `${process.env.VITE_FRONTEND_URL}/oauthgmail/callback?success=true&regemail=${userInfo.email}&userid=${sessionUserId}`,
    //         );
    //     } catch (error) {
    //         console.error('OAuth callback error:', error);
    //         return res.status(500).json({ success: false, message: 'OAuth flow failed' });
    //     }
    // }

    // Add endpoints for refreshAccessToken and removeRegisteredEmail
//     @Get('callback')
// async finalizeOAuth(@Req() req: Request, @Res() res: Response) {
//   try {
//     const code = req.query.code as string;
//     const sessionUserId = req.session?.user?.userId;

//     if (!code || !sessionUserId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing authorization code or session userId',
//       });
//     }

//     const { redirectUrl } = await this.authService.finalizeOAuthFlow(sessionUserId, code, req.session);
//     return res.redirect(redirectUrl);
//   } catch (error) {
//     console.error('OAuth finalization error:', error);
//     return res.status(500).json({ success: false, message: 'OAuth finalization failed' });
//   }
// }

// @Get('refresh-access-token')
// async refreshAccessToken(@Query('userid') userid: string, @Query('regemail') regemail: string, @Res() res: Response) {
//   if (!userid || !regemail) {
//     return res.status(400).json({ success: false, message: 'Missing query parameters' });
//   }

//   try {
//     const result = await this.authService.refreshAccessToken(userid, regemail);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('Refresh access token error:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }

// @Delete('remove-registered-email')
// async removeRegisteredEmail(@Query('userid') userId: string, @Query('regemail') regemail: string, @Res() res: Response) {
//   if (!userId || !regemail) {
//     return res.status(400).json({ success: false, message: 'Missing query parameters' });
//   }

//   try {
//     const result = await this.authService.removeRegisteredEmailByUser(userId, regemail);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('Remove email error:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }

}
