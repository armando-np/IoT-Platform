export const MQTT_SCHEMA_VERSION = '1.0';

export type MqttMessageKind = 'telemetry' | 'status' | 'heartbeat' | 'event' | 'alert' | 'command' | 'response' | 'config';

export interface BaseMqttMessage<TPayload = unknown> {
  schemaVersion: string;
  messageId: string;
  timestamp: string;
  nodeId: string;
  sequence?: number;
  payload: TPayload;
}

export interface SensorValuePayload {
  sensors: Record<
    string,
    {
      value: number | string | boolean;
      unit?: string;
      quality?: 'GOOD' | 'WARN' | 'BAD';
      metadata?: Record<string, unknown>;
    }
  >;
}

export type TelemetryMessage = BaseMqttMessage<SensorValuePayload>;

export interface StatusPayload {
  status: 'ONLINE' | 'OFFLINE' | 'UNKNOWN' | 'MAINTENANCE' | 'DISABLED';
  firmwareVersion?: string;
  ipAddress?: string;
  uptimeSeconds?: number;
  reason?: string;
}

export type StatusMessage = BaseMqttMessage<StatusPayload>;

export interface CommandPayload {
  command: 'reboot' | 'sync' | 'request_status' | 'update_config' | 'update_firmware' | 'custom_command';
  parameters: Record<string, unknown>;
  timeoutSeconds?: number;
}

export type CommandMessage = BaseMqttMessage<CommandPayload>;

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && value.includes('T');
}

export function isTelemetryMessage(value: unknown): value is TelemetryMessage {
  if (!isObject(value)) return false;
  if (typeof value.schemaVersion !== 'string') return false;
  if (typeof value.messageId !== 'string') return false;
  if (!isIsoTimestamp(value.timestamp)) return false;
  if (typeof value.nodeId !== 'string') return false;
  if (!isObject(value.payload)) return false;
  if (!isObject(value.payload.sensors)) return false;
  return Object.values(value.payload.sensors).every((sensor) => {
    if (!isObject(sensor)) return false;
    return ['number', 'string', 'boolean'].includes(typeof sensor.value);
  });
}

export function parseJsonMessage(input: string | Buffer): unknown {
  const raw = Buffer.isBuffer(input) ? input.toString('utf8') : input;
  return JSON.parse(raw) as unknown;
}
