const db = require('../database/database');

exports.getHistory = (req, res) => {
    db.all("SELECT id, year, month, monthYear, companyName, departmentName, systemName, savedAt FROM history ORDER BY savedAt DESC", (err, rows) => {
        if (err) {
            console.error("Erro ao buscar histórico:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.getHistoryById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM history WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Erro ao buscar item do histórico:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Item do histórico não encontrado." });
        }
        res.json(row);
    });
};

exports.saveHistory = (req, res) => {
    const { year, month, monthYear, scheduleData, summaryData, companyName, departmentName, systemName } = req.body;
    const savedAt = new Date().toISOString(); // Data e hora atual

    db.run(`INSERT INTO history (year, month, monthYear, scheduleData, summaryData, companyName, departmentName, systemName, savedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [year, month, monthYear, JSON.stringify(scheduleData), JSON.stringify(summaryData), companyName, departmentName, systemName, savedAt],
        function (err) {
            if (err) {
                console.error("Erro ao salvar histórico:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Histórico salvo com sucesso', id: this.lastID });
        }
    );
};

exports.deleteHistory = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM history WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error("Erro ao deletar histórico:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Item do histórico não encontrado." });
        }
        res.json({ message: 'Item do histórico deletado com sucesso', changes: this.changes });
    });
};
