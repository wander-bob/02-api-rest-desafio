import { knex as knexConfig, Knex } from 'knex';
import { env } from '../env';

export const config:Knex.Config = {
  client: 'sqlite',
  connection: env.DATABASE_CLIENT === 'sqlite'
  ? { filename: env.DATABASE_URL } 
  : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations'
  }
}

export const knex = knexConfig(config);