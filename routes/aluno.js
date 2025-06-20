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
  const {  nome, data_nascimento, turma, email, telefone } = req.body;
  const alunos = carregarAluno();

  const novoAluno = {
    id: alunos.length ? alunos[alunos.length - 1].id + 1 : 1,
     nome, data_nascimento, turma, email, telefone
  };

  alunos.push(novoAluno);
  salvarAlunos(alunos);
   res.status(201).json({ novoAluno});
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

// PUT - Atualizar aluno
router.put('/alunos/editar/:id', (req, res) => {
  const { nome, data_nascimento, turma, email, telefone } = req.body;
  const alunoId = +req.params.id; // Convertendo para número
  
  // Carrega os alunos existentes
  const alunos = carregarAluno();
  
  // Encontra o índice do aluno
  const index = alunos.findIndex(a => a.id === alunoId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Aluno não encontrado' });
  }

  // Validação básica dos dados
  if (!nome || !data_nascimento || !turma || !email || !telefone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  // Atualiza apenas os campos permitidos, mantendo o ID original
  alunos[index] = {
    id: alunoId, // Mantém o ID original da URL
    nome,
    data_nascimento,
    turma,
    email,
    telefone
  };

  // Salva no "banco de dados"
  salvarAlunos(alunos);
  
  // Retorna o aluno atualizado
  res.json(alunos[index]);
});


// DELETE - Excluir
router.delete('/:id', (req, res) => {
  let alunos = carregarAluno();
  const originalLength = alunos.length;
  alunos = alunos.filter(c => c.id !== +req.params.id);
  if (alunos.length === originalLength) return res.status(404).json({ message: 'Aluno não encontrado' });

  salvarAlunos(alunos);
  res.json({ message: 'Aluno deletado com sucesso' });
});

module.exports = router;