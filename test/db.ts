import { PoolConfig } from 'pg';

export const poolConfig: PoolConfig = {
  user: 'postgres',
  password: 'postgres',
  host: process.env.DatabaseHost,
  database: 'postgres',
}
