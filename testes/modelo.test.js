const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test('Testando cadastro de Resposta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('1 + 1 = ?');

  const id_resposta = modelo.cadastrar_resposta(id_pergunta, '2')
  const perguntasDepoisDasRespostas = modelo.listar_perguntas();
  const respostas = modelo.get_respostas(id_pergunta);

  expect(perguntasDepoisDasRespostas[0].num_respostas).toBe(1);
  expect(id_pergunta).toBe(respostas[0].id_pergunta);
  expect(respostas[0].texto).toBe('2');
  expect(respostas[0].id_resposta).toBe(id_resposta);

});

test('Testando get pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntaCadastrada = modelo.get_pergunta(id_pergunta);

  expect(perguntaCadastrada.texto).toBe('1 + 1 = ?');
  expect(perguntaCadastrada.id_pergunta).toBe(id_pergunta);
});

test('Testando get resposta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('1 + 1 = ?');
  const id_resposta_soma_int = modelo.cadastrar_resposta(id_pergunta, '2')
  const id_resposta_soma_string = modelo.cadastrar_resposta(id_pergunta, '11')
  const respostas = modelo.get_respostas(id_pergunta);

  expect(respostas.length).toBe(2);

  expect(respostas[0].texto).toBe('2');
  expect(respostas[0].id_resposta).toBe(id_resposta_soma_int);

  expect(respostas[1].texto).toBe('11');
  expect(respostas[1].id_resposta).toBe(id_resposta_soma_string);

});

test('Testando get numero de respostas ', () => {
  const id_pergunta = modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_resposta(id_pergunta, '2')
  modelo.cadastrar_resposta(id_pergunta, '11')
  const num_respostas = modelo.get_num_respostas(id_pergunta);

  expect(num_respostas).toBe(2);

});
