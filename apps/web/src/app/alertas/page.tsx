import { AppShell } from '../../components/app-shell';
import { DataPanel } from '../../components/data-panel';
import { StatusBadge } from '../../components/status-badge';
import { alerts } from '../../lib/demo-data';

export default function AlertsPage() {
  return (
    <AppShell title="Alerts" subtitle="Rules for thresholds, offline windows, cooldowns, and severity.">
      <DataPanel title="Alert history and active incidents">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 md:flex-row md:items-center">
              <div>
                <div className="font-medium text-white">{alert.title}</div>
                <div className="text-xs text-slate-500">{alert.id} / {alert.target} / {alert.since}</div>
              </div>
              <div className="flex gap-2"><StatusBadge value={alert.severity} /><StatusBadge value={alert.status} /></div>
            </div>
          ))}
        </div>
      </DataPanel>
    </AppShell>
  );
}
