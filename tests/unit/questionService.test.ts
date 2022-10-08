import { faker } from '@faker-js/faker';

import { questionService } from '../../src/services/questionService';
import { categoryRepository } from '../../src/repositories/categoryRepository';
import { questionsRepository } from '../../src/repositories/questionsRepository';

import { questionsDbGetFactory, registerQuestionFactory } from '../factories/questionFactory';
import { categoryFactory } from '../factories/categoryFactory';
import { userFactory } from '../factories/userFactory';
import { likeRepository } from '../../src/repositories/likeRepository';
import { answerFactory } from '../factories/answerFactory';
import { answerRepository } from '../../src/repositories/answerRepository';

describe('Teste do service de POST de questions', () => {
  it('deve retornar um erro quando o texto da pergunta já está cadastrado',
    async () => {
      const user = await userFactory()
      const question = await registerQuestionFactory();
      const category = await categoryFactory();
      question.categoryId = (category.id + 1);

      jest
        .spyOn(questionsRepository, 'getQuestionByText')
        .mockResolvedValue({ id: 12, text: question.text, categoryId: question.categoryId, userId: 12});

      const result = questionService.addQuestion(question, {id: 12,...user});

      expect(result).rejects.toEqual({ type: 'conflict', message: 'Essa pergunta já existe'});
    }
  );

  it('deve retornar uma resposta de id inválido para uma categoria',
    async () => {
      const user = await userFactory()
      const question = await registerQuestionFactory();
      const category = await categoryFactory();
      question.categoryId = (category.id + 1);

      jest
        .spyOn(questionsRepository, 'getQuestionByText')
        .mockResolvedValue(null);

      jest
        .spyOn(categoryRepository, 'getCategoryById')
        .mockResolvedValue(null);

      const result = questionService.addQuestion(question, {id: 12,...user});

      expect(result).rejects.toEqual({ type: 'not_found', message:'A categoria indicada não existe' });
    }
  );

  it('deve retornar um erro quando o nome da categoria já está cadastrado',
    async () => {
      const user = await userFactory()
      const question = await registerQuestionFactory();
      const category = await categoryFactory();
      question.newCategoryName = faker.lorem.word();

      jest
        .spyOn(questionsRepository, 'getQuestionByText')
        .mockResolvedValue(null);

      jest
        .spyOn(categoryRepository, 'getCategoryByName')
        .mockResolvedValue(category);

      const result = questionService.addQuestion(question, {id: 12,...user});

      expect(result).rejects.toEqual({ type: 'conflict', message:'A categoria indicada já existe' });
    }
  );

  it('deve retornar uma mensagem de erro caso não seja passado id ou nome da categoria',
    async () => {
      const user = await userFactory()
      const question = await registerQuestionFactory();

      jest
        .spyOn(questionsRepository, 'getQuestionByText')
        .mockResolvedValue(null);

      const result = questionService.addQuestion(question, {id: 12,...user});

      expect(result).rejects.toEqual({ type: 'unprocessable', message:'Não foi informa um id ou nome de categoria' });
    }
  );

  it('deve chamar a função de cadastro da pergunta passado um id de categoria válido',
    async () => {
      const user = await userFactory()
      const question = await registerQuestionFactory();
      const category = await categoryFactory();
      question.categoryId = (category.id + 1);

      jest
        .spyOn(questionsRepository, 'getQuestionByText')
        .mockResolvedValue(null);

      jest
        .spyOn(categoryRepository, 'getCategoryById')
        .mockResolvedValue(category);

      jest
        .spyOn(questionsRepository, 'insert')
        .mockResolvedValue({ id: 12, text: question.text, categoryId: category.id, userId: 12});

      const result = await questionService.addQuestion(question, {id: 12,...user});

      expect(questionsRepository.insert).toBeCalled();
    }
  );

  it('deve chamar a função de cadastro da pergunta passado um nome de categoria não cadastrado',
    async () => {
      const user = await userFactory()
      const question = await registerQuestionFactory();
      const category = await categoryFactory();
      question.newCategoryName = faker.lorem.word();

      jest
        .spyOn(questionsRepository, 'getQuestionByText')
        .mockResolvedValue(null);

      jest
        .spyOn(categoryRepository, 'getCategoryByName')
        .mockResolvedValue(null);
      
      jest
        .spyOn(categoryRepository, 'insert')
        .mockResolvedValue({ id: 12, name: question.newCategoryName });

      jest
        .spyOn(questionsRepository, 'insert')
        .mockResolvedValue({ id: 12, text: question.text, categoryId: 12, userId: 12});

      const result = questionService.addQuestion(question, {id: 12,...user});

      expect(questionsRepository.insert).toBeCalled();
    }
  );
});

describe('Teste do service de GET de questions', () => {
  it('deve retornar uma lista com no máximo 10 elementos', async () => {
    const questions = await questionsDbGetFactory();

    jest
      .spyOn(questionsRepository, 'getQuestions')
      .mockResolvedValue(questions);

    const result = await questionService.findQuestions();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

describe('Testes do service de POST de questions para like', () => {
  it('deve retornar um erro quando passado um id de pergunta inválido',
    async () => {
      const questionId:number = 12;
      const userId:number = 12;

      jest
        .spyOn(questionsRepository, 'getQuestionById')
        .mockResolvedValue(null);

      const result = questionService.toggleQuestionLike(questionId, userId);

      expect(result).rejects.toEqual({ type: 'not_found', message: 'O id da questão não existe' });
    }
  );

  it('deve criar um like pra pergunta se o mesmo não está cadastrado',
    async () => {
      const questionId = 12;
      const question = await registerQuestionFactory();
      const userId = 12;
  
      jest
        .spyOn(questionsRepository, 'getQuestionById')
        .mockResolvedValue({ id: questionId, text: question.text, userId: 14, categoryId: 12});
      jest
        .spyOn(likeRepository, 'getLikeByUserQuestionId')
        .mockResolvedValue(null);
      jest
        .spyOn(likeRepository, 'insert')
        .mockResolvedValue(undefined);

      await questionService.toggleQuestionLike(questionId, userId);

      expect(likeRepository.insert).toBeCalled();
    }
  );

  it('deve deletar o like pra pergunta se o mesmo já está cadastrado',
    async () => {
      const questionId = 12;
      const question = await registerQuestionFactory();
      const userId = 12;
  
      jest
        .spyOn(questionsRepository, 'getQuestionById')
        .mockResolvedValue({ id: questionId, text: question.text, userId: 14, categoryId: 12});
      jest
        .spyOn(likeRepository, 'getLikeByUserQuestionId')
        .mockResolvedValue({ id: 12, questionId, userId });
      jest
        .spyOn(likeRepository, 'deleteLike')
        .mockResolvedValue(undefined);

      await questionService.toggleQuestionLike(questionId, userId);

      expect(likeRepository.deleteLike).toBeCalled();
    }
  );
});

describe('Testes do service de POST de questions para answers', () => {
  it('deve retornar um quando passado um id de pergunta inválido', async () => {
    const answer = await answerFactory();
    const questionId:number = 12;
    const userId:number = 12;

    jest
      .spyOn(questionsRepository, 'getQuestionById')
      .mockResolvedValue(null);

    const result = questionService.registerAnswer(answer, questionId, userId);

    expect(result).rejects.toEqual({ type: 'not_found', message: 'O id da questão não existe' });
  });

  it('deve retornar um quando passado um id de pergunta inválido', async () => {
    const answer = await answerFactory();
    const question = await registerQuestionFactory();
    const questionId:number = 12;
    const userId:number = 12;

    jest
      .spyOn(questionsRepository, 'getQuestionById')
      .mockResolvedValue({ id: questionId, text: question.text, userId: 14, categoryId: 12});
    jest
      .spyOn(answerRepository, 'insert')
      .mockResolvedValue({ id: 12, text: answer.text, questionId, userId});

    await questionService.registerAnswer(answer, questionId, userId);

    expect(answerRepository.insert).toBeCalled();
  });
});