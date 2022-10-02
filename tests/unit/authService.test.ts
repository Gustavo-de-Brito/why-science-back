import bcyrpt from 'bcrypt';
import { authService } from '../../src/services/authService';
import { userRepository } from '../../src/repositories/userRepository';
import { registerUserFactory, userFactory } from '../factories/userFactory';

describe('Testes do service de autenticação', () => {
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

  it('deve retornar erro de não autorizado quando o email não está cadastrado',
    async () => {
      const user = await userFactory();
      const loginUser = { email: user.email, password: user.password };

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue(null);

      const result = authService.loginUser(loginUser);

      expect(result).rejects.toEqual({ type: 'unauthorized', message: 'dados de login inválidos' });
    }
  );

  it('deve retornar erro de não autorizado quando a senha está errada',
    async () => {
      const user = await userFactory();
      const loginUser = { email: user.email, password: 'some wrong password' };

      jest
       .spyOn(userRepository, 'getUserByEmail')
       .mockResolvedValue( { id: 12, ...user } );

      const result = authService.loginUser(loginUser);
      
      expect(result).rejects.toEqual({ type: 'unauthorized', message: 'dados de login inválidos' });
    }
  );

  it('deve retornar uma string não vazia como token quando enviado um login válido',
    async () => {
      const user = await userFactory();
      const loginUser = { email: user.email, password: user.password };
      const encryptedPassword = bcyrpt.hashSync(user.password, 10);

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue( { id: 12, ...user, password: encryptedPassword });

      const result = await authService.loginUser(loginUser);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  );
});