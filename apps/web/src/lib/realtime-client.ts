import { io, type Socket } from 'socket.io-client';
import { appConfig } from './config';
import { getAccessToken } from './auth';

export function createRealtimeSocket(): Socket {
  const baseUrl = appConfig.wsUrl.replace(/\/realtime\/?$/, '');
  return io(baseUrl, {
    path: '/realtime',
    transports: ['websocket'],
    auth: {
      token: getAccessToken()
    }
  });
}
