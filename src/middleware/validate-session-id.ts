import { knex } from '../lib/database';
export async function validateSessionId(sessionId:string){
  const user = await knex('users').where('session_id', sessionId).first();
  if(!user){
    throw new Error('unauthorized access')
  }
  const { id, session_id } = user;
  return {user :{id, session_id}}
}