const db = require('../database/database');

exports.getConfig = (req, res) => {
    db.get("SELECT companyName, departmentName, systemName FROM config WHERE id = 1", (err, row) => {
        if (err) {
            console.error("Erro ao buscar configuração:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(row || { companyName: null, departmentName: null, systemName: null });
    });
};

exports.updateConfig = (req, res) => {
    const { companyName, departmentName, systemName } = req.body;
    db.run(`UPDATE config SET companyName = ?, departmentName = ?, systemName = ? WHERE id = 1`,
        [companyName, departmentName, systemName],
        function (err) {
            if (err) {
                console.error("Erro ao atualizar configuração:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Configuração atualizada com sucesso', changes: this.changes });
        }
    );
};
