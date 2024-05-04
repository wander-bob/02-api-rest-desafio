import { fastify } from 'fastify';
import cookie from '@fastify/cookie';
import { usersRoutes } from './routes/users.routes';
import { mealsRoutes } from './routes/meals.routes';
import { env } from './env';

const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: '/users'
});
app.register(mealsRoutes, {
  prefix: '/meals'
})

app.listen({
  port: env.PORT
}).then(()=>{
  console.log(`Server is running on port ${env.PORT}...`)
})