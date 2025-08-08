const db = require('../database/database');

// Obter todos os profissionais
const getAllProfessionals = (req, res) => {
  db.all('SELECT * FROM professionals', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Adicionar um novo profissional
const addProfessional = (req, res) => {
  const { id, name, color } = req.body;
  
  if (!id || !name || !color) {
    return res.status(400).json({ error: 'ID, nome e cor são obrigatórios' });
  }

  db.run('INSERT INTO professionals (id, name, color) VALUES (?, ?, ?)', 
    [id, name, color], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, color });
    }
  );
};

// Atualizar um profissional
const updateProfessional = (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  db.run('UPDATE professionals SET name = ?, color = ? WHERE id = ?',
    [name, color, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Profissional não encontrado' });
        return;
      }
      res.json({ id, name, color });
    }
  );
};

// Deletar um profissional
const deleteProfessional = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM professionals WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Profissional não encontrado' });
      return;
    }
    res.json({ message: 'Profissional deletado com sucesso' });
  });
};

module.exports = {
  getAllProfessionals,
  addProfessional,
  updateProfessional,
  deleteProfessional
};
