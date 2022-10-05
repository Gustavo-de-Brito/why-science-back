import { e2eRepository } from '../repositories/e2eRepository';

async function resetDatabase() {
  await e2eRepository.clearDatabase();
}

export const e2eService = {
  resetDatabase
};