import { isTelemetryMessage, parseJsonMessage, type TelemetryMessage } from '@nexaiot/shared';

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

export function validateTelemetryPayload(payload: string | Buffer): ValidationResult<TelemetryMessage> {
  try {
    const parsed = parseJsonMessage(payload);
    if (!isTelemetryMessage(parsed)) {
      return { ok: false, error: 'Payload does not match telemetry schema v1.0' };
    }
    const timestampMs = new Date(parsed.timestamp).getTime();
    const maxFutureSkewMs = 5 * 60 * 1000;
    if (timestampMs > Date.now() + maxFutureSkewMs) {
      return { ok: false, error: 'Timestamp is too far in the future' };
    }
    return { ok: true, value: parsed };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid JSON payload' };
  }
}
