import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { DATA_BASE_CONFIG } from './common/config/database.config';
import { MongooseConfigService } from './common/mongoose-config.service';
import { DatabaseModule } from './database/database.module';
import { OAuthModule } from './domain/oauth-module/OAuth.module';
import { EmailModule } from './domain/email-module/Email.module';
import { RouterModule } from '@nestjs/core';
import { RedisModule } from './domain/redis/redis.module';

@Module({
  imports: [
    OAuthModule,
    EmailModule,
    RedisModule,
    RouterModule.register([
      {
        path:'api/email',
        module: EmailModule,
      },
      {
        path:'api/email',
        module: OAuthModule,
      },


    ]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      cache: true,
      expandVariables: true,
      isGlobal: true,
      load: configuration

    }),
    // MongooseModule.forRoot(),
    // mongooseModule give dynamic module
    MongooseModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule], // no need to import it already global
      // useClass:[MongooseConfigService]// this is also way to do the same
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>("MONGODB_URI")
        // always return object
        return {
          uri // always return object of uri string
        }
      },
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
