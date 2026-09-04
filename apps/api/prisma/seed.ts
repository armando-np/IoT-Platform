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
  const adminRole = roles.find((role) => role.name === 'ADMIN');
  if (!adminRole) throw new Error('ADMIN role was not created');

  const admin = await prisma.user.upsert({
    where: { email: process.env.DEMO_ADMIN_EMAIL ?? 'admin.demo@nexaiot.local' },
    update: { passwordHash },
    create: { email: process.env.DEMO_ADMIN_EMAIL ?? 'admin.demo@nexaiot.local', name: 'Local Admin', passwordHash }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  const site = await prisma.site.upsert({
    where: { slug: 'casa' },
    update: { name: 'Casa / Laboratorio' },
    create: { slug: 'casa', name: 'Casa / Laboratorio', description: 'Sitio principal para proyectos IoT' }
  });

  const lab = await prisma.area.upsert({
    where: { siteId_slug: { siteId: site.id, slug: 'laboratorio' } },
    update: { name: 'Protoboard principal' },
    create: { siteId: site.id, slug: 'laboratorio', name: 'Protoboard principal' }
  });

  const typeData = [
    ['temperature', '°C'],
    ['humidity', '%'],
    ['pressure', 'hPa'],
    ['tvoc', 'ppb'],
    ['eco2', 'ppm'],
    ['aqi', 'AQI'],
    ['custom', null]
  ] as const;

  const types = new Map<string, string>();
  for (const [name, defaultUnit] of typeData) {
    const type = await prisma.sensorType.upsert({
      where: { name },
      update: { defaultUnit },
      create: { name, defaultUnit, valueSchema: { type: 'number' }, description: `${name} sensor` }
    });
    types.set(name, type.id);
  }

  const node = await prisma.node.upsert({
    where: { nodeId: 'PICO2W-001' },
    update: {
      name: 'Raspberry Pi Pico 2 W - Estación Ambiental',
      model: 'Raspberry Pi Pico 2 W',
      manufacturer: 'Raspberry Pi',
      siteId: site.id,
      areaId: lab.id,
      status: 'OFFLINE',
      metadata: {
        mqttTopicBase: 'nexa/nodes/PICO2W-001',
        board: 'Pico 2 W',
        display: 'ST7796S SPI + touch resistivo'
      }
    },
    create: {
      nodeId: 'PICO2W-001',
      name: 'Raspberry Pi Pico 2 W - Estación Ambiental',
      description: 'Nodo principal con BME280, ENS160+AHT21, DS18B20, LCD ST7796S, touch, buzzer y LEDs.',
      model: 'Raspberry Pi Pico 2 W',
      manufacturer: 'Raspberry Pi',
      firmwareVersion: 'Pendiente',
      siteId: site.id,
      areaId: lab.id,
      status: 'OFFLINE',
      metadata: {
        mqttTopicBase: 'nexa/nodes/PICO2W-001',
        board: 'Pico 2 W',
        display: 'ST7796S SPI + touch resistivo'
      }
    }
  });

  await prisma.nodeCredential.upsert({
    where: { username: 'pico2w' },
    update: { clientId: 'PICO2W-001', aclProfile: 'pico2w-node', isActive: true },
    create: {
      nodeId: node.id,
      username: 'pico2w',
      passwordHash: 'managed-in-emqx-cloud-do-not-use-for-auth',
      clientId: 'PICO2W-001',
      aclProfile: 'pico2w-node',
      isActive: true
    }
  });

  const sensorSeed = [
    ['BME280-TEMP', 'Temperatura BME280', 'temperature', '°C', -10, 60],
    ['BME280-HUM', 'Humedad BME280', 'humidity', '%', 0, 100],
    ['BME280-PRESS', 'Presión BME280', 'pressure', 'hPa', 300, 1100],
    ['ENS160-TVOC', 'TVOC ENS160', 'tvoc', 'ppb', 0, 65000],
    ['ENS160-ECO2', 'eCO₂ ENS160', 'eco2', 'ppm', 400, 65000],
    ['ENS160-AQI', 'AQI ENS160', 'aqi', 'AQI', 1, 5],
    ['AHT21-TEMP', 'Temperatura AHT21', 'temperature', '°C', -10, 60],
    ['AHT21-HUM', 'Humedad AHT21', 'humidity', '%', 0, 100],
    ['DS18B20-TEMP', 'Temperatura externa DS18B20', 'temperature', '°C', -55, 125]
  ] as const;

  for (const [sensorId, name, type, unit, minValue, maxValue] of sensorSeed) {
    const sensorTypeId = types.get(type);
    if (!sensorTypeId) throw new Error(`Missing sensor type ${type}`);
    await prisma.sensor.upsert({
      where: { sensorId },
      update: { name, nodeId: node.id, sensorTypeId, unit, minValue, maxValue, status: 'INACTIVE' },
      create: { sensorId, name, nodeId: node.id, sensorTypeId, unit, minValue, maxValue, status: 'INACTIVE' }
    });
  }

  await prisma.mqttTopic.createMany({
    data: [
      { pattern: 'nexa/nodes/{nodeId}/telemetry', description: 'Telemetría del Pico 2 W hacia backend', retained: false, qos: 1 },
      { pattern: 'nexa/nodes/{nodeId}/status', description: 'Estado ONLINE/OFFLINE por heartbeat/LWT', retained: true, qos: 1 },
      { pattern: 'nexa/nodes/{nodeId}/alerts', description: 'Alertas generadas por dispositivo', retained: false, qos: 1 },
      { pattern: 'nexa/nodes/{nodeId}/commands', description: 'Comandos desde backend hacia dispositivo', retained: false, qos: 1 },
      { pattern: 'nexa/nodes/{nodeId}/response', description: 'Respuesta del dispositivo a comandos', retained: false, qos: 1 }
    ],
    skipDuplicates: true
  });

  console.log({ node: node.nodeId, sensors: sensorSeed.length, admin: admin.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
