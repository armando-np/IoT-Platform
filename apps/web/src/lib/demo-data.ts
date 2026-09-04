import type { AlertSeverity, NodeStatus } from '@nexaiot/shared';

export interface DashboardMetric {
  label: string;
  value: string;
  delta: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
}

export interface DemoNode {
  nodeId: string;
  name: string;
  site: string;
  area: string;
  status: NodeStatus;
  firmware: string;
  lastSeen: string;
  sensors: number;
}

export interface DemoSensor {
  id: string;
  name: string;
  type: string;
  nodeId: string;
  unit: string;
  lastValue: string;
  status: 'ACTIVE' | 'INACTIVE' | 'FAULT' | 'MAINTENANCE';
}

export interface DemoAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  target: string;
  since: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export const metrics: DashboardMetric[] = [
  { label: 'Total nodes', value: '1', delta: 'Pico 2 W registrado', tone: 'neutral' },
  { label: 'Online nodes', value: '0', delta: 'Sin MQTT real todavía', tone: 'warning' },
  { label: 'Active sensors', value: '9', delta: 'Sensores físicos definidos', tone: 'neutral' },
  { label: 'MQTT rate', value: '0/min', delta: 'Broker no conectado aún', tone: 'neutral' },
  { label: 'Active alerts', value: '0', delta: 'Sin alertas reales', tone: 'success' }
];

export const nodes: DemoNode[] = [
  {
    nodeId: 'PICO2W-001',
    name: 'Raspberry Pi Pico 2 W - Estación Ambiental',
    site: 'Casa / Laboratorio',
    area: 'Protoboard principal',
    status: 'OFFLINE',
    firmware: 'Pendiente',
    lastSeen: 'Sin datos MQTT recibidos',
    sensors: 9
  }
];

export const sensors: DemoSensor[] = [
  { id: 'BME280-TEMP', name: 'Temperatura BME280', type: 'temperature', nodeId: 'PICO2W-001', unit: '°C', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'BME280-HUM', name: 'Humedad BME280', type: 'humidity', nodeId: 'PICO2W-001', unit: '%', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'BME280-PRESS', name: 'Presión BME280', type: 'pressure', nodeId: 'PICO2W-001', unit: 'hPa', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'ENS160-TVOC', name: 'TVOC ENS160', type: 'tvoc', nodeId: 'PICO2W-001', unit: 'ppb', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'ENS160-ECO2', name: 'eCO₂ ENS160', type: 'eco2', nodeId: 'PICO2W-001', unit: 'ppm', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'ENS160-AQI', name: 'AQI ENS160', type: 'aqi', nodeId: 'PICO2W-001', unit: 'AQI', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'AHT21-TEMP', name: 'Temperatura AHT21', type: 'temperature', nodeId: 'PICO2W-001', unit: '°C', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'AHT21-HUM', name: 'Humedad AHT21', type: 'humidity', nodeId: 'PICO2W-001', unit: '%', lastValue: 'Sin datos', status: 'INACTIVE' },
  { id: 'DS18B20-TEMP', name: 'Temperatura externa DS18B20', type: 'temperature', nodeId: 'PICO2W-001', unit: '°C', lastValue: 'Sin datos', status: 'INACTIVE' }
];

export const alerts: DemoAlert[] = [];

export const telemetrySeries: Array<{
  label: string;
  temperature: number;
  humidity: number;
  pressure: number;
}> = [];

export const events: Array<{
  event: string;
  target: string;
  time: string;
}> = [];
