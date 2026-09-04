export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'NexaIoT',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001/realtime'
};
