const db = require('../database/database');

exports.getSchedule = (req, res) => {
    const { year, month } = req.params;
    db.get("SELECT data FROM schedules WHERE year = ? AND month = ?", [year, month], (err, row) => {
        if (err) {
            console.error("Erro ao buscar escala:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json(JSON.parse(row.data));
        } else {
            res.json([]); // Retorna um array vazio se não houver dados para o mês/ano
        }
    });
};

exports.saveSchedule = (req, res) => {
    const { year, month, scheduleData } = req.body;
    const dataString = JSON.stringify(scheduleData);

    db.run(`INSERT OR REPLACE INTO schedules (year, month, data) VALUES (?, ?, ?)`,
        [year, month, dataString],
        function (err) {
            if (err) {
                console.error("Erro ao salvar escala:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Escala salva com sucesso', changes: this.changes });
        }
    );
};
