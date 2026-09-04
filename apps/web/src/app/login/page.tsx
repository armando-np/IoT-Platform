import { AppShell } from '@/components/app-shell';
import { DataPanel } from '@/components/data-panel';

export default function LoginPage() {
  return (
    <AppShell title="Login" subtitle="JWT authentication is handled by the NestJS API.">
      <DataPanel title="Authentication form" subtitle="This form is intentionally static in the base; wire it to POST /api/v1/auth/login before production.">
        <form className="max-w-md space-y-4">
          <input type="email" placeholder="Email" className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100" />
          <input type="password" placeholder="Password" className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100" />
          <button disabled className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-500">Login TODO</button>
        </form>
      </DataPanel>
    </AppShell>
  );
}
