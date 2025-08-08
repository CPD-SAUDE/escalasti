const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

exports.getScheduleByMonth = (req, res) => {
  const { year, month } = req.params;
  // Formato da data no banco de dados: YYYY-MM-DD
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`; // Simplificado, pode ser melhorado para meses com menos dias

  db.all(`
    SELECT s.id, s.date, s.professionalId, p.name as professionalName, p.color as professionalColor
    FROM schedule s
    LEFT JOIN professionals p ON s.professionalId = p.id
    WHERE s.date BETWEEN ? AND ?
    ORDER BY s.date ASC
  `, [startDate, endDate], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar escala:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.addOrUpdateScheduleEntry = (req, res) => {
  const { date, professionalId } = req.body; // professionalId pode ser null para remover
  if (!date) {
    return res.status(400).json({ error: "A data é obrigatória." });
  }

  // Verifica se já existe uma entrada para a data
  db.get(`SELECT id FROM schedule WHERE date = ?`, [date], (err, row) => {
    if (err) {
      console.error("Erro ao verificar entrada existente:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Se existe, atualiza
      db.run(`UPDATE schedule SET professionalId = ? WHERE date = ?`, [professionalId, date], function(err) {
        if (err) {
          console.error("Erro ao atualizar entrada da escala:", err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Entrada da escala atualizada com sucesso', changes: this.changes, id: row.id, date, professionalId });
      });
    } else {
      // Se não existe, insere
      const id = uuidv4();
      db.run(`INSERT INTO schedule (id, date, professionalId) VALUES (?, ?, ?)`, [id, date, professionalId], function(err) {
        if (err) {
          console.error("Erro ao adicionar entrada da escala:", err.message);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Entrada da escala adicionada com sucesso', id: id, date, professionalId });
      });
    }
  });
};
