const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllHistory = (req, res) => {
  db.all("SELECT * FROM history ORDER BY date DESC, id DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

exports.addHistoryEntry = (req, res) => {
  const { date, description } = req.body;
  if (!date || !description) {
    res.status(400).json({ error: "Data e descrição são obrigatórios." });
    return;
  }

  const id = uuidv4(); // Gerar um UUID para o ID
  db.run(
    `INSERT INTO history (id, date, description) VALUES (?, ?, ?)`,
    [id, date, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Entrada de histórico adicionada com sucesso', id: id });
    }
  );
};

exports.deleteHistoryEntry = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM history WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: "Entrada de histórico não encontrada." });
    } else {
      res.json({ message: 'Entrada de histórico removida com sucesso', id: id });
    }
  });
};
