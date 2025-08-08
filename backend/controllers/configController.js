const db = require('../database/database');

exports.getConfig = (req, res) => {
  db.get("SELECT * FROM config WHERE id = 1", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || { id: 1, networkIp: '127.0.0.1' }); // Retorna um valor padrão se não houver config
  });
};

exports.updateConfig = (req, res) => {
  const { networkIp } = req.body;
  db.run(
    `INSERT OR REPLACE INTO config (id, networkIp) VALUES (1, ?)`,
    [networkIp],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Configuração atualizada com sucesso', networkIp: networkIp });
    }
  );
};
