"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from './app-shell';
import { DataPanel } from './data-panel';
import { MetricCard } from './metric-card';
import { StatusBadge } from './status-badge';
import { TelemetryChart } from './telemetry-chart';
import { getFromApi } from '../lib/api-client';
import { clearSession, getAccessToken } from '../lib/auth';
import { createRealtimeSocket } from '../lib/realtime-client';
import type { ApiAlert, ApiNode, ApiSensor, ApiTelemetryReading } from '../lib/api-types';

export function RealDashboard() {
  const router = useRouter();
  const [nodes, setNodes] = useState<ApiNode[]>([]);
  const [sensors, setSensors] = useState<ApiSensor[]>([]);
  const [telemetry, setTelemetry] = useState<ApiTelemetryReading[]>([]);
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    const [nodesResult, sensorsResult, telemetryResult, alertsResult] = await Promise.all([
      getFromApi<ApiNode[]>('/nodes'),
      getFromApi<ApiSensor[]>('/sensors'),
      getFromApi<ApiTelemetryReading[]>('/telemetry?limit=100'),
      getFromApi<ApiAlert[]>('/alerts')
    ]);

    if ([nodesResult, sensorsResult, telemetryResult].some((result) => result.status === 401)) {
      clearSession();
      router.push('/login/');
      return;
    }

    if (!nodesResult.data || !sensorsResult.data || !telemetryResult.data) {
      setError(nodesResult.error ?? sensorsResult.error ?? telemetryResult.error ?? 'No se pudieron cargar los datos reales.');
      setLoading(false);
      return;
    }

    setNodes(nodesResult.data);
    setSensors(sensorsResult.data);
    setTelemetry(telemetryResult.data);
    setAlerts(alertsResult.data ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push('/login/');
      return;
    }
    void load();
  }, [load, router]);

  useEffect(() => {
    if (!getAccessToken()) return;
    const socket = createRealtimeSocket();
    socket.on('connect', () => setError(''));
    socket.on('connect_error', () => setError('WebSocket no disponible; mostrando el último estado de la API.'));
    socket.on('node.status.changed', () => void load());
    socket.on('sensor.value.updated', () => void load());
    socket.on('alert.created', () => void load());
    socket.on('alert.resolved', () => void load());
    return () => {
      socket.close();
    };
  }, [load]);

  const latestBySensor = useMemo(() => {
    const map = new Map<string, ApiTelemetryReading>();
    for (const row of telemetry) {
      const current = map.get(row.sensorId);
      if (!current || new Date(row.time).getTime() > new Date(current.time).getTime()) map.set(row.sensorId, row);
    }
    return map;
  }, [telemetry]);

  const metrics = useMemo(() => {
    const online = nodes.filter((node) => node.status === 'ONLINE').length;
    const active = sensors.filter((sensor) => sensor.status === 'ACTIVE').length;
    return [
      { label: 'Total nodes', value: String(nodes.length), delta: online ? `${online} online` : 'Sin nodos online', tone: online ? 'success' as const : 'warning' as const },
      { label: 'Online nodes', value: String(online), delta: nodes.length ? 'Estado real desde API' : 'Sin datos', tone: online ? 'success' as const : 'warning' as const },
      { label: 'Sensors', value: String(sensors.length), delta: `${active} activos`, tone: active ? 'success' as const : 'warning' as const },
      { label: 'Telemetry', value: String(telemetry.length), delta: 'Últimas lecturas API', tone: telemetry.length ? 'success' as const : 'warning' as const },
      { label: 'Active alerts', value: String(alerts.filter((alert) => alert.status === 'ACTIVE').length), delta: 'Estado real desde API', tone: alerts.some((alert) => alert.status === 'ACTIVE') ? 'danger' as const : 'success' as const }
    ];
  }, [alerts, nodes, sensors, telemetry]);

  const selectedSensors = sensors.slice(0, 5);

  return (
    <AppShell title="Operational dashboard" subtitle="Datos reales desde NestJS, PostgreSQL/TimescaleDB y eventos realtime.">
      {error ? <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">{error}</div> : null}
      {loading ? <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">Cargando datos reales...</div> : null}
      <div className="card-grid">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TelemetryChart telemetry={telemetry} />
        <DataPanel title="System health" subtitle="Estado actual del backend y de los nodos registrados.">
          <div className="space-y-4">
            {nodes.map((node) => (
              <div key={node.nodeId} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div>
                  <div className="font-medium text-white">{node.nodeId}</div>
                  <div className="text-xs text-slate-500">{node.name}</div>
                </div>
                <StatusBadge value={node.status} />
              </div>
            ))}
            {!nodes.length && !loading ? <div className="text-sm text-slate-500">No hay nodos registrados.</div> : null}
          </div>
        </DataPanel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <DataPanel title="Latest measurements" subtitle="Último valor almacenado por sensor.">
          <div className="space-y-3">
            {selectedSensors.map((sensor) => {
              const reading = latestBySensor.get(sensor.id);
              const value = reading?.valueNumber ?? reading?.valueText ?? (reading?.valueBoolean === undefined ? null : String(reading.valueBoolean));
              return (
                <div key={sensor.sensorId} className="flex items-center justify-between rounded-xl bg-slate-950/50 p-3">
                  <div>
                    <div className="text-sm font-medium text-slate-100">{sensor.name}</div>
                    <div className="text-xs text-slate-500">{sensor.sensorId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">{value === null ? 'Sin datos' : `${value} ${reading?.unit ?? sensor.unit}`}</div>
                    <StatusBadge value={reading?.quality ?? sensor.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </DataPanel>
        <DataPanel title="Active alerts" subtitle="Alertas almacenadas en la API.">
          <div className="space-y-3">
            {alerts.filter((alert) => alert.status === 'ACTIVE').slice(0, 5).map((alert) => (
              <div key={alert.id} className="rounded-xl bg-slate-950/50 p-3">
                <div className="flex items-center justify-between">
                  <StatusBadge value={alert.severity} />
                  <span className="text-xs text-slate-500">{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-3 text-sm font-medium text-slate-100">{alert.rule?.name ?? 'Alert'}</div>
                <div className="text-xs text-slate-500">{alert.node?.nodeId ?? 'Nodo no indicado'}</div>
              </div>
            ))}
            {!alerts.some((alert) => alert.status === 'ACTIVE') ? <div className="text-sm text-slate-500">No hay alertas activas.</div> : null}
          </div>
        </DataPanel>
        <DataPanel title="Realtime status" subtitle="Conexión de Socket.IO al gateway existente.">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
            El dashboard actualiza sus datos al recibir eventos <span className="font-mono text-sky-200">node.status.changed</span>, <span className="font-mono text-sky-200">sensor.value.updated</span> y eventos de alertas.
          </div>
        </DataPanel>
      </div>
    </AppShell>
  );
}
