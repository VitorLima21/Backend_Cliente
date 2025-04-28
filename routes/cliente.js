const express = require('express');
const router = express.Router();
const db = require('../db');



router.post('/', async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone]
    );
    res.status(201).json({ id: result.insertId, nome, email, telefone });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows)
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Erro de buscar cliente" })
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar cliente por ID" });
  }
});


router.put('/:id', async (req, res) =>{
  const {nome, email, telefone} = req.body;
  try{
    const [result] = await db.query(
      "UPDATE clientes SET nome=?, email=?, telefone=?  where id = ?",
      [nome, email, telefone, req.params.id]
    )
    if(!result.affectedRows){
      return res.status(404).json({message: 'Cliente não encontrado'})
    }
      
    res.json({id: +req.params.id, nome, email, telefone})
  }catch{
    res.status(500).json({message: "Erro ao atualizar cliente"})
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      // Se nenhum cliente foi afetado, o ID não existe
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    // Cliente deletado com sucesso
    res.status(200).json({ message: 'Cliente deletado com sucesso' });
  } catch (err) {
    // Erro ao tentar deletar o cliente
    res.status(500).json({ message: 'Erro ao deletar cliente' });
  }
});

module.exports = router;
