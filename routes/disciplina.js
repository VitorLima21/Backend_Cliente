const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_disciplinas.txt';

function carregarDisciplinasLecionadas() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

function salvarDisciplinasLecionadas(disciplinas) {
  fs.writeFileSync(path, JSON.stringify(disciplinas, null, 2));
}

router.post('/', (req, res) => {
  const { professor_id, disciplina_id, turno } = req.body;
  const disciplinas = carregarDisciplinasLecionadas();

  console.log("Recebi do front:", req.body);
  
  const novaDisciplina = {
    id: disciplinas.length ? disciplinas[disciplinas.length - 1].id + 1 : 1,
    professor_id,
    disciplina_id,
    turno
  };

  disciplinas.push(novaDisciplina);
  salvarDisciplinasLecionadas(disciplinas);
  res.status(201).json(novaDisciplina);
});

router.get('/', (req, res) => {
  const disciplinas = carregarDisciplinasLecionadas();
  res.json(disciplinas);
});

router.get('/:id', (req, res) => {
  const disciplinas = carregarDisciplinasLecionadas();
  const disciplina = disciplinas.find(c => c.id === +req.params.id);
  if (!disciplina) return res.status(404).json({ message: 'Disciplina não encontrada' });
  res.json(disciplina);
});

router.put('/:id', (req, res) => {
  const { professor_id, disciplina_id, turno } = req.body;
  const disciplinas = carregarDisciplinasLecionadas();
  const index = disciplinas.findIndex(c => c.id === +req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Disciplina não encontrada' });

  disciplinas[index] = { id: +req.params.id, professor_id, disciplina_id, turno };
  salvarDisciplinasLecionadas(disciplinas);
  res.json(disciplinas[index]);
});

router.delete('/:id', (req, res) => {
  let disciplinas = carregarDisciplinasLecionadas();
  const originalLength = disciplinas.length;
  disciplinas = disciplinas.filter(c => c.id !== +req.params.id);
  if (disciplinas.length === originalLength) return res.status(404).json({ message: 'Disciplina não encontrada' });

  salvarDisciplinasLecionadas(disciplinas);
  res.json({ message: 'Disciplina deletada com sucesso' });
});

module.exports = router;
