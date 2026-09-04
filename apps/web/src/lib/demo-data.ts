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
  { label: 'Total nodes', value: '3', delta: '+1 this week', tone: 'neutral' },
  { label: 'Online nodes', value: '2', delta: '66% available', tone: 'success' },
  { label: 'Active sensors', value: '8', delta: '1 warning', tone: 'warning' },
  { label: 'MQTT rate', value: '42/min', delta: 'last 15 min', tone: 'neutral' },
  { label: 'Active alerts', value: '2', delta: '1 critical', tone: 'danger' }
];

export const nodes: DemoNode[] = [
  { nodeId: 'NODE-001', name: 'Raspberry Pi Pico 2 W Lab', site: 'main-site', area: 'lab', status: 'ONLINE', firmware: '0.3.1', lastSeen: '18 seconds ago', sensors: 4 },
  { nodeId: 'NODE-002', name: 'Greenhouse edge node', site: 'main-site', area: 'greenhouse', status: 'ONLINE', firmware: '0.2.8', lastSeen: '43 seconds ago', sensors: 3 },
  { nodeId: 'NODE-003', name: 'Energy monitor prototype', site: 'main-site', area: 'workbench', status: 'OFFLINE', firmware: '0.1.9', lastSeen: '11 minutes ago', sensors: 1 }
];

export const sensors: DemoSensor[] = [
  { id: 'SEN-TEMP-001', name: 'Waterproof DS18B20', type: 'temperature', nodeId: 'NODE-001', unit: 'C', lastValue: '24.7', status: 'ACTIVE' },
  { id: 'SEN-DIST-001', name: 'HC-SR04 distance', type: 'level', nodeId: 'NODE-001', unit: 'cm', lastValue: '31.4', status: 'ACTIVE' },
  { id: 'SEN-AIR-001', name: 'ENS160 TVOC', type: 'tvoc', nodeId: 'NODE-001', unit: 'ppb', lastValue: '184', status: 'ACTIVE' },
  { id: 'SEN-HUM-001', name: 'AHT21 humidity', type: 'humidity', nodeId: 'NODE-001', unit: '%', lastValue: '48.2', status: 'ACTIVE' },
  { id: 'SEN-TEMP-002', name: 'Greenhouse temperature', type: 'temperature', nodeId: 'NODE-002', unit: 'C', lastValue: '29.1', status: 'ACTIVE' },
  { id: 'SEN-HUM-002', name: 'Greenhouse humidity', type: 'humidity', nodeId: 'NODE-002', unit: '%', lastValue: '68.4', status: 'ACTIVE' },
  { id: 'SEN-LUX-001', name: 'Canopy light', type: 'light', nodeId: 'NODE-002', unit: 'lux', lastValue: '18000', status: 'ACTIVE' },
  { id: 'SEN-PWR-001', name: 'Bench current', type: 'current', nodeId: 'NODE-003', unit: 'A', lastValue: '0.0', status: 'INACTIVE' }
];

export const alerts: DemoAlert[] = [
  { id: 'AL-001', severity: 'CRITICAL', title: 'Node offline > 5 minutes', target: 'NODE-003', since: '11 minutes ago', status: 'ACTIVE' },
  { id: 'AL-002', severity: 'WARNING', title: 'Temperature above lab threshold', target: 'SEN-TEMP-001', since: '2 minutes ago', status: 'ACTIVE' },
  { id: 'AL-003', severity: 'INFO', title: 'Configuration sync completed', target: 'NODE-002', since: '1 hour ago', status: 'RESOLVED' }
];

export const telemetrySeries = [
  { label: '12:00', temperature: 23.9, humidity: 49.2, pressure: 1009 },
  { label: '12:05', temperature: 24.1, humidity: 48.9, pressure: 1009.4 },
  { label: '12:10', temperature: 24.3, humidity: 48.7, pressure: 1009.1 },
  { label: '12:15', temperature: 24.7, humidity: 48.2, pressure: 1008.9 },
  { label: '12:20', temperature: 24.6, humidity: 48.1, pressure: 1008.7 },
  { label: '12:25', temperature: 24.8, humidity: 47.8, pressure: 1008.6 }
];

export const events = [
  { event: 'sensor.value.updated', target: 'SEN-TEMP-001', time: '18 sec ago' },
  { event: 'mqtt.message.received', target: 'NODE-001', time: '20 sec ago' },
  { event: 'node.status.changed', target: 'NODE-003', time: '11 min ago' },
  { event: 'alert.created', target: 'AL-001', time: '11 min ago' }
];
