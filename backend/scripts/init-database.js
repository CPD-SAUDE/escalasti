const db = require('../database/database');

db.serialize(() => {
  // Tabela de Profissionais
  db.run(`
    CREATE TABLE IF NOT EXISTS professionals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'professionals':", err.message);
    } else {
      console.log("Tabela 'professionals' verificada/criada.");
    }
  });

  // Tabela de Escala
  db.run(`
    CREATE TABLE IF NOT EXISTS schedule (
      id TEXT PRIMARY KEY,
      date TEXT UNIQUE NOT NULL,
      professionalId TEXT,
      FOREIGN KEY (professionalId) REFERENCES professionals(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'schedule':", err.message);
    } else {
      console.log("Tabela 'schedule' verificada/criada.");
    }
  });

  // Tabela de Histórico
  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'history':", err.message);
    } else {
      console.log("Tabela 'history' verificada/criada.");
    }
  });

  // Tabela de Configurações
  db.run(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY,
      backendIp TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela 'config':", err.message);
    } else {
      console.log("Tabela 'config' verificada/criada.");
      db.run(`INSERT OR IGNORE INTO config (id, backendIp) VALUES (1, NULL)`, (err) => {
        if (err) {
          console.error("Erro ao inserir configuração padrão:", err.message);
        } else {
          console.log("Configuração padrão verificada/inserida.");
        }
      });
    }
  });
});
