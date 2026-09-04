import { telemetrySeries } from '@/lib/demo-data';

function points(values: number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / spread) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function TelemetryChart() {
  const temperature = telemetrySeries.map((item) => item.temperature);
  const humidity = telemetrySeries.map((item) => item.humidity);
  return (
    <section className="panel rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Telemetry trend</h2>
          <p className="mt-1 text-sm text-slate-400">Last 30 minutes, downsampled for dashboard use.</p>
        </div>
        <div className="text-xs text-slate-500">DEMO until API is connected</div>
      </div>
      <svg className="mt-6 h-64 w-full" viewBox="0 0 600 220" role="img" aria-label="Telemetry trend chart">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(56,189,248)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(56,189,248)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="0" x2="600" y1={line * 55} y2={line * 55} stroke="rgba(148,163,184,0.16)" />
        ))}
        <polyline fill="none" stroke="rgb(56,189,248)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points(temperature, 600, 200)} />
        <polyline fill="none" stroke="rgb(34,197,94)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points(humidity, 600, 200)} />
      </svg>
      <div className="mt-4 flex gap-4 text-xs text-slate-400">
        <span>Temperature</span>
        <span>Humidity</span>
      </div>
    </section>
  );
}
