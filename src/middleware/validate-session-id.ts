import {FastifyRequest, FastifyReply } from 'fastify';
import { knex } from '../lib/database';
export async function validateSessionId(request: FastifyRequest, reply: FastifyReply){
  const { Expires: cookieExpireDate, session_id: sessionId } = request.cookies;
  if(!cookieExpireDate || !sessionId){
    request.cookies = {};
    return reply.status(401).send('Unauthorized access') 
  }
  const currentDate = Date.now() - (3 * 60 * 60 * 1000);
  const expireDate = Date.parse(cookieExpireDate);
  if(!(expireDate >= currentDate)){
    await knex('users').where('session_id', sessionId).update('session_id', null)
    return reply.status(401).send('Unauthorized access')
  }
}