const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define o caminho para o arquivo do banco de dados
// Ele será criado na pasta 'database' dentro do diretório 'backend'
const DB_PATH = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'database.sqlite')
    : path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite em:', DB_PATH);
        // Cria as tabelas se não existirem
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS professionals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                defaultHours INTEGER,
                color TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS schedules (
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                data TEXT NOT NULL,
                PRIMARY KEY (year, month)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                monthYear TEXT NOT NULL,
                scheduleData TEXT NOT NULL,
                summaryData TEXT NOT NULL,
                companyName TEXT,
                departmentName TEXT,
                systemName TEXT,
                savedAt TEXT NOT NULL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY,
                companyName TEXT,
                departmentName TEXT,
                systemName TEXT
            )`);

            // Insere uma configuração padrão se não existir
            db.run(`INSERT OR IGNORE INTO config (id, companyName, departmentName, systemName) VALUES (1, 'Minha Empresa', 'TI', 'Sistema de Escala')`);
        });
    }
});

module.exports = db;
