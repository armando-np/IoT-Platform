"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/app-shell';
import { DataPanel } from '../../components/data-panel';
import { StatusBadge } from '../../components/status-badge';
import { getFromApi } from '../../lib/api-client';
import { clearSession } from '../../lib/auth';
import type { ApiSensor } from '../../lib/api-types';

export default function SensorsPage() {
  const router = useRouter();
  const [sensors, setSensors] = useState<ApiSensor[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    void getFromApi<ApiSensor[]>('/sensors').then((result) => {
      if (result.status === 401) {
        clearSession();
        router.push('/login/');
        return;
      }
      if (result.data) setSensors(result.data);
      else setError(result.error ?? 'No se pudieron cargar los sensores.');
    });
  }, [router]);

  return (
    <AppShell title="Sensors" subtitle="Catálogo real de sensores registrado en la API.">
      <DataPanel title="Sensor catalog" subtitle="Datos provenientes de NestJS; no se muestran valores de demostración.">
        {error ? <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div> : null}
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Sensor</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Node</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sensors.map((sensor) => (
                <tr key={sensor.sensorId}>
                  <td className="px-4 py-4"><div className="font-medium text-white">{sensor.name}</div><div className="text-xs text-slate-500">{sensor.sensorId}</div></td>
                  <td className="px-4 py-4 text-slate-300">{sensor.sensorType?.name ?? 'custom'}</td>
                  <td className="px-4 py-4 text-slate-300">{sensor.node?.nodeId ?? sensor.nodeId}</td>
                  <td className="px-4 py-4 text-slate-300">{sensor.unit}</td>
                  <td className="px-4 py-4"><StatusBadge value={sensor.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!sensors.length && !error ? <div className="mt-4 text-sm text-slate-500">No hay sensores registrados.</div> : null}
      </DataPanel>
    </AppShell>
  );
}
