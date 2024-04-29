import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table)=>{
    table.uuid('id').primary();
    table.text('name');
    table.text('description');
    table.boolean('is_on_diet');
    table.uuid('user_id').references('users.id').notNullable();
    table.timestamp('created_at').defaultTo(knex.raw(`(datetime('now', 'localtime'))`)).notNullable();
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}

