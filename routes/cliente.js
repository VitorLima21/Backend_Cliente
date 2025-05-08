const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_clientes.txt';

// Função auxiliar para carregar os dados do arquivo
function carregarClientes() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

// Função auxiliar para salvar os dados
function salvarClientes(clientes) {
  fs.writeFileSync(path, JSON.stringify(clientes, null, 2));
}

// POST - Criar cliente
router.post('/', (req, res) => {
  const { nome, email, telefone } = req.body;
  const clientes = carregarClientes();

  const novoCliente = {
    id: clientes.length ? clientes[clientes.length - 1].id + 1 : 1,
    nome, email, telefone
  };

  clientes.push(novoCliente);
  salvarClientes(clientes);
  res.status(201).json(novoCliente);
});

// GET - Listar todos
router.get('/', (req, res) => {
  const clientes = carregarClientes();
  res.json(clientes);
});

// GET por ID
router.get('/:id', (req, res) => {
  const clientes = carregarClientes();
  const cliente = clientes.find(c => c.id === +req.params.id);
  if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(cliente);
});

// PUT - Atualizar
router.put('/:id', (req, res) => {
  const { nome, email, telefone } = req.body;
  const clientes = carregarClientes();
  const index = clientes.findIndex(c => c.id === +req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Cliente não encontrado' });

  clientes[index] = { id: +req.params.id, nome, email, telefone };
  salvarClientes(clientes);
  res.json(clientes[index]);
});

// DELETE - Excluir
router.delete('/:id', (req, res) => {
  let clientes = carregarClientes();
  const originalLength = clientes.length;
  clientes = clientes.filter(c => c.id !== +req.params.id);
  if (clientes.length === originalLength) return res.status(404).json({ message: 'Cliente não encontrado' });

  salvarClientes(clientes);
  res.json({ message: 'Cliente deletado com sucesso' });
});

module.exports = router;
