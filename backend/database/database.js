const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em:', DB_PATH);
    db.run(`
      CREATE TABLE IF NOT EXISTS professionals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        professionalId INTEGER,
        FOREIGN KEY (professionalId) REFERENCES professionals(id) ON DELETE SET NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY,
        networkIp TEXT NOT NULL
      )
    `);
  }
});

module.exports = db;
