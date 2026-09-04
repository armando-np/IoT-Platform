import { AppShell } from '@/components/app-shell';
import { DataPanel } from '@/components/data-panel';
import { StatusBadge } from '@/components/status-badge';
import { sensors } from '@/lib/demo-data';

export default function SensorsPage() {
  return (
    <AppShell title="Sensors" subtitle="Flexible sensor registry for temperature, humidity, pressure, energy, GPS, and custom variables.">
      <DataPanel title="Sensor catalog" subtitle="Adding new sensor types should mainly be data configuration, not new code.">
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Sensor</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Node</th><th className="px-4 py-3">Last value</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sensors.map((sensor) => (
                <tr key={sensor.id}>
                  <td className="px-4 py-4"><div className="font-medium text-white">{sensor.name}</div><div className="text-xs text-slate-500">{sensor.id}</div></td>
                  <td className="px-4 py-4 text-slate-300">{sensor.type}</td>
                  <td className="px-4 py-4 text-slate-300">{sensor.nodeId}</td>
                  <td className="px-4 py-4 text-slate-300">{sensor.lastValue} {sensor.unit}</td>
                  <td className="px-4 py-4"><StatusBadge value={sensor.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </AppShell>
  );
}
