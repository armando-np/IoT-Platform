#!/usr/bin/env sh
set -eu

HOST="${MQTT_HOST:-localhost}"
PORT="${MQTT_PORT:-1883}"
NODE_ID="${NODE_ID:-NODE-001}"
SITE="${SITE:-main-site}"
AREA="${AREA:-lab}"
ENVIRONMENT="${APP_ENV:-dev}"
TOPIC="iot/${ENVIRONMENT}/${SITE}/${AREA}/${NODE_ID}/telemetry"
MESSAGE_ID="msg-$(date +%s)"

mosquitto_pub -h "$HOST" -p "$PORT" \
  -t "$TOPIC" \
  -m "{\"schemaVersion\":\"1.0\",\"messageId\":\"${MESSAGE_ID}\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"nodeId\":\"${NODE_ID}\",\"sequence\":1,\"payload\":{\"sensors\":{\"SEN-TEMP-001\":{\"value\":24.7,\"unit\":\"C\"}}}}"
