import { faker } from '@faker-js/faker';

import { questionService } from '../../src/services/questionService';
import { categoryRepository } from '../../src/repositories/categoryRepository';
import { questionsRepository } from '../../src/repositories/questionsRepository';

import { registerQuestionFactory } from '../factories/questionFactory';
import { categoryFactory } from '../factories/categoryFactory';
import { userFactory } from '../factories/userFactory';

describe('Teste do service de questions', () => {
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