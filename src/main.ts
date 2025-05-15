import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173' , // or use process.env.VITE_FRONTEND_URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY || 'default_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, 
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  await app.listen(process.env.PORT || 3006);
}
bootstrap();
