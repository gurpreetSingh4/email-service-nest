import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY || 'default_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    }),
  );

  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  //   credentials: true,
  // });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
