import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AnimalRepository } from '../domain/AnimalRepository.js';
import { Animal } from '../domain/Animal.js';

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
