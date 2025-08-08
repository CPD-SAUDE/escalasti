const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Define o caminho para o arquivo do banco de dados
// Ele será criado no diretório 'database' dentro da pasta 'backend'
const DB_PATH = path.resolve(__dirname, 'database.sqlite');

// Conecta ao banco de dados
// Se o arquivo não existir, ele será criado.
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(`Erro ao conectar ao banco de dados SQLite: ${err.message}`);
  } else {
    console.log(`Conectado ao banco de dados SQLite em: ${DB_PATH}`);
  }
});

module.exports = db;
