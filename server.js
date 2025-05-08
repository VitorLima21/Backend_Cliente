require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/clientes', require('./routes/cliente'));
app.use('/usuarios', require('./routes/usuario')); // <-- nova rota adicionada aqui

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
