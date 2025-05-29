const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_alunos.txt';

function carregarAluno() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

// Função auxiliar para salvar os dados
function salvarAlunos(alunos) {
  fs.writeFileSync(path, JSON.stringify(alunos, null, 2));
}

// POST - Criar cliente
router.post('/', (req, res) => {
  const { alunoID, nome, data_nascimento, turma, email, telefone } = req.body;
  const alunos = carregarAluno();

  const novoAluno= {
    id: clientes.length ? alunos[alunos.length - 1].id + 1 : 1,
    alunoID, nome, data_nascimento, turma, email, telefone
  };

  alunos.push(novoAluno);
  salvarAlunos(alunos);
  res.status(201).json(novoAlunos);
});

// GET - Listar todos
router.get('/', (req, res) => {
  const alunos = carregarAluno();
  res.json(alunos);
});

// GET por ID
router.get('/:id', (req, res) => {
  const alunos = carregarAluno();
  const aluno = alunos.find(c => c.id === +req.params.id);
  if (!aluno) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(aluno);
});

// PUT - Atualizar
router.put('/:id', (req, res) => {
  const {alunoID, nome, data_nascimento, turma, email, telefone } = req.body;
  const alunos = carregarAluno();
  const index = alunos.findIndex(c => c.id === +req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Aluno não encontrado' });

  alunos[index] = { id: +req.params.id, alunoID, nome, data_nascimento, turma, email, telefone };
  salvarAlunos(alunos);
  res.json(alunos[index]);
});

// DELETE - Excluir
router.delete('/:id', (req, res) => {
  let alunos = carregarAluno();
  const originalLength = alunos.length;
  alunnos = alunos.filter(c => c.id !== +req.params.id);
  if (alunos.length === originalLength) return res.status(404).json({ message: 'Aluno não encontrado' });

  salvarAlunos(alunos);
  res.json({ message: 'Aluno deletado com sucesso' });
});

module.exports = router;