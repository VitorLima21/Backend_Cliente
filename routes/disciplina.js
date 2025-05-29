const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_disciplinas.txt';

// Carrega disciplinas do arquivo
function carregarDisciplinas() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

// Salva disciplinas no arquivo
function salvarDisciplinas(disciplinas) {
  fs.writeFileSync(path, JSON.stringify(disciplinas, null, 2));
}

// POST - Criar nova disciplina
router.post('/', (req, res) => {
  const { professor_id, disciplina_id, turno } = req.body;

  if (!professor_id || !disciplina_id || !turno) {
    return res.status(400).json({ message: 'Professor ID, disciplina ID e turno são obrigatórios.' });
  }

  const disciplinas = carregarDisciplinas();

  if (disciplinas.find(d => d.professsor_id === professor_id)) {
    return res.status(409).json({ message: 'Professor já cadastrado.' });
  }

  const novaDisciplina = {
    disciplina_lecionada_id: disciplinas.length ? disciplinas[disciplinas.length - 1].disciplina_lecionada_id + 1 : 1,
    professor_id,
    disciplina_id,
    turno
  };

  disciplinas.push(novaDisciplina);
  salvarDisciplinas(disciplinas);
  res.status(201).json(novaDisciplina);
});

// GET - Listar todas as disciplinas
router.get('/', (req, res) => {
  const disciplinas = carregarDisciplinas();
  const lista = disciplinas.map(({ disciplina_lecionada_id, professor_id, disciplina_id, turno }) => ({
    disciplina_lecionada_id,
    professor_id,
    disciplina_id,
    turno
  }));
  res.json(lista);
});

module.exports = router;
