export interface TopicParts {
  root: string;
  environment: string;
  site: string;
  area: string;
  nodeId: string;
  sensorId?: string;
}

export type TopicKind = 'status' | 'telemetry' | 'event' | 'command' | 'config' | 'response' | 'heartbeat';

export function buildNodeTopic(parts: TopicParts, kind: TopicKind): string {
  return [parts.root, parts.environment, parts.site, parts.area, parts.nodeId, kind].join('/');
}

export function buildSensorTopic(parts: Required<TopicParts>, kind: 'telemetry'): string {
  return [parts.root, parts.environment, parts.site, parts.area, parts.nodeId, parts.sensorId, kind].join('/');
}

export function buildSharedSubscription(group: string, topic: string): string {
  return `$share/${group}/${topic}`;
}

export function telemetryWildcard(root = 'iot', environment = '+'): string {
  return `${root}/${environment}/+/+/+/telemetry`;
}

export function statusWildcard(root = 'iot', environment = '+'): string {
  return `${root}/${environment}/+/+/+/status`;
}
