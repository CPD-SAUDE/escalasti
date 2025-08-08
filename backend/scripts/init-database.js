const db = require('../database/database');

// Este script é executado para garantir que as tabelas existam
// O database.js já faz isso na conexão, mas este script pode ser usado
// explicitamente para inicializar o DB em um ambiente de CI/CD ou script de setup.

console.log("Verificando e criando tabelas no banco de dados...");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS professionals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        defaultHours INTEGER,
        color TEXT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela professionals:", err.message);
        else console.log("Tabela 'professionals' verificada/criada.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS schedules (
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        data TEXT NOT NULL,
        PRIMARY KEY (year, month)
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela schedules:", err.message);
        else console.log("Tabela 'schedules' verificada/criada.");
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
        if (err) console.error("Erro ao criar tabela history:", err.message);
        else console.log("Tabela 'history' verificada/criada.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY,
        companyName TEXT,
        departmentName TEXT,
        systemName TEXT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela config:", err.message);
        else console.log("Tabela 'config' verificada/criada.");
    });

    db.run(`INSERT OR IGNORE INTO config (id, companyName, departmentName, systemName) VALUES (1, 'Minha Empresa', 'TI', 'Sistema de Escala')`, (err) => {
        if (err) console.error("Erro ao inserir config padrão:", err.message);
        else console.log("Configuração padrão verificada/inserida.");
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conexão com o banco de dados fechada.');
});
