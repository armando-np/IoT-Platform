import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';
import type { RealtimeEventName } from '@nexaiot/shared';

@Injectable()
export class RealtimeService {
  private server?: Server;

  bind(server: Server) {
    this.server = server;
  }

  emit(event: RealtimeEventName, payload: unknown) {
    this.server?.emit(event, payload);
  }
}
