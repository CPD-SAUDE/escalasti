const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/database'); // Importa a conexão com o banco de dados

// Importar rotas
const professionalsRoutes = require('./routes/professionals');
const scheduleRoutes = require('./routes/schedule');
const historyRoutes = require('./routes/history');
const configRoutes = require('./routes/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Usar rotas
app.use('/api/professionals', professionalsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/config', configRoutes);

// Rota de teste simples
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running!', database: 'Connected to SQLite' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Fechar o banco de dados quando o aplicativo for encerrado
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexão com o banco de dados SQLite fechada.');
    process.exit(0);
  });
});
