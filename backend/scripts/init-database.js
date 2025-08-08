const db = require('../database/database');
const path = require('path');
const fs = require('fs');

// Garante que o diretório 'database' exista
const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Diretório 'database' criado em: ${dbDir}`);
}

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

  // Tabela de Configurações (para armazenar o IP do backend, se necessário)
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
      // Insere uma entrada padrão se a tabela estiver vazia
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

// Não feche o banco de dados imediatamente, pois as operações são assíncronas.
// O banco de dados será fechado quando o processo Node.js terminar.
// Ou você pode adicionar um db.close() em um hook de saída do processo se for um script de uso único.
