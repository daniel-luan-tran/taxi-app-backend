import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Account, BOOKINGSTATUS } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { BookingHistoryService } from 'src/booking-history/booking-history.service';
import { CustomLogger } from 'src/logger/logger.service';
import { CreateBookingDto } from 'src/booking-history/dto/create-booking-history.dto';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly bookingHistoryService: BookingHistoryService) {}
  @WebSocketServer()
  server: Server;

  driverSocket: Socket = null;
  passengerSocket: Socket = null;
  passengerAccount: Account = null;
  passengerRoute: any = null;

  public afterInit(server: any) {
    console.log('Init gateway');
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
  }

  public handleConnection(socket: Socket) {
    console.log('A user connected');

    const connectData = {
      status: true,
      message: 'Welcome to the socket.io server!',
      userCount: this.server.engine.clientsCount, // Number of connected clients
    };

    socket.on('passengerRequest', (data) => {
      this.driverSocket = socket;
      console.log('passengerRequest', data);
      if (this.driverSocket)
        this.driverSocket.on('driverDisconnect', () => {
          this.passengerSocket.emit('driverDisconnect');
          this.driverSocket.disconnect();
        });
      if (this.passengerSocket)
        this.passengerSocket.emit('passengerRequest', 'passengerRequest');
    });

    socket.on('foundDriver', (data) => {
      if (this.driverSocket) this.driverSocket.emit('foundDriver', data);
    });

    socket.on('driverRequest', (data) => {
      this.passengerSocket = socket;
      if (!this.driverSocket) return;
      console.log('driverRequest', data);
      this.driverSocket.emit('driverRequest', data);

      this.passengerRoute = data.passengerRoute;
      this.passengerAccount = data.passengerAccount;

      this.passengerSocket.on('passengerDisconnect', () => {
        console.log('passengerDisconnect');
        this.driverSocket.emit('passengerDisconnect');
        this.passengerSocket.disconnect();
        // Chỗ này hok cần
        this.driverSocket.disconnect();
      });

      this.passengerSocket.on('userCancelBooking', () => {
        this.driverSocket.emit('userCancelBooking');
      });
    });

    socket.on('acceptPassenger', (data) => {
      if (!this.passengerSocket) return;
      console.log('driverLocation', data);
      this.passengerSocket.emit('acceptPassenger', data);

      this.driverSocket.on('driverDisconnect', () => {
        console.log('driverDisconnect');
        this.passengerSocket.emit('driverDisconnect');
        this.driverSocket.disconnect();
        // Chỗ này hok cần
        this.passengerSocket.disconnect();
      });

      this.driverSocket.on('updatedBooking', () => {
        this.passengerSocket.emit('updatedBooking');
      });
    });
  }

  public handleDisconnect(socket: Socket) {
    console.log('A user disconnected');
  }

  @SubscribeMessage('onNewMessage')
  public onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
