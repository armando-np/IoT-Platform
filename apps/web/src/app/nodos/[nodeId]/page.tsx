import { AppShell } from '@/components/app-shell';
import { DataPanel } from '@/components/data-panel';
import { StatusBadge } from '@/components/status-badge';
import { nodes, sensors, telemetrySeries } from '@/lib/demo-data';

export function generateStaticParams() {
  return nodes.map((node) => ({ nodeId: node.nodeId }));
}

export default async function NodeDetailPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = nodes.find((item) => item.nodeId === nodeId) ?? nodes[0];
  const nodeSensors = sensors.filter((sensor) => sensor.nodeId === node.nodeId);
  return (
    <AppShell title={node.nodeId} subtitle="Node detail, sensors, telemetry, events, logs, commands, and configuration.">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DataPanel title="General information">
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div><dt className="text-slate-500">Name</dt><dd className="mt-1 text-slate-100">{node.name}</dd></div>
            <div><dt className="text-slate-500">Status</dt><dd className="mt-1"><StatusBadge value={node.status} /></dd></div>
            <div><dt className="text-slate-500">Site</dt><dd className="mt-1 text-slate-100">{node.site}</dd></div>
            <div><dt className="text-slate-500">Area</dt><dd className="mt-1 text-slate-100">{node.area}</dd></div>
            <div><dt className="text-slate-500">Firmware</dt><dd className="mt-1 text-slate-100">{node.firmware}</dd></div>
            <div><dt className="text-slate-500">Last seen</dt><dd className="mt-1 text-slate-100">{node.lastSeen}</dd></div>
          </dl>
        </DataPanel>
        <DataPanel title="Command console" subtitle="Actions are disabled until API auth and command endpoint are connected.">
          <div className="grid gap-3 sm:grid-cols-2">
            {['request_status', 'sync', 'reboot', 'update_config'].map((command) => (
              <button key={command} disabled className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-left text-sm text-slate-500">
                {command}
                <span className="ml-2 text-xs text-amber-300">TODO</span>
              </button>
            ))}
          </div>
        </DataPanel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DataPanel title="Sensors">
          <div className="space-y-3">
            {nodeSensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div>
                  <div className="font-medium text-white">{sensor.name}</div>
                  <div className="text-xs text-slate-500">{sensor.type} / {sensor.id}</div>
                </div>
                <div className="text-right text-sm text-slate-300">{sensor.lastValue} {sensor.unit}</div>
              </div>
            ))}
          </div>
        </DataPanel>
        <DataPanel title="Recent telemetry">
          <div className="space-y-3">
            {telemetrySeries.map((row) => (
              <div key={row.label} className="grid grid-cols-4 rounded-xl bg-slate-950/50 p-3 text-sm">
                <div className="text-slate-500">{row.label}</div>
                <div>{row.temperature} C</div>
                <div>{row.humidity} %</div>
                <div>{row.pressure} hPa</div>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
    </AppShell>
  );
}
