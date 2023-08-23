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
import http from 'http';
import { Server } from 'socket.io';
import { SocketGateway } from './socket/socket.service';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketIoAdapter } from './socket/socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // const server = http.createServer();
  // app.useWebSocketAdapter(new SocketIoAdapter(app));
  // const io = new Server(server);

  // io.on('connection', (socket) => {
  //   console.log('a user connected');

  //   const connectData = {
  //     status: true,
  //     message: 'Welcome to the socket.io server!',
  //     userCount: io.engine.clientsCount, // Number of connected clients
  //   };
  //   socket.emit('welcome', connectData);
  //   socket.on('disconnect', () => {
  //     console.log('a user disconnected');
  //   });
  // });

  // Start server
  const port = process.env.PORT || 3000;
  console.log('App listing port: ', port);
  await app.listen(port);
}

bootstrap();
