import { AppShell } from '../../components/app-shell';
import { DataPanel } from '../../components/data-panel';
import { TelemetryChart } from '../../components/telemetry-chart';

export default function HistoryPage() {
  return (
    <AppShell title="Historical telemetry" subtitle="Time-series queries support 5 minutes, 1 hour, 24 hours, 7 days, 30 days, and custom ranges.">
      <div className="grid gap-6">
        <DataPanel title="Query controls" subtitle="Controls are static in this Cloudflare Pages base until API integration is connected.">
          <div className="grid gap-3 md:grid-cols-6">
            {['5m', '1h', '24h', '7d', '30d', 'custom'].map((range) => <button key={range} className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">{range}</button>)}
          </div>
        </DataPanel>
        <TelemetryChart telemetry={[]}  />
      </div>
    </AppShell>
  );
}
