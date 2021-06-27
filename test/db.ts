import { Pool, PoolConfig } from 'pg';

export const poolConfig: PoolConfig = {
  user: 'postgres',
  password: 'postgres',
  host: process.env.DatabaseHost,
  database: 'postgres',
}

export const pool = new Pool(poolConfig);
