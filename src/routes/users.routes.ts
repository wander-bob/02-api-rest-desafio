import { knex } from '../lib/database';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function usersRoutes(app:FastifyInstance){
  app.post('/', async (request, reply)=>{
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string()
    })
    const {email, name, password} = bodySchema.parse(request.body);
    
    await knex('users').insert({
      name, email, password
    }).returning('*');
    return reply.status(201).send()
  })
  app.get('/', async (request, reply)=>{
    const users = await knex('users');
    return reply.send(users)
  })
}