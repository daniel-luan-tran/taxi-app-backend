import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('Init gateway');
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
  }

  handleConnection(socket: Socket) {
    console.log('A user connected');

    const connectData = {
      status: true,
      message: 'Welcome to the socket.io server!',
      userCount: this.server.engine.clientsCount, // Number of connected clients
    };
    socket.emit('welcome', connectData);
  }

  handleDisconnect(socket: Socket) {
    console.log('A user disconnected');
  }

  @SubscribeMessage('onNewMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
