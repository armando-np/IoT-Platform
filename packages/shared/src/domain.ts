export type NodeStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN' | 'MAINTENANCE' | 'DISABLED';
export type SensorStatus = 'ACTIVE' | 'INACTIVE' | 'FAULT' | 'MAINTENANCE';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type CommandStatus = 'PENDING' | 'SENT' | 'ACKNOWLEDGED' | 'FAILED' | 'TIMEOUT';

export interface SensorDefinition {
  id: string;
  nodeId: string;
  name: string;
  type: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  precision?: number;
  expectedIntervalSeconds?: number;
  metadata?: Record<string, unknown>;
}

export interface NodeDefinition {
  id: string;
  nodeId: string;
  name: string;
  site: string;
  area: string;
  status: NodeStatus;
  lastSeen?: string;
}
