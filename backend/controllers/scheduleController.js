const db = require('../database/database');

// Helper para obter o número de dias em um mês
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

// Helper para obter o dia da semana (0=Dom, 6=Sáb)
const getDayOfWeek = (year, month, day) => new Date(year, month - 1, day).getDay();

exports.getSchedule = (req, res) => {
    const { year, month } = req.query;
    db.get("SELECT * FROM schedules WHERE year = ? AND month = ?", [year, month], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(JSON.parse(row.data));
        } else {
            // Retorna uma escala vazia para o mês se não existir
            const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
            const emptySchedule = Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                professionalId: null,
                hours: null,
                notes: ""
            }));
            res.json(emptySchedule);
        }
    });
};

exports.updateScheduleEntry = (req, res) => {
    const { year, month } = req.query;
    const { day, professionalId, hours, notes } = req.body;

    db.get("SELECT * FROM schedules WHERE year = ? AND month = ?", [year, month], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        let scheduleData;
        if (row) {
            scheduleData = JSON.parse(row.data);
        } else {
            const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
            scheduleData = Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                professionalId: null,
                hours: null,
                notes: ""
            }));
        }

        const entryIndex = scheduleData.findIndex(entry => entry.day === day);
        if (entryIndex !== -1) {
            scheduleData[entryIndex] = { day, professionalId, hours, notes };
        } else {
            // Should not happen if scheduleData is correctly initialized for all days
            return res.status(400).json({ error: "Dia inválido na escala." });
        }

        db.run(
            `INSERT OR REPLACE INTO schedules (year, month, data) VALUES (?, ?, ?)`,
            [year, month, JSON.stringify(scheduleData)],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Entrada da escala atualizada com sucesso', changes: this.changes });
            }
        );
    });
};

exports.generateSchedule = (req, res) => {
    const { year, month, type } = req.body; // type: 'daily' or 'weekly'

    db.all("SELECT id FROM professionals", (err, professionalRows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const professionalIds = professionalRows.map(p => p.id);

        if (professionalIds.length === 0) {
            return res.status(400).json({ error: "Nenhum profissional cadastrado para gerar a escala." });
        }

        const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
        const newSchedule = [];
        let currentProfessionalIndex = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            let assignedProfessionalId = null;
            let assignedHours = null;

            if (type === 'daily') {
                assignedProfessionalId = professionalIds[currentProfessionalIndex];
                currentProfessionalIndex = (currentProfessionalIndex + 1) % professionalIds.length;
            } else if (type === 'weekly') {
                const dayOfWeek = getDayOfWeek(parseInt(year), parseInt(month), day); // 0 for Sunday, 6 for Saturday
                if (dayOfWeek === 0 || day === 1) { // Start of week (Sunday) or first day of month
                    assignedProfessionalId = professionalIds[currentProfessionalIndex];
                    currentProfessionalIndex = (currentProfessionalIndex + 1) % professionalIds.length;
                } else {
                    assignedProfessionalId = newSchedule[newSchedule.length - 1].professionalId;
                }
            }

            newSchedule.push({
                day: day,
                professionalId: assignedProfessionalId,
                hours: 8, // Default hours for generated schedule
                notes: ""
            });
        }

        db.run(
            `INSERT OR REPLACE INTO schedules (year, month, data) VALUES (?, ?, ?)`,
            [year, month, JSON.stringify(newSchedule)],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Escala gerada com sucesso', changes: this.changes });
            }
        );
    });
};

exports.clearSchedule = (req, res) => {
    const { year, month } = req.body;
    db.run(`DELETE FROM schedules WHERE year = ? AND month = ?`, [year, month], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Nenhuma escala encontrada para o mês/ano especificado' });
        } else {
            res.json({ message: 'Escala limpa com sucesso', changes: this.changes });
        }
    });
};
