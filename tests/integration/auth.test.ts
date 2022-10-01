import supertest from 'supertest';
import app from '../../src/app';
import prisma from '../../src/databases/postgresSql';
import { userRegistered } from '../factories/sceneryFactory';
import { registerUserFactory } from '../factories/userFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`;
});

describe('testes da rota de cadastro de novos usuários', () => {
  it('deve retornar status 422 quando receber um body inválido', async () => {
    const body = {};

    const response = await supertest(app).post('/sign-up').send(body);

    expect(response.statusCode).toBe(422);
  });

  it('deve retornar status 409 quando enviado um nome já cadastrado',
    async () => {
      const newUser = await userRegistered();
      const body = {
        ...newUser,
        confirmPassword: newUser.password
      };

      const response = await supertest(app).post('/sign-up').send(body);

      expect(response.statusCode).toBe(409);
    }
  );

  it('deve retornar status 409 quando enviado um email já cadastrado',
    async () => {
      const newUser = await userRegistered();
      const body = {
        ...newUser,
        confirmPassword: newUser.password,
        name: 'a not registered name'
      }

      const response = await supertest(app).post('/sign-up').send(body);

      expect(response.statusCode).toBe(409);
    }
  );

  it('deve retornar status 201 quando o usuário é criado com sucesso',
    async () => {
      const body = await registerUserFactory();

      const response = await supertest(app).post('/sign-up').send(body);

      expect(response.statusCode).toBe(201);
    }
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});