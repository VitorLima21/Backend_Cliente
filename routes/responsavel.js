const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_responsaveis.txt';

function carregarResponsavel() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

// Função auxiliar para salvar os dados
function salvarResponsaveis(responsaveis) {
  fs.writeFileSync(path, JSON.stringify(alunos, null, 2));
}

// POST - Criar cliente
router.post('/', (req, res) => {
  const { alunoID, nome, data_nascimento, turma, email, telefone } = req.body;
  const responsaveis = carregarAlunos();

  const novoResponsavel= {
    id: responsaveis.length ? responsaveis[responsaveis.length - 1].id + 1 : 1,
    alunoID, nome, data_nascimento, turma, email, telefone
  };

  responsaveis.push(novoResponsavel);
  salvarResponsaveis(responsaveis);
  res.status(201).json(novoResponsavel);
});

// GET - Listar todos
router.get('/', (req, res) => {
  const responsaveis = carregarResponsavel();
  res.json(responsaveis);
});

// GET por ID
router.get('/:id', (req, res) => {
  const alunos = carregarAlunos();
  const aluno = alunos.find(c => c.id === +req.params.id);
  if (!aluno) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(aluno);
});

// PUT - Atualizar
router.put('/:id', (req, res) => {
  const {alunoID, nome, data_nascimento, turma, email, telefone } = req.body;
  const alunos = carregarAlunos();
  const index = alunos.findIndex(c => c.id === +req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Aluno não encontrado' });

  alunos[index] = { id: +req.params.id, alunoID, nome, data_nascimento, turma, email, telefone };
  salvarAlunos(alunos);
  res.json(alunos[index]);
});

// DELETE - Excluir
router.delete('/:id', (req, res) => {
  let alunos = carregarAlunos();
  const originalLength = alunos.length;
  alunnos = alunos.filter(c => c.id !== +req.params.id);
  if (alunos.length === originalLength) return res.status(404).json({ message: 'Aluno não encontrado' });

  salvarAlunos(alunos);
  res.json({ message: 'Aluno deletado com sucesso' });
});

module.exports = router;