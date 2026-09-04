import { validateTelemetryPayload } from './mqtt-message.validator';

describe('validateTelemetryPayload', () => {
  it('accepts a valid telemetry message', () => {
    const result = validateTelemetryPayload(
      JSON.stringify({
        schemaVersion: '1.0',
        messageId: 'msg-1',
        timestamp: '2026-09-03T12:00:00Z',
        nodeId: 'NODE-001',
        sequence: 1,
        payload: { sensors: { temperature: { value: 24.7, unit: 'C' } } }
      })
    );
    expect(result.ok).toBe(true);
  });

  it('rejects malformed messages', () => {
    const result = validateTelemetryPayload(JSON.stringify({ nodeId: 'NODE-001' }));
    expect(result.ok).toBe(false);
  });
});
