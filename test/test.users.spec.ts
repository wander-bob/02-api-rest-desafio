import { execSync } from 'node:child_process';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Users routes', ()=>{
  beforeAll(async ()=>{
    await app.ready();
  });
  afterAll(async ()=>{
    await app.close();
  });
  beforeEach(()=>{
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  });
  it('should be able to create an user', async ()=>{
    await request(app.server)
      .post('/users')
      .send({
        name: "John Doe",
        email: "john.doe@example.local",
        password: "strongpassword"
      })
      .expect(201)
  });
  it('should be able to create an meal', async ()=>{
    await request(app.server).post('/users')
      .send({
        name: "John Doe",
        email: "john.doe@example.local",
        password: "strongpassword"
      });
    const response = await request(app.server).post('/users/signin')
      .send({
        email: "john.doe@example.local",
        password: "strongpassword"
      });
    const cookies = await response.get('Set-Cookie') || [''];
    await request(app.server).post('/meals')
      .set('Cookie', cookies)
      .send({
        name:"Hamburguer de soja",
        description:"Um hamburguer com uma massa de soja, 2 queijo vegano e tomate.",
        is_on_diet: true
      }).expect(201);
  });
  it('should be able to list all meals', async ()=>{
    await request(app.server).post('/users')
      .send({
        name: "John Doe",
        email: "john.doe@example.local",
        password: "strongpassword"
      });
    const response = await request(app.server).post('/users/signin')
      .send({
        email: "john.doe@example.local",
        password: "strongpassword"
      });
    const cookies = await response.get('Set-Cookie') || [''];
    await request(app.server).post('/meals')
      .set('Cookie', cookies)
      .send({
        name:"Hamburguer de soja",
        description:"Um hamburguer com uma massa de soja, 2 queijo vegano e tomate.",
        is_on_diet: true
      }).expect(201);
    await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);
  })

  
})