const db = require('../database/database'); // Isso já chama a função initDb()
console.log('Script de inicialização do banco de dados executado.');

db.serialize(() => {
  // Tabela de Profissionais
  db.run(`
    CREATE TABLE IF NOT EXISTS professionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL
    )
  `)

  // Tabela de Escalas
  db.run(`
    CREATE TABLE IF NOT EXISTS schedule (
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (year, month)
    )
  `)

  // Tabela de Histórico
  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabela de Configurações
  db.run(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY,
      api_url TEXT
    )
  `)

  // Inserir configuração inicial se não existir
  db.run(
    `INSERT OR IGNORE INTO config (id, api_url) VALUES (1, 'http://localhost:3001/api')`,
    (err) => {
      if (err) {
        console.error('Error inserting initial config:', err.message)
      } else {
        console.log('Database initialized or already exists.')
      }
    },
  )
})

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message)
  } else {
    console.log('Database connection closed.')
  }
})
