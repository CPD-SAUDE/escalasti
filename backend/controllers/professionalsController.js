const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllProfessionals = (req, res) => {
  db.all("SELECT * FROM professionals ORDER BY name", (err, rows) => {
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
    res.status(400).json({ error: "Nome e cor são obrigatórios." });
    return;
  }

  const id = uuidv4(); // Gerar um UUID para o ID
  db.run(
    `INSERT INTO professionals (id, name, color) VALUES (?, ?, ?)`,
    [id, name, color],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Profissional adicionado com sucesso', id: id });
    }
  );
};

exports.updateProfessional = (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  if (!name || !color) {
    res.status(400).json({ error: "Nome e cor são obrigatórios." });
    return;
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
        res.status(404).json({ message: "Profissional não encontrado." });
      } else {
        res.json({ message: 'Profissional atualizado com sucesso', id: id });
      }
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
      res.status(404).json({ message: "Profissional não encontrado." });
    } else {
      res.json({ message: 'Profissional removido com sucesso', id: id });
    }
  });
};
