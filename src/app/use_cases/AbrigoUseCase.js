export class AbrigoUseCase {
  constructor(animalRepository) {
    this.animalRepository = animalRepository;
  }
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const animais = this.animalRepository.animais;
    const brinquedosValidos = new Set(['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE']);
    function validaLista(lista, validos, tipoErro) {
      const arr = lista.split(',').map(x => x.trim());
      const set = new Set();
      for (let item of arr) {
        if (!validos.has(item) || set.has(item)) return tipoErro;
        set.add(item);
      }
      return null;
    }
    const erroB1 = validaLista(brinquedosPessoa1, brinquedosValidos, 'Brinquedo inválido');
    const erroB2 = validaLista(brinquedosPessoa2, brinquedosValidos, 'Brinquedo inválido');
    if (erroB1) return { erro: erroB1 };
    if (erroB2) return { erro: erroB2 };
    const ordemAnimaisArr = ordemAnimais.split(',').map(x => x.trim());
    const setAnimais = new Set();
    for (let nome of ordemAnimaisArr) {
      if (!animais[nome] || setAnimais.has(nome)) return { erro: 'Animal inválido' };
      setAnimais.add(nome);
    }
    function contemOrdem(brinquedosPessoa, brinquedosAnimal) {
      let idx = 0;
      for (let b of brinquedosPessoa) {
        if (b === brinquedosAnimal[idx]) idx++;
        if (idx === brinquedosAnimal.length) return true;
      }
      return idx === brinquedosAnimal.length;
    }
    function contemTodos(bPessoa, bAnimal) {
      return bAnimal.every(b => bPessoa.includes(b));
    }
    const listaB1 = brinquedosPessoa1.split(',').map(x => x.trim());
    const listaB2 = brinquedosPessoa2.split(',').map(x => x.trim());
    let contaPessoa1 = 0, contaPessoa2 = 0;
    const resultado = [];
    function decideAdocao(nomeAnimal, animal, listaB1, listaB2, contaPessoa1, contaPessoa2) {
      let pessoa1 = false, pessoa2 = false;
      if (nomeAnimal === 'Loco') {
        pessoa1 = contemTodos(listaB1, animal.brinquedos);
        pessoa2 = contemTodos(listaB2, animal.brinquedos);
      } else {
        pessoa1 = contemOrdem(listaB1, animal.brinquedos);
        pessoa2 = contemOrdem(listaB2, animal.brinquedos);
      }
      if (animal.tipo === 'gato' && pessoa1 && pessoa2) return 'abrigo';
      if (pessoa1 && pessoa2) return 'abrigo';
      if (pessoa1 && contaPessoa1 < 3) return 'pessoa 1';
      if (pessoa2 && contaPessoa2 < 3) return 'pessoa 2';
      return 'abrigo';
    }
    const ordemAnimaisOrdenada = [...ordemAnimaisArr].sort();
    for (let nomeAnimal of ordemAnimaisOrdenada) {
      const animal = animais[nomeAnimal];
      const destino = decideAdocao(nomeAnimal, animal, listaB1, listaB2, contaPessoa1, contaPessoa2);
      if (destino === 'pessoa 1') {
        resultado.push(`${nomeAnimal} - pessoa 1`);
        contaPessoa1++;
      } else if (destino === 'pessoa 2') {
        resultado.push(`${nomeAnimal} - pessoa 2`);
        contaPessoa2++;
      } else {
        resultado.push(`${nomeAnimal} - abrigo`);
      }
    }
    const idxLoco = resultado.findIndex(x => x.startsWith('Loco - pessoa'));
    if (idxLoco !== -1) {
      const outrosAdotados = resultado.filter(x => (x.endsWith('pessoa 1') || x.endsWith('pessoa 2'))).length;
      if (outrosAdotados <= 1) resultado[idxLoco] = 'Loco - abrigo';
    }
    return { lista: resultado };
  }
}
