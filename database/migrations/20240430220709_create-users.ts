import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('users',(table)=>{
    table.uuid('id').defaultTo(knex.fn.uuid());
    table.text('name').notNullable();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('created_at').defaultTo(knex.fn.now());
    table.text('session_id');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}

