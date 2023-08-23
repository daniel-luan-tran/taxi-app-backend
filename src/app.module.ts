import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { LogRequestsMiddleware } from './common/middlewares/log-requests.middleware';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { SocketModule } from './socket/socket.module';
import { SocketIoAdapter } from './socket/socketio.adapter';
import { SocketGateway } from './socket/socket.service';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    UsersModule,
    LoggerModule,
    SocketModule,
    // SocketGateway,
    // SocketIoAdapter,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogRequestsMiddleware).forRoutes('*');
  }
}
