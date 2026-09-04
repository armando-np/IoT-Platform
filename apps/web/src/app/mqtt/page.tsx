import { AppShell } from '@/components/app-shell';
import { DataPanel } from '@/components/data-panel';

const topics = [
  'iot/{environment}/{site}/{area}/{nodeId}/status',
  'iot/{environment}/{site}/{area}/{nodeId}/telemetry',
  'iot/{environment}/{site}/{area}/{nodeId}/event',
  'iot/{environment}/{site}/{area}/{nodeId}/command',
  'iot/{environment}/{site}/{area}/{nodeId}/config',
  'iot/{environment}/{site}/{area}/{nodeId}/response',
  'iot/{environment}/{site}/{area}/{nodeId}/{sensorId}/telemetry'
];

export default function MqttPage() {
  return (
    <AppShell title="MQTT architecture" subtitle="Topic conventions, payload schemas, QoS, retained state, and LWT.">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DataPanel title="Topic convention">
          <div className="space-y-3">
            {topics.map((topic) => <code key={topic} className="block rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-sky-200">{topic}</code>)}
          </div>
        </DataPanel>
        <DataPanel title="Payload baseline">
          <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">{JSON.stringify({ schemaVersion: '1.0', messageId: 'msg-001', timestamp: '2026-09-03T12:00:00Z', nodeId: 'NODE-001', sequence: 1, payload: { sensors: { temperature: { value: 24.7, unit: 'C' } } } }, null, 2)}</pre>
        </DataPanel>
      </div>
    </AppShell>
  );
}
