import clsx from 'clsx';
import type { DashboardMetric } from '@/lib/demo-data';

const tones = {
  neutral: 'from-sky-500/10 to-slate-900/40',
  success: 'from-emerald-500/10 to-slate-900/40',
  warning: 'from-amber-500/10 to-slate-900/40',
  danger: 'from-red-500/10 to-slate-900/40'
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <section className={clsx('panel rounded-2xl bg-gradient-to-br p-5', tones[metric.tone])}>
      <div className="text-sm text-slate-400">{metric.label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{metric.value}</div>
      <div className="mt-2 text-xs text-slate-400">{metric.delta}</div>
    </section>
  );
}
