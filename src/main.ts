import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import helmet from 'helmet';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import * as passport from 'passport';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const ssl = process.env.SSL === 'true' ? true : false;
  // const isProduction = process.env.NODE_ENV === 'production';
  let app = null;
  let hostname = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    const httpsOptions = {
      key: fs.readFileSync(path.join(keyPath)),
      cert: fs.readFileSync(path.join(certPath)),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
    hostname = process.env.HOST_NAME || 'localhost';
  } else {
    app = await NestFactory.create(AppModule);
  }

  // Prisma ORM
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Global pipes and filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      transform: true,
      skipNullProperties: true,
    }),
  );

  // Cookies and sessions
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.APP_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 Day
        sameSite: 'strict',
        httpOnly: true,
        domain: '.dalutechtaxiapp.online', // For deploy
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, // 2 Min
        dbRecordIdIsSessionId: true,
      }),
    }),
  );

  // Authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Security
  app.use(helmet());
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Start server
  const port = process.env.PORT || 3000;

  if (ssl) {
    await app.listen(port, hostname, () => {
      const address =
        'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
      console.log('Addess: ', address);
    });
  } else {
    await app.listen(port);
  }
}

bootstrap();
