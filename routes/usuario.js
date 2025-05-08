const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './db_usuarios.txt';

// Carrega usuários do arquivo
function carregarUsuarios() {
  if (!fs.existsSync(path)) return [];
  const dados = fs.readFileSync(path, 'utf8');
  return dados ? JSON.parse(dados) : [];
}

// Salva usuários no arquivo
function salvarUsuarios(usuarios) {
  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2));
}

// POST - Criar novo usuário
router.post('/', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const usuarios = carregarUsuarios();

  if (usuarios.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email já cadastrado.' });
  }

  const novoUsuario = {
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    email,
    senha // ⚠️ Não recomendado salvar senha em texto puro em produção
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  res.status(201).json({ id: novoUsuario.id, email });
});

// GET - Listar todos os usuários
router.get('/', (req, res) => {
  const usuarios = carregarUsuarios();
  const lista = usuarios.map(({ id, email }) => ({ id, email }));
  res.json(lista);
});

// PUT - Atualizar usuário
router.put('/:id', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = carregarUsuarios();
  const index = usuarios.findIndex(u => u.id === +req.params.id);

  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado.' });

  usuarios[index] = { id: +req.params.id, email, senha };
  salvarUsuarios(usuarios);
  res.json({ id: +req.params.id, email });
});

// DELETE - Deletar usuário
router.delete('/:id', (req, res) => {
  let usuarios = carregarUsuarios();
  const originalLength = usuarios.length;
  usuarios = usuarios.filter(u => u.id !== +req.params.id);

  if (usuarios.length === originalLength) return res.status(404).json({ message: 'Usuário não encontrado.' });

  salvarUsuarios(usuarios);
  res.json({ message: 'Usuário deletado com sucesso.' });
});

// POST - Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const usuarios = carregarUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });
  if (usuario.senha !== senha) return res.status(401).json({ message: 'Senha incorreta.' });

  res.status(200).json({ message: 'Login realizado com sucesso!' });
});

module.exports = router;
