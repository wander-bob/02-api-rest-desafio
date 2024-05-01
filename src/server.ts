import { fastify } from 'fastify';
import cookie from '@fastify/cookie';
import { usersRoutes } from './routes/users.routes';

const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: '/users'
});

app.listen({
  port: 3333
}).then(()=>{
  console.log(`Server is running...`)
})