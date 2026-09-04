import Link from 'next/link';
import { appConfig } from '../lib/config';

const nav = [
  { href: '/', label: 'Dashboard' },
  { href: '/nodos/', label: 'Nodes' },
  { href: '/sensores/', label: 'Sensors' },
  { href: '/historico/', label: 'History' },
  { href: '/alertas/', label: 'Alerts' },
  { href: '/mqtt/', label: 'MQTT' },
  { href: '/configuracion/', label: 'Settings' }
];

export function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),linear-gradient(180deg,#0b1120,#070b14)]">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800/80 bg-slate-950/80 p-6 backdrop-blur lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 font-semibold text-sky-200">NX</div>
          <div>
            <div className="font-semibold text-white">{appConfig.appName}</div>
            <div className="text-xs text-slate-500">MQTT Operations</div>
          </div>
        </div>
        <nav className="mt-10 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
          <div className="font-medium text-slate-200">Production boundary</div>
          <p className="mt-2 leading-5">Frontend talks only to the API. MQTT admin and database access stay server-side.</p>
        </div>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/70 px-6 py-5 backdrop-blur">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-sky-300/80">IoT Platform</div>
              <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">API ready</span>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sky-200">Cloudflare Pages</span>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
