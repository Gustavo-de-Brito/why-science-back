import { authService } from '../../src/services/authService';
import { userRepository } from '../../src/repositories/userRepository';
import { registerUserFactory, userFactory } from '../factories/userFactory';
import dotenv from 'dotenv';

dotenv.config();

describe('Testa o service de autenticação', () => {
  it('deve retornar um erro de conflito quando o nome já está cadastrado', 
    async () => {
      const newUser = await registerUserFactory();
      const dbUser = {
        id: 12,
        name: newUser.name,
        email: 'someemail@email.com',
        imageUrl: 'https://someimage.com',
        password: 'encryptedPassword'
      }

      jest
        .spyOn(userRepository, 'getUserByName')
        .mockResolvedValue(dbUser);

      const result = authService.registerUser(newUser);

      expect(result).rejects.toEqual({ type: 'conflict', message: 'o nome de usuário já está registrado'});
    }
  );

  it('deve retornar um erro de conclito quando o email já está cadastrado',
    async () => {
      const newUser = await registerUserFactory();
      const dbUser = {
        id: 12,
        name: 'some name',
        email: newUser.email,
        imageUrl: 'https://someimage.com',
        password: 'encryptedPassword'
      };

      jest
        .spyOn(userRepository, 'getUserByName')
        .mockResolvedValue( null );

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue( dbUser );

      const result = authService.registerUser(newUser);

      expect(result).rejects.toEqual({ type: 'conflict', message: 'o email de usuário já está registrado'});
    }
  );

  it('deve chamar a função para registrar os dados do novo usuário',
    async () => {
      const newUser = await registerUserFactory();

      jest
        .spyOn(userRepository, 'getUserByName')
        .mockResolvedValue( null );

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue( null );

      jest
        .spyOn(userRepository, 'insert')
        .mockResolvedValue( undefined );

      await authService.registerUser(newUser);

      expect(userRepository.insert).toBeCalled();
    }
  );
});