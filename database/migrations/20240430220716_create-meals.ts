import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('meals',(table)=>{
    table.uuid('id').defaultTo(knex.fn.uuid());
    table.text('name').notNullable();
    table.text('description');
    table.uuid('user_id').notNullable().references('users.id');
    table.text('created_at').defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}

