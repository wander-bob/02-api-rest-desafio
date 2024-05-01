import { FastifyInstance } from 'fastify';
export async function mealsRoutes(app: FastifyInstance){
  
  app.post('/', async (request, reply)=> {
    const sessionId = request.cookies.session_id;
    if(!sessionId){
      throw new Error('unauthorized access')
    }
    reply.send();
  })
}