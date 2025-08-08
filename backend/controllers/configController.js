const db = require('../database/database');

exports.getConfig = (req, res) => {
  db.get("SELECT * FROM config WHERE id = 1", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || { id: 1, backendIp: null }); // Retorna um objeto padrão se não houver configuração
  });
};

exports.updateConfig = (req, res) => {
  const { backendIp } = req.body;
  db.run(
    `INSERT OR REPLACE INTO config (id, backendIp) VALUES (1, ?)`,
    [backendIp],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Configuração atualizada com sucesso', id: this.lastID });
    }
  );
};
