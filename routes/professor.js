const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_professores.txt';

function carregarProfessores() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

function salvarProfessores(professores) {
  fs.writeFileSync(path, JSON.stringify(professores, null, 2));
}

router.post('/', (req, res) => {
  const { nome, email, telefone, especialidade } = req.body;
  const professores = carregarProfessores();

  const novoProfessor = {
    professsor_id: professores.length ? professores[professores.length - 1].professsor_id + 1 : 1,
    nome, email, telefone, especialidade
  };

  professores.push(novoProfessor);
  salvarProfessores(professores);
  res.status(201).json(novoProfessor);
});

router.get('/', (req, res) => {
  const professores = carregarProfessores();
  res.json(professores);
});

router.get('/:id', (req, res) => {
  const professores = carregarProfessores();
  const professor = professores.find(c => c.professsor_id === +req.params.professsor_id);
  if (!professor) return res.status(404).json({ message: 'Professor não encontrado' });
  res.json(professor);
});

router.put('/:id', (req, res) => {
  const { nome, email, telefone, especialidade } = req.body;
  const professores = carregarProfessores();
  const index = professores.findIndex(c => c.professsor_id === +req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Professor não encontrado' });

  professores[index] = { professsor_id: +req.params.id, nome, email, telefone, especialidade };
  salvarProfessores(professores);
  res.json(professores[index]);
});

router.delete('/:id', (req, res) => {
  let professores = carregarProfessores();
  const originalLength = professores.length;
  professores = professores.filter(c => c.professsor_id !== +req.params.professsor_id);
  if (professores.length === originalLength) return res.status(404).json({ message: 'Professor não encontrado' });

  salvarProfessores(professores);
  res.json({ message: 'Professor deletado com sucesso' });
});

module.exports = router;