import {knex, Knex } from 'knex';

export const config:Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: '../daily-diet-api.db'
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: '../migrations'
  }
}
export const knexSettings = knex(config);