const db = require('../database/database');

exports.getScheduleByMonth = (req, res) => {
  const { year, month } = req.params;
  db.all(
    `SELECT * FROM schedule WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ? ORDER BY date ASC`,
    [year, month.padStart(2, '0')], // Garante que o mês tenha 2 dígitos
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

exports.addOrUpdateScheduleEntry = (req, res) => {
  const { date, professionalId } = req.body; // professionalId pode ser null para remover
  if (!date) {
    return res.status(400).json({ error: "Data é obrigatória." });
  }

  // Verifica se a entrada já existe para a data
  db.get(`SELECT * FROM schedule WHERE date = ?`, [date], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (row) {
      // Se existe, atualiza
      db.run(
        `UPDATE schedule SET professionalId = ? WHERE date = ?`,
        [professionalId, date],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Entrada da escala atualizada com sucesso', date, professionalId });
        }
      );
    } else {
      // Se não existe, insere
      db.run(
        `INSERT INTO schedule (date, professionalId) VALUES (?, ?)`,
        [date, professionalId],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(201).json({ id: this.lastID, date, professionalId });
        }
      );
    }
  });
};
