const db = require('../database/database');

// Este script apenas garante que as tabelas existam.
// O arquivo database.js já contém a lógica de criação de tabelas.
// Este script é chamado via `npm run init-db` para garantir que o DB seja inicializado.

console.log('Verificando e inicializando o banco de dados...');

// Você pode adicionar aqui lógica para popular o banco de dados com dados iniciais, se necessário.
// Exemplo:
// db.run(`INSERT OR IGNORE INTO professionals (name, color) VALUES ('Profissional Padrão', '#000000')`, (err) => {
//   if (err) {
//     console.error('Erro ao inserir profissional padrão:', err.message);
//   } else {
//     console.log('Profissional padrão garantido.');
//   }
// });

// Fechar o banco de dados após a inicialização (importante para scripts de linha de comando)
db.close((err) => {
  if (err) {
    console.error('Erro ao fechar o banco de dados:', err.message);
  } else {
    console.log('Banco de dados inicializado e conexão fechada.');
  }
});
