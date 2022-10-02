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

describe('Testes da rota de login', () => {
  it('deve retornar status 422 com um body inválido',
    async () => {
      const body = {};

      const response = await supertest(app).post('/sign-in').send(body);

      expect(response.statusCode).toBe(422);
    }
  );

  it('deve retornar status 401 quando enviado um email não cadastrado',
    async () => {
      const user = await userRegistered();
      const body = {
        email: 'somewrongemail@email.com',
        password: user.password
      };

      const response = await supertest(app).post('/sign-in').send(body);

      expect(response.statusCode).toBe(401);
    }
  );

  it('deve retornar status 401 quando a senha passada estiver incorreta',
    async () => {
      const user = await userRegistered();
      const body = { email: user.email, password: 'a-wrong-password'};

      const response = await supertest(app).post('/sign-in').send(body);

      expect(response.statusCode).toBe(401);
    }
  );

  it('deve retonar um token e status 200 em caso de sucesso no login',
    async () => {
      const user = await userRegistered();
      const body = { email: user.email, password: user.password };

      const response = await supertest(app).post('/sign-in').send(body);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).not.toBeUndefined();
    }
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});