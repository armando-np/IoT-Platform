export interface TopicParts {
  root: string;
  environment: string;
  site: string;
  area: string;
  nodeId: string;
  sensorId?: string;
}

export type TopicKind = 'status' | 'telemetry' | 'event' | 'command' | 'config' | 'response' | 'heartbeat';
export type CloudNodeTopicKind = 'telemetry' | 'status' | 'alerts' | 'commands' | 'response';

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

export function normalizeTopicBase(topicBase = 'nexa/nodes'): string {
  return topicBase.replace(/^\/+|\/+$/g, '');
}

export function buildCloudNodeTopic(topicBase: string, nodeId: string, kind: CloudNodeTopicKind): string {
  return [normalizeTopicBase(topicBase), nodeId, kind].join('/');
}

export function cloudTelemetryWildcard(topicBase = 'nexa/nodes'): string {
  return `${normalizeTopicBase(topicBase)}/+/telemetry`;
}

export function cloudStatusWildcard(topicBase = 'nexa/nodes'): string {
  return `${normalizeTopicBase(topicBase)}/+/status`;
}

export function cloudAlertsWildcard(topicBase = 'nexa/nodes'): string {
  return `${normalizeTopicBase(topicBase)}/+/alerts`;
}

export function cloudResponseWildcard(topicBase = 'nexa/nodes'): string {
  return `${normalizeTopicBase(topicBase)}/+/response`;
}

export function extractCloudNodeId(topic: string, topicBase = 'nexa/nodes'): string | null {
  const baseParts = normalizeTopicBase(topicBase).split('/');
  const topicParts = topic.split('/');
  if (topicParts.length !== baseParts.length + 2) return null;
  const prefixMatches = baseParts.every((part, index) => topicParts[index] === part);
  if (!prefixMatches) return null;
  return topicParts[baseParts.length] ?? null;
}
