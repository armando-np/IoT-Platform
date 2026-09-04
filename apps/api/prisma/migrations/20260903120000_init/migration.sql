CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS timescaledb;

DO $$ BEGIN
  CREATE TYPE "NodeStatus" AS ENUM ('ONLINE','OFFLINE','UNKNOWN','MAINTENANCE','DISABLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE "SensorStatus" AS ENUM ('ACTIVE','INACTIVE','FAULT','MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE "AlertSeverity" AS ENUM ('INFO','WARNING','CRITICAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE','RESOLVED','ACKNOWLEDGED');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE "CommandStatus" AS ENUM ('PENDING','SENT','ACKNOWLEDGED','FAILED','TIMEOUT');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE "MqttDirection" AS ENUM ('INBOUND','OUTBOUND');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE "ReadingQuality" AS ENUM ('GOOD','WARN','BAD');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text,
  refresh_token_hash text,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, slug)
);

CREATE TABLE IF NOT EXISTS nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  model text,
  manufacturer text,
  firmware_version text,
  hardware_revision text,
  ip_address text,
  status "NodeStatus" NOT NULL DEFAULT 'UNKNOWN',
  site_id uuid NOT NULL REFERENCES sites(id),
  area_id uuid NOT NULL REFERENCES areas(id),
  last_seen_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS nodes_status_idx ON nodes(status);
CREATE INDEX IF NOT EXISTS nodes_site_area_idx ON nodes(site_id, area_id);
CREATE INDEX IF NOT EXISTS nodes_last_seen_idx ON nodes(last_seen_at);

CREATE TABLE IF NOT EXISTS node_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  client_id text NOT NULL UNIQUE,
  acl_profile text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  last_rotated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS node_credentials_node_active_idx ON node_credentials(node_id, is_active);

CREATE TABLE IF NOT EXISTS node_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  status "NodeStatus" NOT NULL,
  reason text,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS node_status_node_time_idx ON node_status(node_id, created_at DESC);

CREATE TABLE IF NOT EXISTS sensor_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  default_unit text,
  value_schema jsonb NOT NULL DEFAULT '{}',
  description text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id text NOT NULL UNIQUE,
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  sensor_type_id uuid NOT NULL REFERENCES sensor_types(id),
  name text NOT NULL,
  unit text NOT NULL,
  description text,
  location text,
  min_value double precision,
  max_value double precision,
  precision double precision,
  expected_interval_seconds integer,
  status "SensorStatus" NOT NULL DEFAULT 'ACTIVE',
  metadata jsonb NOT NULL DEFAULT '{}',
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS sensors_node_idx ON sensors(node_id);
CREATE INDEX IF NOT EXISTS sensors_type_idx ON sensors(sensor_type_id);
CREATE INDEX IF NOT EXISTS sensors_status_idx ON sensors(status);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  time timestamptz NOT NULL,
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  sensor_id uuid NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  value_number double precision,
  value_text text,
  value_boolean boolean,
  unit text,
  quality "ReadingQuality" NOT NULL DEFAULT 'GOOD',
  metadata jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (time, id)
);
SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS sensor_readings_sensor_time_idx ON sensor_readings(sensor_id, time DESC);
CREATE INDEX IF NOT EXISTS sensor_readings_node_time_idx ON sensor_readings(node_id, time DESC);

CREATE TABLE IF NOT EXISTS mqtt_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern text NOT NULL UNIQUE,
  description text,
  retained boolean NOT NULL DEFAULT false,
  qos integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mqtt_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  received_at timestamptz NOT NULL DEFAULT now(),
  topic text NOT NULL,
  direction "MqttDirection" NOT NULL,
  qos integer NOT NULL,
  payload jsonb NOT NULL,
  client_id text,
  message_id text,
  error text,
  PRIMARY KEY (received_at, id)
);
SELECT create_hypertable('mqtt_messages', 'received_at', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS mqtt_messages_topic_time_idx ON mqtt_messages(topic, received_at DESC);
CREATE INDEX IF NOT EXISTS mqtt_messages_message_id_idx ON mqtt_messages(message_id);

CREATE TABLE IF NOT EXISTS alert_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sensor_id uuid NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  operator text NOT NULL,
  threshold double precision NOT NULL,
  duration_seconds integer NOT NULL DEFAULT 0,
  severity "AlertSeverity" NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  cooldown_seconds integer NOT NULL DEFAULT 300,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS alert_rules_sensor_enabled_idx ON alert_rules(sensor_id, enabled);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES alert_rules(id),
  sensor_id uuid REFERENCES sensors(id),
  node_id uuid REFERENCES nodes(id),
  severity "AlertSeverity" NOT NULL,
  status "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
  title text NOT NULL,
  message text NOT NULL,
  triggered_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  acknowledged_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS alerts_status_severity_idx ON alerts(status, severity);
CREATE INDEX IF NOT EXISTS alerts_triggered_idx ON alerts(triggered_at DESC);

CREATE TABLE IF NOT EXISTS commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text NOT NULL UNIQUE,
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  command text NOT NULL,
  parameters jsonb NOT NULL DEFAULT '{}',
  status "CommandStatus" NOT NULL DEFAULT 'PENDING',
  sent_at timestamptz,
  timeout_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS commands_node_time_idx ON commands(node_id, created_at DESC);
CREATE INDEX IF NOT EXISTS commands_status_idx ON commands(status);

CREATE TABLE IF NOT EXISTS command_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id uuid NOT NULL REFERENCES commands(id) ON DELETE CASCADE,
  status "CommandStatus" NOT NULL,
  response jsonb NOT NULL DEFAULT '{}',
  error text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS command_results_command_idx ON command_results(command_id);

CREATE TABLE IF NOT EXISTS device_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  type text NOT NULL,
  severity text,
  message text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS device_events_node_time_idx ON device_events(node_id, created_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity text,
  entity_id text,
  result text NOT NULL,
  ip_address text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_action_time_idx ON audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_user_time_idx ON audit_logs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  service text NOT NULL,
  message text NOT NULL,
  correlation_id text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS system_logs_level_time_idx ON system_logs(level, created_at DESC);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  key_hash text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS api_keys_active_idx ON api_keys(is_active);

-- Retention examples. Enable after choosing business retention policy.
-- SELECT add_retention_policy('sensor_readings', INTERVAL '180 days');
-- SELECT add_retention_policy('mqtt_messages', INTERVAL '30 days');
