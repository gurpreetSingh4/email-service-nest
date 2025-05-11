import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor() {
        console.log("email service is working well")
    }
}