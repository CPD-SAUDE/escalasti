const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Caminho para o arquivo do banco de dados
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em: ' + dbPath);
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
        db.close(); // Fecha a conexão com o banco de dados em caso de erro
        process.exit(1); // Sai do processo se houver um erro crítico no DB
    }
}

// Inicializa o DB na primeira vez que este módulo é carregado
initDb();

module.exports = db;
