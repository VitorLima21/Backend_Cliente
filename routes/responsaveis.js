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
  fs.writeFileSync(path, JSON.stringify(responsaveis, null, 2));
}

// POST - Criar cliente
router.post('/', (req, res) => {
  const { nomeResponsavel, emailResponsavel, telefoneResponsavel } = req.body;
  const responsaveis = carregarResponsavel();

  let novoResponsavel= {
    id: responsaveis.length ? responsaveis[responsaveis.length - 1].id + 1 : 1,
     nomeResponsavel, emailResponsavel, telefoneResponsavel
  };

  responsaveis.push(novoResponsavel);
  salvarResponsaveis(responsaveis);
  res.status(201).json({novoResponsavel});
});



// GET - Listar todos
router.get('/', (req, res) => {
  const responsaveis = carregarResponsavel();
  res.json(responsaveis);
});

// GET por ID
router.get('/:id', (req, res) => {
  let responsaveis = carregarResponsavel();
  responsaveis = responsaveis.find(c => c.id === +req.params.id);
  if (!responsaveis) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(responsaveis);
});

// PUT - Atualizar
router.put('/responsaveis/editar/:id', (req, res) => {
  const {id, nomeResponsavel, emailResponsavel, telefoneResponsavel } = req.body;
  const responsaveis = carregarResponsavel();
  const index = responsaveis.findIndex(c => c.id === +req.params.id);
  if (index === -1) return res.status(404).json({ message: 'responsavel não encontrado' });

  responsaveis[index] = { id: +req.params.id, id, nomeResponsavel, emailResponsavel, telefoneResponsavel };
  salvarResponsaveis(responsaveis);
  res.json(responsaveis[index]);
});

// DELETE - Excluir
router.delete('/:id', (req, res) => {
  let responsaveis = carregarResponsavel();
  const originalLength = responsaveis.length;
  responsaveis = responsaveis.filter(c => c.id !== +req.params.id);
  if (responsaveis.length === originalLength) return res.status(404).json({ message: 'Responsavel não encontrado' });

  salvarResponsaveis (responsaveis);
  res.json({ message: 'Responsavel deletado com sucesso' });
});

module.exports = router;