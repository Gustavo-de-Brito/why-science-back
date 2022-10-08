import supertest from 'supertest';
import app from '../../src/app';
import prisma from '../../src/databases/postgresSql';
import { categoryFactory, dbCategoryFactory } from '../factories/categoryFactory';
import { registerQuestionFactory } from '../factories/questionFactory';
import {
  elevenQuestionsRegisteredScenery,
  registeredQuestionScenery,
  resetDatabase
} from '../factories/sceneryFactory';
import { dbUserFactory, tokenFactory } from '../factories/userFactory';

beforeEach(async () => {
  await resetDatabase();
});

describe('Testes da rota de POST /questions', () => {
  it('deve retornar 422 quando enviado um body inválido', async () => {
    const user = await dbUserFactory();
    const token = await tokenFactory(user.id);
    const body = {};

    const response = await supertest(app)
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(response.statusCode).toBe(422);
  });

  it('deve retornar 401 quando enviado um token inválido', async () => {
    const questionText = await registerQuestionFactory();
    const category = await dbCategoryFactory();
    const question = {
      text:questionText,
      categoryId: category.id,
      newCategoryName: category.name
    };

    const response = await supertest(app)
      .post('/questions')
      .set('Authorization', 'a-invalid-token')
      .send(question);

    expect(response.statusCode).toBe(422);
  });

  it('deve retornar 404 quando enviado um id de categoria inválido',
    async () => {
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);
      const questionText = await registerQuestionFactory();
      const category = await dbCategoryFactory();
      const question = {
        text: questionText.text,
        categoryId: (category.id + 1),
        newCategoryName: category.name
      };

      const response = await supertest(app)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(question);

      expect(response.statusCode).toBe(404);
    }
  );

  it('deve retornar 409 quando enviado um nome de categoria já cadastrado',
    async () => {
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);
      const questionText = await registerQuestionFactory();
      const category = await dbCategoryFactory();
      const question = {
        text: questionText.text,
        newCategoryName: category.name
      };

      const response = await supertest(app)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(question);

      expect(response.statusCode).toBe(409);
    }
  );

  it('deve retornar 422 quando não enviado um nome ou id de categoria',
    async () => {
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);
      const questionText = await registerQuestionFactory();
      const category = await dbCategoryFactory();
      const question = {
        text: questionText.text
      };

      const response = await supertest(app)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(question);

      expect(response.statusCode).toBe(422);
    }
  );

  it('deve retornar 409 quando enviado um texto de pergunta já cadastrado',
    async () => {
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);
      const registeredQuestion = await registeredQuestionScenery();

      const question = {
        text: registeredQuestion.text,
        categoryId: registeredQuestion.categoryId
      };

      const response = await supertest(app)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(question);

      expect(response.statusCode).toBe(409);
    }
  );

  it('deve retornar 201 quando enviado um id de categoria e body válidos',
    async () => {
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);
      const questionText = await registerQuestionFactory();
      const category = await dbCategoryFactory();
      const question = {
        text: questionText.text,
        categoryId: category.id
      };

      const response = await supertest(app)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(question);

      expect(response.statusCode).toBe(201);
    }
  );

  it('deve retornar 201 quando enviado um novo nome de categoria e body válidos',
    async () => {
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);
      const questionText = await registerQuestionFactory();
      const category = await categoryFactory();
      const question = {
        text: questionText.text,
        newCategoryName: category.name
      };

      const response = await supertest(app)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(question);

      expect(response.statusCode).toBe(201);
    }
  );
});

describe('Testes da rota de GET /questions', () => {
  it('deve retornar 401 quando enviado um token inválido', async () => {
    const token: string = 'some-invalid-token';

    const response = await supertest(app)
      .get('/questions')
      .set('Authorization', `Bearer ${ token }`)
      .send();

    expect(response.statusCode).toBe(401);
  });

  it('deve retonar 200 e uma lista de no máximo 10 elementos', async () => {
    await elevenQuestionsRegisteredScenery();
    const user = await dbUserFactory();
    const token = await tokenFactory(user.id);

    const response = await supertest(app)
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });
});

describe('Teste da rota de POST /questions/:id/likes', () => {
  it('deve retornar 401 quando enviado um token inválido', async () => {
    const question = await registeredQuestionScenery();
    const user = await dbUserFactory();
    const token = 'a-invalid-token';

    const response = await supertest(app)
      .post(`/questions/${question.id}/likes`)
      .set('Authorization', `Bearer ${ token }`)
      .send();

    expect(response.statusCode).toBe(401);
  });

  it('deve retonar 422 quando enviado um id de pergunta com formato inválido',
    async () => {
      const question = await registeredQuestionScenery();
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);

      const response = await supertest(app)
        .post(`/questions/a/likes`)
        .set('Authorization', `Bearer ${ token }`)
        .send();

      expect(response.statusCode).toBe(422);
    }
  );

  it('deve retonar 422 quando enviado um id de pergunta com formato inválido',
    async () => {
      const question = await registeredQuestionScenery();
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);

      const response = await supertest(app)
        .post(`/questions/${ (question.id + 1) }/likes`)
        .set('Authorization', `Bearer ${ token }`)
        .send();

      expect(response.statusCode).toBe(404);
    }
  );

  it('deve retonar 200 quando enviado as informações necessárias',
    async () => {
      const question = await registeredQuestionScenery();
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);

      const response = await supertest(app)
        .post(`/questions/${ question.id }/likes`)
        .set('Authorization', `Bearer ${ token }`)
        .send();

      expect(response.statusCode).toBe(200);
    }
  );

  it('deve retonar 200 e deletar um like que já está criado',
    async () => {
      const question = await registeredQuestionScenery();
      const user = await dbUserFactory();
      const token = await tokenFactory(user.id);

      const responseCreateLike = await supertest(app)
        .post(`/questions/${ question.id }/likes`)
        .set('Authorization', `Bearer ${ token }`)
        .send();

      const responseDeleteLike = await supertest(app)
        .post(`/questions/${ question.id }/likes`)
        .set('Authorization', `Bearer ${ token }`)
        .send();

      expect(responseCreateLike.statusCode).toBe(200);
      expect(responseDeleteLike.statusCode).toBe(200);
    }
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});