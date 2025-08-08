const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllProfessionals = (req, res) => {
  db.all(`SELECT * FROM professionals ORDER BY name`, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar profissionais:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.addProfessional = (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ error: 'Nome e cor são obrigatórios.' });
  }
  const id = uuidv4();
  db.run(`INSERT INTO professionals (id, name, color) VALUES (?, ?, ?)`, [id, name, color], function(err) {
    if (err) {
      console.error("Erro ao adicionar profissional:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: id, name, color });
  });
};

exports.updateProfessional = (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ error: 'Nome e cor são obrigatórios.' });
  }
  db.run(`UPDATE professionals SET name = ?, color = ? WHERE id = ?`, [name, color, id], function(err) {
    if (err) {
      console.error("Erro ao atualizar profissional:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Profissional não encontrado.' });
    }
    res.json({ message: 'Profissional atualizado com sucesso', changes: this.changes });
  });
};

exports.deleteProfessional = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM professionals WHERE id = ?`, id, function(err) {
    if (err) {
      console.error("Erro ao deletar profissional:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Profissional não encontrado.' });
    }
    res.json({ message: 'Profissional deletado com sucesso', changes: this.changes });
  });
};
