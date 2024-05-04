import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('meals',(table)=>{
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.text('name').notNullable();
    table.text('description');
    table.boolean('is_on_diet').defaultTo(false);
    table.uuid('user_id').notNullable().references('users.id');
    table.text('created_at').defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}

