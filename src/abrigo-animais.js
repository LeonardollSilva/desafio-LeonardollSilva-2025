import path from 'path';
import { fileURLToPath } from 'url';
import { FileAnimalRepository } from './infrastructure/database/repositories/FileAnimalRepository.js';
import { AbrigoUseCase } from './app/use_cases/AbrigoUseCase.js';

class AbrigoAnimais {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const caminhoAnimais = path.resolve(__dirname, 'animais.txt');
    this.useCase = new AbrigoUseCase(new FileAnimalRepository(caminhoAnimais));
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    return this.useCase.encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais);
  }
}

export { AbrigoAnimais };
