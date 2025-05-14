import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios'

@Injectable()
export class EmailUtilFunctions {
    private readonly logger = new Logger(EmailUtilFunctions.name);
    constructor(
        private readonly configService: ConfigService,

    ) { }

    
}