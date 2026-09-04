import clsx from 'clsx';

const toneClasses = {
  ONLINE: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  ACTIVE: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  OFFLINE: 'border-red-400/30 bg-red-400/10 text-red-200',
  CRITICAL: 'border-red-400/30 bg-red-400/10 text-red-200',
  WARNING: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  INFO: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  UNKNOWN: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
  MAINTENANCE: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-200',
  DISABLED: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  INACTIVE: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  FAULT: 'border-red-400/30 bg-red-400/10 text-red-200',
  RESOLVED: 'border-slate-500/30 bg-slate-500/10 text-slate-300'
};

export function StatusBadge({ value }: { value: keyof typeof toneClasses | string }) {
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', toneClasses[value as keyof typeof toneClasses] ?? toneClasses.UNKNOWN)}>
      {value}
    </span>
  );
}
