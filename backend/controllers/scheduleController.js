const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

exports.getScheduleByMonth = (req, res) => {
  const { year, month } = req.params;
  // Garante que o mês tenha dois dígitos para a comparação de string
  const formattedMonth = String(month).padStart(2, '0');
  const startDate = `${year}-${formattedMonth}-01`;
  const endDate = `${year}-${formattedMonth}-31`; // Simplificado, pode ser melhorado para meses com menos dias

  db.all(
    `SELECT * FROM schedule WHERE date BETWEEN ? AND ? ORDER BY date`,
    [startDate, endDate],
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
    res.status(400).json({ error: "Data é obrigatória." });
    return;
  }

  // Primeiro, verifica se já existe uma entrada para a data
  db.get(`SELECT id FROM schedule WHERE date = ?`, [date], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (row) {
      // Se professionalId for null, deleta a entrada
      if (professionalId === null) {
        db.run(`DELETE FROM schedule WHERE id = ?`, [row.id], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          if (this.changes === 0) {
            res.status(404).json({ message: "Entrada da escala não encontrada para remoção." });
          } else {
            res.json({ message: 'Entrada da escala removida com sucesso', date: date });
          }
        });
      } else {
        // Atualiza a entrada existente
        db.run(
          `UPDATE schedule SET professionalId = ? WHERE id = ?`,
          [professionalId, row.id],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'Entrada da escala atualizada com sucesso', id: row.id });
          }
        );
      }
    } else {
      // Se não existir e professionalId não for null, insere uma nova entrada
      if (professionalId !== null) {
        const id = uuidv4(); // Gerar um UUID para o ID
        db.run(
          `INSERT INTO schedule (id, date, professionalId) VALUES (?, ?, ?)`,
          [id, date, professionalId],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.status(201).json({ message: 'Entrada da escala adicionada com sucesso', id: id });
          }
        );
      } else {
        // Se não existe e professionalId é null, não faz nada (não há o que remover)
        res.status(200).json({ message: 'Nenhuma ação necessária, entrada não existe para remoção.' });
      }
    }
  });
};
