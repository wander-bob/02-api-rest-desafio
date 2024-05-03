import { FastifyInstance } from 'fastify';
import { validateSessionId } from '../middleware/validate-session-id';
import { knex } from '../lib/database';
import { z } from 'zod';

export async function mealsRoutes(app: FastifyInstance){
  app.addHook('preHandler', validateSessionId);
  app.post('/', async (request, reply)=> {
    const mealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean().default(false),
    })
    const sessionId = request.cookies.session_id;
    const user = await knex('users').select('id', 'name').where('session_id', sessionId).first();
    if(!user){
      return reply.status(401).send('Unauthorized access.')
    }
    const {name, description, is_on_diet } = mealBodySchema.parse(request.body);
    const meal = {
      name, description, is_on_diet, user_id: user.id
    };
    await knex('meals').insert(meal);
    return reply.status(201).send('meal registered');
  });
  app.get('/:id', async (request, reply)=>{
    const paramsSchema = z.object({
      id: z.string(),
    });
    const {id} = paramsSchema.parse(request.params);
    const meal = await knex('meals').where({id}).first();
    if(!meal){
      return reply.status(404).send();
    }
    return reply.status(200).send({meal});
  });
  app.get('/', async (request, reply)=> {
    const sessionId = request.cookies.session_id;
    const user = await knex('users').select('id').where('session_id', sessionId).first();
    if(!user){
      return reply.status(401).send('Unauthorized access.')
    }
    const meals = await knex('meals').where('user_id', user.id);
    reply.send({meals: meals})
  });
  app.put('/:id', async (request, reply)=>{
    const paramsSchema = z.object({
      id: z.string(),
    })
    const mealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    })
    const {id} = paramsSchema.parse(request.params);
    const { name, description, is_on_diet } = mealBodySchema.parse(request.body);
    const meal = await knex('meals').where('id', id).first();
    if(!meal){
      return reply.status(404).send();
    }
    meal.name = name ?? meal.name;
    meal.description = description ?? meal.description;
    meal.is_on_diet = is_on_diet ?? meal.is_on_diet;
    await knex('meals').update(meal).where({id});
    return reply.send(204).send();
  });
  app.delete('/:id', async (request, reply)=>{
    const paramsSchema = z.object({
      id: z.string(),
    });
    const {id} = paramsSchema.parse(request.params);
    await knex('meals').delete().where({id})
    return reply.status(204).send();
  });
}