import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: socketio.ServerOptions,
  ): socketio.Server {
    const server = super.createIOServer(port, options);

    // Add any additional configuration to the server if needed
    // For example, you can implement authorization or middleware here

    return server;
  }
}
