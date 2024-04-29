import { fastify } from 'fastify';

const app = fastify();

app.get('/', (request, reply)=>{
    reply.send('Bye')
})

app.listen({
  port: 3333
}).then(()=>{
  console.log(`Server is running...`)
})