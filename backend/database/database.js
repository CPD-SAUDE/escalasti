const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Define o caminho para o arquivo do banco de dados
// Ele será criado na pasta 'database' dentro do diretório 'backend'
const DB_PATH = path.resolve(__dirname, 'database.db');

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em', DB_PATH);
  }
});

// Função para inicializar o banco de dados
function initDb() {
    try {
        // Tabela de Profissionais
        db.exec(`
            CREATE TABLE IF NOT EXISTS professionals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                color TEXT NOT NULL
            );
        `);

        // Tabela de Escala
        db.exec(`
            CREATE TABLE IF NOT EXISTS schedule (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL UNIQUE,
                professionalId INTEGER,
                FOREIGN KEY (professionalId) REFERENCES professionals(id) ON DELETE SET NULL
            );
        `);

        // Tabela de Histórico
        db.exec(`
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                description TEXT NOT NULL
            );
        `);

        // Tabela de Configurações (para feriados, etc.)
        db.exec(`
            CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                holidays TEXT DEFAULT '[]'
            );
        `);

        // Garante que sempre haja uma entrada na tabela de configuração
        const count = db.prepare('SELECT COUNT(*) FROM config').get()['COUNT(*)'];
        if (count === 0) {
            db.prepare('INSERT INTO config (holidays) VALUES (?)').run('[]');
            console.log('Entrada padrão na tabela de configuração criada.');
        }

        console.log('Banco de dados e tabelas verificados/criados com sucesso.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        process.exit(1); // Sai do processo se houver um erro crítico no DB
    }
}

// Inicializa o DB na primeira vez que este módulo é carregado
initDb();

module.exports = db;
