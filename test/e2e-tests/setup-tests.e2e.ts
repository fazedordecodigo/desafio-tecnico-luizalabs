import { PrismaService } from '@adapters/services/prisma.service';
import { Client } from 'pg';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'node:child_process';

let postgresContainer: StartedPostgreSqlContainer;
let postgresClient: Client;
let prismaService: PrismaService;
let urlConnection: string;

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer().start();

  postgresClient = new Client({
    host: postgresContainer.getHost(),
    port: postgresContainer.getPort(),
    database: postgresContainer.getDatabase(),
    user: postgresContainer.getUsername(),
    password: postgresContainer.getPassword(),
  });

  await postgresClient.connect();
  process.env.DATABASE_URL = postgresContainer.getConnectionUri();
  urlConnection = postgresContainer.getConnectionUri();
  prismaService = new PrismaService({
    datasources: {
      db: {
        url: urlConnection,
      },
    }
  });
});

afterAll(async () => {
  await prismaService.$disconnect();
  await postgresClient.end();
  await postgresContainer.stop();
});

beforeEach(async () => {
  execSync(`npx prisma migrate reset --force`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
  execSync(`npx prisma migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

jest.setTimeout(80000);
export { postgresClient, prismaService };
