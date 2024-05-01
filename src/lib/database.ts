import {knex as knexConfig, Knex } from 'knex';

export const config:Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './database/daily-diet-api.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations'
  }
}

export const knex = knexConfig(config);