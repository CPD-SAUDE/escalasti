const db = require('../database/database');

exports.getAllProfessionals = (req, res) => {
  db.all("SELECT * FROM professionals ORDER BY name ASC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

exports.addProfessional = (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ error: "Nome e cor são obrigatórios." });
  }
  db.run(
    `INSERT INTO professionals (name, color) VALUES (?, ?)`,
    [name, color],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, color });
    }
  );
};

exports.updateProfessional = (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ error: "Nome e cor são obrigatórios." });
  }
  db.run(
    `UPDATE professionals SET name = ?, color = ? WHERE id = ?`,
    [name, color, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Profissional não encontrado." });
      }
      res.json({ message: 'Profissional atualizado com sucesso', id, name, color });
    }
  );
};

exports.deleteProfessional = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM professionals WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Profissional não encontrado." });
    }
    res.json({ message: 'Profissional removido com sucesso', id });
  });
};
