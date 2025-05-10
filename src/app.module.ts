import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_CONFIG } from './common/config/app.config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env'],
    cache: true,
    expandVariables: true,
    isGlobal: true,
    load: [APP_CONFIG,]

  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
