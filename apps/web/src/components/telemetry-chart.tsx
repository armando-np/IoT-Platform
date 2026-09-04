import type { ApiTelemetryReading, TelemetrySeriesPoint } from '../lib/api-types';

function points(values: number[], width: number, height: number) {
  if (values.length < 2) return '';
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

function buildSeries(rows: ApiTelemetryReading[]): TelemetrySeriesPoint[] {
  const buckets = new Map<string, TelemetrySeriesPoint>();
  for (const row of rows) {
    const sensorId = row.sensor?.sensorId;
    if (!sensorId || row.valueNumber === null) continue;
    const bucket = new Date(row.time);
    bucket.setSeconds(0, 0);
    const label = bucket.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const point = buckets.get(label) ?? { label, temperature: null, humidity: null, pressure: null };
    if (sensorId.includes('TEMP')) point.temperature = row.valueNumber;
    else if (sensorId.includes('HUM')) point.humidity = row.valueNumber;
    else if (sensorId.includes('PRESS')) point.pressure = row.valueNumber;
    buckets.set(label, point);
  }
  return Array.from(buckets.values()).slice(-30);
}

export function TelemetryChart({ telemetry }: { telemetry: ApiTelemetryReading[] }) {
  const series = buildSeries(telemetry);
  const temperature = series.flatMap((item) => item.temperature === null ? [] : [item.temperature]);
  const humidity = series.flatMap((item) => item.humidity === null ? [] : [item.humidity]);

  return (
    <section className="panel rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Telemetry trend</h2>
          <p className="mt-1 text-sm text-slate-400">Últimas lecturas reales disponibles en la API.</p>
        </div>
        <div className="text-xs text-emerald-300">LIVE API</div>
      </div>
      {series.length < 2 ? (
        <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
          No hay suficientes lecturas para mostrar una tendencia.
        </div>
      ) : (
        <svg className="mt-6 h-64 w-full" viewBox="0 0 600 220" role="img" aria-label="Telemetry trend chart">
          {[0, 1, 2, 3].map((line) => (
            <line key={line} x1="0" x2="600" y1={line * 55} y2={line * 55} stroke="rgba(148,163,184,0.16)" />
          ))}
          {temperature.length > 1 ? <polyline fill="none" stroke="rgb(56,189,248)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points(temperature, 600, 200)} /> : null}
          {humidity.length > 1 ? <polyline fill="none" stroke="rgb(34,197,94)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points(humidity, 600, 200)} /> : null}
        </svg>
      )}
      <div className="mt-4 flex gap-4 text-xs text-slate-400">
        <span>Temperature</span>
        <span>Humidity</span>
      </div>
    </section>
  );
}
