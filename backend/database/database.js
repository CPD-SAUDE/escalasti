const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(__dirname, '..', 'database.db');

let db = null;

function connectDb() {
    if (db) {
        return db; // Retorna a instância existente se já estiver conectada
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
            process.exit(1); // Sai do processo em caso de erro crítico
        } else {
            console.log(`Conectado ao banco de dados SQLite em: ${DB_PATH}`);
            initializeTables(); // Garante que as tabelas existam ao conectar
        }
    });
    return db;
}

function initializeTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS professionals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                defaultHours INTEGER,
                color TEXT
            )`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela professionals:", err.message);
                    reject(err);
                } else {
                    console.log("Tabela 'professionals' verificada/criada.");
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS schedules (
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                data TEXT NOT NULL,
                PRIMARY KEY (year, month)
            )`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela schedules:", err.message);
                    reject(err);
                } else {
                    console.log("Tabela 'schedules' verificada/criada.");
                }
            });

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
            )`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela history:", err.message);
                    reject(err);
                } else {
                    console.log("Tabela 'history' verificada/criada.");
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY,
                companyName TEXT,
                departmentName TEXT,
                systemName TEXT
            )`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela config:", err.message);
                    reject(err);
                } else {
                    console.log("Tabela 'config' verificada/criada.");
                    // Insere uma configuração padrão se não existir
                    db.run(`INSERT OR IGNORE INTO config (id, companyName, departmentName, systemName) VALUES (1, 'Minha Empresa', 'TI', 'Sistema de Escala')`, (err) => {
                        if (err) {
                            console.error("Erro ao inserir config padrão:", err.message);
                            reject(err);
                        } else {
                            console.log("Configuração padrão verificada/inserida.");
                            resolve();
                        }
                    });
                }
            });
        });
    });
}

function closeDb() {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar o banco de dados:', err.message);
                    reject(err);
                } else {
                    console.log('Conexão com o banco de dados fechada.');
                    db = null; // Limpa a instância
                    resolve();
                }
            });
        } else {
            resolve(); // Já está fechado ou nunca foi aberto
        }
    });
}

// Exporta a instância única do banco de dados e as funções
module.exports = {
    get db() { return connectDb(); }, // Getter para garantir que a conexão seja estabelecida na primeira vez que 'db' for acessado
    initializeTables,
    close: closeDb
};
