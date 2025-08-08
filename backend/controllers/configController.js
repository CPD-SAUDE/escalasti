const db = require('../database/database');

// Obter configuração
const getConfig = (req, res) => {
  db.get('SELECT * FROM config WHERE id = 1', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || { id: 1, backendIp: null });
  });
};

// Atualizar configuração
const updateConfig = (req, res) => {
  const { backendIp } = req.body;

  db.run('UPDATE config SET backendIp = ? WHERE id = 1',
    [backendIp],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: 1, backendIp });
    }
  );
};

module.exports = {
  getConfig,
  updateConfig
};
