const db = require('../database/database');

exports.getConfig = (req, res) => {
  db.get(`SELECT backendIp FROM config WHERE id = 1`, (err, row) => {
    if (err) {
      console.error("Erro ao buscar configuração:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(row || { backendIp: null });
  });
};

exports.updateConfig = (req, res) => {
  const { backendIp } = req.body;
  db.run(`UPDATE config SET backendIp = ? WHERE id = 1`, [backendIp], function(err) {
    if (err) {
      console.error("Erro ao atualizar configuração:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Configuração atualizada com sucesso', changes: this.changes });
  });
};
