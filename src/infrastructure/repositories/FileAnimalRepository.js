import fs from 'fs';
import { Animal } from '../../domain/entities/Animal.js';
import { AnimalRepository } from '../../../domain/entities/AnimalRepository.js';

export class FileAnimalRepository extends AnimalRepository {
  constructor(filePath) {
    super();
    this.animais = this.lerAnimaisDeArquivo(filePath);
  }

  lerAnimaisDeArquivo(caminho) {
    const conteudo = fs.readFileSync(caminho, 'utf-8');
    const linhas = conteudo.trim().split(/\r?\n/);
    const obj = {};
    for (const linha of linhas) {
      const [nome, tipo, brinquedos] = linha.split(';');
      obj[nome] = new Animal(nome, tipo, brinquedos.split(','));
    }
    return obj;
  }

  getByName(nome) {
    return this.animais[nome] || null;
  }

  getAll() {
    return Object.values(this.animais);
  }
}
