const db = require('../database/database');

// Obter todo o histórico
const getAllHistory = (req, res) => {
  db.all('SELECT * FROM history ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Adicionar entrada no histórico
const addHistoryEntry = (req, res) => {
  const { id, date, description } = req.body;

  if (!id || !date || !description) {
    return res.status(400).json({ error: 'ID, data e descrição são obrigatórios' });
  }

  db.run('INSERT INTO history (id, date, description) VALUES (?, ?, ?)',
    [id, date, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, date, description });
    }
  );
};

// Deletar entrada do histórico
const deleteHistoryEntry = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM history WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Entrada do histórico não encontrada' });
      return;
    }
    res.json({ message: 'Entrada do histórico deletada com sucesso' });
  });
};

module.exports = {
  getAllHistory,
  addHistoryEntry,
  deleteHistoryEntry
};
