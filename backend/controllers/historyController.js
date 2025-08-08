const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllHistory = (req, res) => {
  db.all(`SELECT * FROM history ORDER BY date DESC`, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar histórico:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.addHistoryEntry = (req, res) => {
  const { date, description } = req.body;
  if (!date || !description) {
    return res.status(400).json({ error: 'Data e descrição são obrigatórios.' });
  }
  const id = uuidv4();
  db.run(`INSERT INTO history (id, date, description) VALUES (?, ?, ?)`, [id, date, description], function(err) {
    if (err) {
      console.error("Erro ao adicionar entrada no histórico:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: id, date, description });
  });
};

exports.deleteHistoryEntry = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM history WHERE id = ?`, id, function(err) {
    if (err) {
      console.error("Erro ao deletar entrada do histórico:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Entrada do histórico não encontrada.' });
    }
    res.json({ message: 'Entrada do histórico deletada com sucesso', changes: this.changes });
  });
};
