import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.service';

@Module({
  providers: [SocketGateway],
})
export class SocketModule {}
