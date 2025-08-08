// backend/database/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(__dirname, 'database.sqlite');

let dbInstance = null; // Esta variável irá armazenar a instância única do banco de dados

class Database {
  constructor() {
    // Se já existe uma instância, retorna a existente (padrão Singleton)
    if (dbInstance) {
      return dbInstance;
    }

    // Cria a conexão com o banco de dados SQLite
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error connecting to database:', err.message);
      } else {
        console.log('Connected to the SQLite database.');
      }
    });

    // Promisifica os métodos principais do sqlite3 para usar async/await
    this.run = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      });
    };

    this.get = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        this.db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    };

    this.all = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };

    // Método para fechar a conexão do banco de dados
    this.close = () => {
      return new Promise((resolve, reject) => {
        if (this.db) {
          this.db.close((err) => {
            if (err) {
              reject(err);
            } else {
              console.log('Conexão com banco de dados fechada.');
              dbInstance = null; // Limpa a instância única ao fechar
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    };

    // Método para inicializar as tabelas do banco de dados
    this.initializeTables = async () => {
      try {
        await this.run(`
          CREATE TABLE IF NOT EXISTS professionals (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT NOT NULL,
            default_hours INTEGER DEFAULT 12,
            phone TEXT, -- Novo campo telefone
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Adicionar coluna phone se não existir (para bancos existentes)
        try {
          await this.run(`ALTER TABLE professionals ADD COLUMN phone TEXT`);
        } catch (err) {
          // Coluna já existe, ignorar erro
        }
        
        await this.run(`
          CREATE TABLE IF NOT EXISTS schedule_entries (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL UNIQUE,
            professional_id TEXT NOT NULL,
            hours INTEGER NOT NULL,
            observation TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
          )
        `);
        await this.run(`
          CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            month_year TEXT NOT NULL UNIQUE,
            schedule_data TEXT NOT NULL, -- Armazenando como string JSON
            professionals_data TEXT NOT NULL, -- Armazenando como string JSON
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await this.run(`
          CREATE TABLE IF NOT EXISTS config (
            id TEXT PRIMARY KEY DEFAULT 'app_config',
            company_name TEXT DEFAULT 'Nome da Empresa',
            department_name TEXT DEFAULT 'Nome do Departamento',
            system_title TEXT DEFAULT 'Título do Sistema',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await this.run(`
          INSERT OR IGNORE INTO config (id, company_name, department_name, system_title) 
          VALUES (?, ?, ?, ?)
        `, ['app_config', 'SECRETARIA MUNICIPAL DE SAÚDE DE CHAPADÃO DO CÉU', 'DEPARTAMENTO DE INFORMÁTICA', 'Sistema de Escala de Sobreaviso - TI']);

        console.log('Tabelas inicializadas com sucesso!');
      } catch (error) {
        console.error('Erro ao inicializar tabelas:', error);
        throw error;
      }
    };

    dbInstance = this; // Define esta instância como a única
  }
}

// Exporta a instância única da classe Database
module.exports = new Database();
