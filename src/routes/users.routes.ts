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
    const currentDate = new Date();
    const cookieMaxAgeInMinutes = (5 * 60 * 1000) - (3 * 60 * 60 * 1000);
    currentDate.setTime(currentDate.getTime() + cookieMaxAgeInMinutes)
    reply.setCookie('session_id', sessionId, {
      path: '/',
      expires: currentDate,
    })
  })
  app.get('/', async (request, reply)=>{
    await validateSessionId(request, reply);
    const sessionId = request.cookies.session_id;
    const userData = await knex('users').select('id', 'name', 'email', 'created_at', ).where('session_id', sessionId).first();
    return reply.send({user: userData})
  })
}