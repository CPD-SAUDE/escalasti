const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Define o caminho para o arquivo do banco de dados
// No ambiente Docker, /app/database será um volume persistente
const DB_DIR = process.env.NODE_ENV === 'production'
  ? '/app/database'
  : path.resolve(__dirname, '../database'); // Ajustado para apontar para a pasta database no diretório pai

const DB_PATH = path.join(DB_DIR, 'database.db');

// Garante que o diretório do banco de dados exista
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log(`Diretório do banco de dados criado: ${DB_DIR}`);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar/criar o banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em', DB_PATH);
    db.serialize(() => {
      // Tabela de Profissionais
      db.run(`
        CREATE TABLE IF NOT EXISTS professionals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          color TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela professionals:', err.message);
        } else {
          console.log('Tabela professionals verificada/criada.');
        }
      });

      // Tabela de Escala
      db.run(`
        CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          professionalId INTEGER,
          FOREIGN KEY (professionalId) REFERENCES professionals(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela schedule:', err.message);
        } else {
          console.log('Tabela schedule verificada/criada.');
        }
      });

      // Tabela de Histórico
      db.run(`
        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          description TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela history:', err.message);
        } else {
          console.log('Tabela history verificada/criada.');
        }
      });
    });
  }
});

// Fecha a conexão após a inicialização (importante para scripts de execução única)
db.close((err) => {
  if (err) {
    console.error('Erro ao fechar o banco de dados:', err.message);
  } else {
    console.log('Conexão com o banco de dados fechada após inicialização.');
  }
});
