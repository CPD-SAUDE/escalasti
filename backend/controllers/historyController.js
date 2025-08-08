const db = require('../database/database');

exports.saveSchedule = (req, res) => {
    const { year, month, scheduleData, summaryData, companyName, departmentName, systemName } = req.body;
    const date = new Date(year, month - 1, 1); // Mês é 0-indexado no JS Date
    const monthYear = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    db.run(
        `INSERT INTO history (year, month, monthYear, scheduleData, summaryData, companyName, departmentName, systemName, savedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [year, month, monthYear, JSON.stringify(scheduleData), JSON.stringify(summaryData), companyName, departmentName, systemName, new Date().toISOString()],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ message: 'Escala salva no histórico com sucesso', id: this.lastID });
        }
    );
};

exports.getHistory = (req, res) => {
    db.all("SELECT * FROM history ORDER BY savedAt DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Parse JSON strings back to objects
        const parsedRows = rows.map(row => ({
            ...row,
            scheduleData: JSON.parse(row.scheduleData),
            summaryData: JSON.parse(row.summaryData)
        }));
        res.json(parsedRows);
    });
};

exports.deleteHistoryEntry = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM history WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Entrada do histórico não encontrada' });
        } else {
            res.json({ message: 'Entrada do histórico excluída com sucesso', changes: this.changes });
        }
    });
};
