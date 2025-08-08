const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log }); // verbose para logar queries no console

console.log(`Conectado ao banco de dados SQLite em: ${dbPath}`);

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
