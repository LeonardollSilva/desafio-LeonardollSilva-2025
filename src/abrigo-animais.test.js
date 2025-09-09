
import { AbrigoUseCase } from "./core/abrigo";
import { AnimalRepository } from "./domain/AnimalRepository";



// Mock do repositório para DDD
class AnimalRepositoryMock extends AnimalRepository {
  constructor(animais) {
    super();
    this.animais = animais;
  }
  getByName(nome) {
    return this.animais[nome] || null;
  }
  getAll() {
    return Object.values(this.animais);
  }
}

const animaisMock = {
  'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
  'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
  'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
  'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
  'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
  'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
  'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] },
};

describe('Abrigo de Animais (DDD + Clean Architecture)', () => {
  let useCase;
  beforeEach(() => {
    const repo = new AnimalRepositoryMock(animaisMock);
    useCase = new AbrigoUseCase(repo);
  });

  test('Deve rejeitar animal inválido', () => {
    const resultado = useCase.encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = useCase.encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
    expect(resultado.lista[0]).toBe('Fofo - abrigo');
    expect(resultado.lista[1]).toBe('Rex - pessoa 1');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = useCase.encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

    expect(resultado.lista[0]).toBe('Bola - abrigo');
    expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
    expect(resultado.lista[2]).toBe('Mimi - abrigo');
    expect(resultado.lista[3]).toBe('Rex - abrigo');
    expect(resultado.lista.length).toBe(4);
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve rejeitar brinquedo inválido', () => {
    const resultado = useCase.encontraPessoas('RATO,BOLA,FOICE', 'RATO,NOVELO', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Pessoa não pode adotar mais de 3 animais', () => {
    // Rex, Bola, Bebe, Zero, todos podem ser adotados por pessoa 1, mas só 3 devem ir
    const resultado = useCase.encontraPessoas('RATO,BOLA,CAIXA,NOVELO,LASER', 'SKATE', 'Rex,Bola,Bebe,Zero');
    const adotados = resultado.lista.filter(x => x.endsWith('pessoa 1')).length;
    expect(adotados).toBeLessThanOrEqual(3);
    expect(resultado.lista.length).toBe(4);
    expect(resultado.erro).toBeFalsy();
  });
});
