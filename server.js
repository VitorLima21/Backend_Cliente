require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <-- Importa o CORS
const app = express();

app.use(cors()); // <-- Ativa o CORS para todas as rotas
app.use(express.json());
app.use('/clientes', require('./routes/cliente'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
