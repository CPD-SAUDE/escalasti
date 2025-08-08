const db = require('../database/database');

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
    return res.status(400).json({ error: "Data e descrição são obrigatórias." });
  }
  db.run(
    `INSERT INTO history (date, description) VALUES (?, ?)`,
    [date, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, date, description });
    }
  );
};
