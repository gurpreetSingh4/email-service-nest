import { Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config'
@Injectable()
export class AppService {
constructor(private readonly configService: ConfigService){
  const demo  =this.configService.get('VITE_FRONTEND_URL')
  console.log(demo)
}
  getHello(): string {
    return 'Hello World!';
  }
}
