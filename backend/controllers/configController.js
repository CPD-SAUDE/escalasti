const db = require('../database/database');

exports.getConfig = (req, res) => {
    db.get("SELECT * FROM config WHERE id = 1", (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row || { companyName: "Minha Empresa", departmentName: "TI", systemName: "Sistema de Escala" });
    });
};

exports.updateConfig = (req, res) => {
    const { companyName, departmentName, systemName } = req.body;
    db.run(
        `INSERT OR REPLACE INTO config (id, companyName, departmentName, systemName) VALUES (1, ?, ?, ?)`,
        [companyName, departmentName, systemName],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Configuração atualizada com sucesso', changes: this.changes });
        }
    );
};
