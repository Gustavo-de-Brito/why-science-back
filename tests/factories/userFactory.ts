import { faker } from '@faker-js/faker';
import { UserData, IUserRegister } from '../../src/types/userTypes';

export async function userFactory(): Promise<UserData> {
  const password: string = faker.internet.password();

  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    imageUrl: faker.internet.url(),
    password,
  };
}

export async function registerUserFactory(): Promise<IUserRegister> {
  const password: string = faker.internet.password();

  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    imageUrl: faker.internet.url(),
    password,
    confirmPassword: password
  };
}