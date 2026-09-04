export const RealtimeEvents = {
  NodeStatusChanged: 'node.status.changed',
  SensorValueUpdated: 'sensor.value.updated',
  AlertCreated: 'alert.created',
  AlertResolved: 'alert.resolved',
  MqttMessageReceived: 'mqtt.message.received',
  CommandCompleted: 'command.completed'
} as const;

export type RealtimeEventName = (typeof RealtimeEvents)[keyof typeof RealtimeEvents];
