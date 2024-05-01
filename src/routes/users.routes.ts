import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { compare, hash } from 'bcrypt';
import { z } from 'zod';
import { knex } from '../lib/database';
import { validateSessionId } from '../middleware/validate-session-id';


export async function usersRoutes(app:FastifyInstance){
  app.post('/', async (request, reply)=>{
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string()
    })
    const {email, name, password} = bodySchema.parse(request.body);
    const hashedPassword = await hash(password, 8);
    await knex('users').insert({name, email, password: hashedPassword});
    return reply.status(201).send()
  })
  app.post('/signin', async (request, reply)=>{
    const bodySchema = z.object({
      email: z.string(),
      password: z.string()
    })
    const {email, password} = bodySchema.parse(request.body);
    const user = await knex('users').where('email', email).first();
    if(!user){
      throw new Error('user or password invalid')
    }
    const isPasswordValid = await compare(password, user?.password);
    if(!isPasswordValid){
      throw new Error('user or password invalid')
    }
    const sessionId = randomUUID();
    user.session_id = sessionId;
    
    await knex('users').update(user).where({id: user.id});
    
    reply.setCookie('session_id', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
  })
  app.get('/', async (request, reply)=>{
    const sessionId = request.cookies.session_id;
    if(!sessionId){
      return reply.status(401).send({error: 'Unauthorized access'})
    }
    const user = await validateSessionId(sessionId);
    return reply.status(201).send(user)
  })
}