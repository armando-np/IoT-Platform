import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = process.env.DEMO_ADMIN_PASSWORD ?? 'ChangeMe_DEMO_Only_123!';
  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS ?? 12));

  const roles = await Promise.all(
    ['ADMIN', 'OPERATOR', 'VIEWER'].map((name) =>
      prisma.role.upsert({ where: { name }, update: {}, create: { name, description: `${name} role` } })
    )
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.DEMO_ADMIN_EMAIL ?? 'admin.demo@nexaiot.local' },
    update: { passwordHash },
    create: { email: process.env.DEMO_ADMIN_EMAIL ?? 'admin.demo@nexaiot.local', name: 'Demo Admin', passwordHash }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: roles[0].id } },
    update: {},
    create: { userId: admin.id, roleId: roles[0].id }
  });

  const site = await prisma.site.upsert({
    where: { slug: 'main-site' },
    update: {},
    create: { slug: 'main-site', name: 'Main Site', description: 'Development site' }
  });
  const lab = await prisma.area.upsert({
    where: { siteId_slug: { siteId: site.id, slug: 'lab' } },
    update: {},
    create: { siteId: site.id, slug: 'lab', name: 'Lab' }
  });
  const greenhouse = await prisma.area.upsert({
    where: { siteId_slug: { siteId: site.id, slug: 'greenhouse' } },
    update: {},
    create: { siteId: site.id, slug: 'greenhouse', name: 'Greenhouse' }
  });

  const typeData = [
    ['temperature', 'C'], ['humidity', '%'], ['pressure', 'hPa'], ['tvoc', 'ppb'],
    ['level', 'cm'], ['light', 'lux'], ['current', 'A'], ['custom', null]
  ] as const;
  const types = new Map<string, string>();
  for (const [name, defaultUnit] of typeData) {
    const type = await prisma.sensorType.upsert({
      where: { name },
      update: {},
      create: { name, defaultUnit, valueSchema: { type: 'number' }, description: `${name} sensor` }
    });
    types.set(name, type.id);
  }

  const node1 = await prisma.node.upsert({
    where: { nodeId: 'NODE-001' },
    update: {},
    create: { nodeId: 'NODE-001', name: 'Raspberry Pi Pico 2 W Lab', model: 'Pico 2 W', manufacturer: 'Raspberry Pi', firmwareVersion: '0.3.1', siteId: site.id, areaId: lab.id, status: 'ONLINE', lastSeenAt: new Date() }
  });
  const node2 = await prisma.node.upsert({
    where: { nodeId: 'NODE-002' },
    update: {},
    create: { nodeId: 'NODE-002', name: 'Greenhouse edge node', model: 'ESP32', siteId: site.id, areaId: greenhouse.id, status: 'ONLINE', lastSeenAt: new Date() }
  });
  const node3 = await prisma.node.upsert({
    where: { nodeId: 'NODE-003' },
    update: {},
    create: { nodeId: 'NODE-003', name: 'Energy monitor prototype', siteId: site.id, areaId: lab.id, status: 'OFFLINE', lastSeenAt: new Date(Date.now() - 11 * 60 * 1000) }
  });

  const sensorSeed = [
    ['SEN-TEMP-001', 'Waterproof DS18B20', node1.id, 'temperature', 'C'],
    ['SEN-DIST-001', 'HC-SR04 distance', node1.id, 'level', 'cm'],
    ['SEN-AIR-001', 'ENS160 TVOC', node1.id, 'tvoc', 'ppb'],
    ['SEN-HUM-001', 'AHT21 humidity', node1.id, 'humidity', '%'],
    ['SEN-TEMP-002', 'Greenhouse temperature', node2.id, 'temperature', 'C'],
    ['SEN-HUM-002', 'Greenhouse humidity', node2.id, 'humidity', '%'],
    ['SEN-LUX-001', 'Canopy light', node2.id, 'light', 'lux'],
    ['SEN-PWR-001', 'Bench current', node3.id, 'current', 'A']
  ] as const;

  const sensors = [];
  for (const [sensorId, name, nodeId, type, unit] of sensorSeed) {
    sensors.push(await prisma.sensor.upsert({
      where: { sensorId },
      update: {},
      create: { sensorId, name, nodeId, sensorTypeId: types.get(type)!, unit, minValue: type === 'temperature' ? -40 : undefined, maxValue: type === 'temperature' ? 125 : undefined }
    }));
  }

  const now = Date.now();
  await prisma.sensorReading.createMany({
    data: sensors.slice(0, 4).flatMap((sensor, sensorIndex) =>
      Array.from({ length: 12 }).map((_, index) => ({
        time: new Date(now - (12 - index) * 5 * 60 * 1000),
        nodeId: sensor.nodeId,
        sensorId: sensor.id,
        valueNumber: 20 + sensorIndex * 5 + index / 10,
        unit: sensor.unit,
        quality: 'GOOD',
        metadata: { source: 'seed' }
      }))
    ),
    skipDuplicates: true
  });

  const offlineAlert = await prisma.alert.create({
    data: { nodeId: node3.id, severity: 'CRITICAL', status: 'ACTIVE', title: 'Node offline > 5 minutes', message: 'NODE-003 missed heartbeat window.', metadata: { source: 'seed' } }
  });

  await prisma.mqttTopic.createMany({
    data: [
      { pattern: 'iot/{environment}/{site}/{area}/{nodeId}/status', description: 'Retained node status', retained: true, qos: 1 },
      { pattern: 'iot/{environment}/{site}/{area}/{nodeId}/telemetry', description: 'Node telemetry', retained: false, qos: 1 },
      { pattern: 'iot/{environment}/{site}/{area}/{nodeId}/command', description: 'Commands to node', retained: false, qos: 1 },
      { pattern: 'iot/{environment}/{site}/{area}/{nodeId}/response', description: 'Command responses', retained: false, qos: 1 }
    ],
    skipDuplicates: true
  });

  console.log({ demoUser: admin.email, demoPassword: 'DEMO only - see DEMO_ADMIN_PASSWORD', alert: offlineAlert.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
