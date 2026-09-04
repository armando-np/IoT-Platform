import {
  isCommandResponseMessage,
  isDeviceAlertMessage,
  isStatusMessage,
  isTelemetryMessage,
  parseJsonMessage,
  type CommandResponseMessage,
  type DeviceAlertMessage,
  type StatusMessage,
  type TelemetryMessage
} from '@nexaiot/shared';

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

export function validateTelemetryPayload(payload: string | Buffer): ValidationResult<TelemetryMessage> {
  return validateMqttPayload(payload, isTelemetryMessage, 'Payload does not match telemetry schema v1.0');
}

export function validateStatusPayload(payload: string | Buffer): ValidationResult<StatusMessage> {
  return validateMqttPayload(payload, isStatusMessage, 'Payload does not match status schema v1.0');
}

export function validateAlertPayload(payload: string | Buffer): ValidationResult<DeviceAlertMessage> {
  return validateMqttPayload(payload, isDeviceAlertMessage, 'Payload does not match alert schema v1.0');
}

export function validateCommandResponsePayload(payload: string | Buffer): ValidationResult<CommandResponseMessage> {
  return validateMqttPayload(payload, isCommandResponseMessage, 'Payload does not match command response schema v1.0');
}

function validateMqttPayload<T>(
  payload: string | Buffer,
  guard: (value: unknown) => value is T,
  schemaError: string
): ValidationResult<T> {
  try {
    const parsed = parseJsonMessage(payload);
    if (!guard(parsed)) {
      return { ok: false, error: schemaError };
    }
    const timestampMs = new Date((parsed as { timestamp: string }).timestamp).getTime();
    const maxFutureSkewMs = 5 * 60 * 1000;
    if (timestampMs > Date.now() + maxFutureSkewMs) {
      return { ok: false, error: 'Timestamp is too far in the future' };
    }
    return { ok: true, value: parsed };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid JSON payload' };
  }
}
