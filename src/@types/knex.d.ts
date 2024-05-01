import { Knex } from 'knex';
declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
      created_at: string;
      session_id: string;
    },
    meals: {
      id: string;
      name: string;
      description: string;
      user_id: string;
      is_on_diet: string;
      created_at: string;
    }
  }
}