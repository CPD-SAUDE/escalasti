const db = require('../database/database');

// Obter escala por mês
const getScheduleByMonth = (req, res) => {
  const { year, month } = req.params;
  
  // Criar padrão de data para o mês (YYYY-MM-%)
  const datePattern = `${year}-${month.padStart(2, '0')}-%`;
  
  db.all(
    `SELECT s.*, p.name as professionalName, p.color as professionalColor 
     FROM schedule s 
     LEFT JOIN professionals p ON s.professionalId = p.id 
     WHERE s.date LIKE ?`,
    [datePattern],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Adicionar ou atualizar entrada na escala
const addOrUpdateScheduleEntry = (req, res) => {
  const { id, date, professionalId } = req.body;

  if (!id || !date) {
    return res.status(400).json({ error: 'ID e data são obrigatórios' });
  }

  // Usar INSERT OR REPLACE para adicionar ou atualizar
  db.run(
    'INSERT OR REPLACE INTO schedule (id, date, professionalId) VALUES (?, ?, ?)',
    [id, date, professionalId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, date, professionalId });
    }
  );
};

module.exports = {
  getScheduleByMonth,
  addOrUpdateScheduleEntry
};
