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
import { Response, Request } from 'express';
import { Session } from 'src/common/decorators/session.decorator';
import { OAuthService } from './OAuth.service';
import { OAuthUtilFunctions } from 'src/utils/OAuth.util';

@Controller()
export class OAuthController {
    constructor(
        private readonly oAuthService: OAuthService,
        private oAuthUtilFn: OAuthUtilFunctions,
    ) {
        console.log("hello oauth controller")
    }

    @Get('/test')
    handleSession(@Session() session: Record<string, any>) {
        console.log(session)
    }

    @Get('/google')
    async redirectToGoogle(@Res() res: Response) {
        const url = await this.oAuthUtilFn.getGoogleOAuthUrl();
        return res.redirect(url);
    }

    @Get('google/callback')
    async googleCallback(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
        return await this.oAuthService.finalizeOAuth(req, res, session);
    }

    @Get('/refreshaccesstoken')
    async refreshAccessToken(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
        const result = await this.oAuthService.refreshAccToken(req, res, session);
        return res.status(200).json(result)

    }

    @Get('/deleteregisteredemail')
    async deleteRegEmail(@Req() req: Request, @Res() res: Response, @Session() session: Record<string, any>) {
        const result = await  this.oAuthService.deleteRegEmail(req, res, session);
        return result
    }



}
