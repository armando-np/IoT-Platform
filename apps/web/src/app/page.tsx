import { AppShell } from '@/components/app-shell';
import { DataPanel } from '@/components/data-panel';
import { MetricCard } from '@/components/metric-card';
import { StatusBadge } from '@/components/status-badge';
import { TelemetryChart } from '@/components/telemetry-chart';
import { alerts, events, metrics, nodes, sensors } from '@/lib/demo-data';

export default function DashboardPage() {
  return (
    <AppShell title="Operational dashboard" subtitle="MQTT fleet overview, realtime health, telemetry, and alerts.">
      <div className="card-grid">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TelemetryChart />
        <DataPanel title="System health" subtitle="Current state from API/WebSocket when connected.">
          <div className="space-y-4">
            {nodes.map((node) => (
              <div key={node.nodeId} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div>
                  <div className="font-medium text-white">{node.nodeId}</div>
                  <div className="text-xs text-slate-500">{node.name}</div>
                </div>
                <StatusBadge value={node.status} />
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <DataPanel title="Latest measurements" subtitle="Sensor registry keeps variables generic.">
          <div className="space-y-3">
            {sensors.slice(0, 5).map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between rounded-xl bg-slate-950/50 p-3">
                <div>
                  <div className="text-sm font-medium text-slate-100">{sensor.name}</div>
                  <div className="text-xs text-slate-500">{sensor.nodeId} / {sensor.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{sensor.lastValue} {sensor.unit}</div>
                  <StatusBadge value={sensor.status} />
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
        <DataPanel title="Active alerts" subtitle="Rules support threshold, duration, and cooldown.">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl bg-slate-950/50 p-3">
                <div className="flex items-center justify-between">
                  <StatusBadge value={alert.severity} />
                  <span className="text-xs text-slate-500">{alert.since}</span>
                </div>
                <div className="mt-3 text-sm font-medium text-slate-100">{alert.title}</div>
                <div className="text-xs text-slate-500">{alert.target}</div>
              </div>
            ))}
          </div>
        </DataPanel>
        <DataPanel title="Realtime events" subtitle="WebSocket events emitted by the API.">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={`${event.event}-${event.time}`} className="rounded-xl bg-slate-950/50 p-3">
                <div className="font-mono text-xs text-sky-200">{event.event}</div>
                <div className="mt-1 text-sm text-slate-300">{event.target}</div>
                <div className="text-xs text-slate-500">{event.time}</div>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
    </AppShell>
  );
}
