import { AppShell } from '../../components/app-shell';
import { DataPanel } from '../../components/data-panel';
import { appConfig } from '../../lib/config';

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Environment and integration settings for the static frontend.">
      <DataPanel title="Frontend runtime configuration">
        <dl className="space-y-4 text-sm">
          <div><dt className="text-slate-500">API base URL</dt><dd className="mt-1 font-mono text-slate-100">{appConfig.apiBaseUrl}</dd></div>
          <div><dt className="text-slate-500">WebSocket URL</dt><dd className="mt-1 font-mono text-slate-100">{appConfig.wsUrl}</dd></div>
          <div><dt className="text-slate-500">Deployment target</dt><dd className="mt-1 text-slate-100">Cloudflare Pages static export</dd></div>
        </dl>
      </DataPanel>
    </AppShell>
  );
}
