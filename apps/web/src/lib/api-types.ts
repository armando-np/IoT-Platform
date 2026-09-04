export interface ApiNode {
  id: string;
  nodeId: string;
  name: string;
  description: string | null;
  model: string;
  manufacturer: string;
  firmwareVersion: string | null;
  hardwareRevision: string | null;
  ipAddress: string | null;
  status: string;
  siteId: string;
  areaId: string;
  lastSeenAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  site?: { name: string };
  area?: { name: string };
  sensors?: ApiSensor[];
}

export interface ApiSensor {
  id: string;
  sensorId: string;
  nodeId: string;
  sensorTypeId: string;
  name: string;
  unit: string;
  description: string | null;
  location: string | null;
  minValue: number | null;
  maxValue: number | null;
  precision: number | null;
  expectedIntervalSeconds: number | null;
  status: string;
  metadata: Record<string, unknown>;
  config: Record<string, unknown>;
  sensorType?: { name: string; defaultUnit: string; valueSchema: Record<string, unknown> };
  node?: ApiNode;
}

export interface ApiTelemetryReading {
  id: string;
  time: string;
  nodeId: string;
  sensorId: string;
  valueNumber: number | null;
  valueText: string | null;
  valueBoolean: boolean | null;
  unit: string | null;
  quality: string;
  metadata: Record<string, unknown>;
  sensor?: ApiSensor;
  node?: ApiNode;
}

export interface ApiAlert {
  id: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
  sensorId?: string | null;
  nodeId?: string | null;
  sensor?: ApiSensor | null;
  node?: ApiNode | null;
  rule?: { name?: string } | null;
}

export interface TelemetrySeriesPoint {
  label: string;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
}
