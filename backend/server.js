// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const os = require('os');
const db = require('./database/database'); // Importa a instância única do banco de dados
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Importar rotas
const professionalsRoutes = require('./routes/professionals');
const scheduleRoutes = require('./routes/schedule');
const historyRoutes = require('./routes/history');
const configRoutes = require('./routes/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Função para obter IP da rede local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Pular endereços internos e não IPv4
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// Middleware
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json()); // Faz o parse de corpos de requisição JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para log de requisições
app.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${clientIP}`);
  next();
});

// Rotas da API
app.use('/api/professionals', professionalsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/config', configRoutes);

// Rota de status da API
app.get('/api/status', (req, res) => {
  res.json({ status: 'API está online!', timestamp: new Date().toISOString() });
});

// Catch-all para rotas /api que não foram tratadas por nenhum endpoint específico
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint da API não encontrado', path: req.originalUrl });
});

// Catch-all genérico para qualquer outra rota (não-API)
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Recurso não encontrado', 
    message: 'Este é o servidor de API do Sistema de Escala de Sobreaviso. O frontend deve ser acessado em http://[IP_DO_SERVIDOR]:3000' 
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Inicializar banco de dados
    console.log('Inicializando banco de dados...');
    await db.initializeTables(); // Chama o método na instância única do banco de dados
    
    const localIP = getLocalIP();
    
    // Iniciar servidor em todas as interfaces (0.0.0.0)
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(60));
      console.log('🚀 SISTEMA DE ESCALA DE SOBREAVISO - BACKEND');
      console.log('='.repeat(60));
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesso local: http://localhost:${PORT}`);
      console.log(`🌐 Acesso na rede: http://${localIP}:${PORT}`);
      console.log(`📊 Status da API: http://${localIP}:${PORT}/api/status`);
      console.log(`💾 Banco de dados: SQLite inicializado`);
      console.log('='.repeat(60));
      console.log('📋 INSTRUÇÕES PARA REDE LOCAL:');
      console.log(`   1. Compartilhe este IP com outros usuários: ${localIP}`);
      console.log(`   2. Outros computadores devem acessar: http://${localIP}:3000`);
      console.log(`   3. Configure o frontend com: NEXT_PUBLIC_API_URL=http://${localIP}:3001/api`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', async () => { // Torna a função assíncrona para aguardar db.close
  try {
    await db.close(); // Chama o método na instância única do banco de dados
    console.log('Conexão com banco de dados fechada. Servidor encerrando.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao fechar o banco de dados:', err.message);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => { // Torna a função assíncrona para aguardar db.close
  try {
    await db.close(); // Chama o método na instância única do banco de dados
    console.log('Conexão com banco de dados fechada. Servidor encerrando.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao fechar o banco de dados:', err.message);
    process.exit(1);
  }
});

// Iniciar servidor
startServer();

module.exports = app;
