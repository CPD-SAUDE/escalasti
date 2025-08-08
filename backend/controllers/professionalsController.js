const db = require('../database/database');

exports.getAllProfessionals = (req, res) => {
    db.all("SELECT * FROM professionals", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
};

exports.addProfessional = (req, res) => {
    const { name, defaultHours, color } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Nome do profissional é obrigatório." });
    }
    db.run(
        `INSERT INTO professionals (name, defaultHours, color) VALUES (?, ?, ?)`,
        [name, defaultHours || 0, color || '#000000'],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID, name, defaultHours, color });
        }
    );
};

exports.updateProfessional = (req, res) => {
    const { id } = req.params;
    const { name, defaultHours, color } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Nome do profissional é obrigatório." });
    }
    db.run(
        `UPDATE professionals SET name = ?, defaultHours = ?, color = ? WHERE id = ?`,
        [name, defaultHours || 0, color || '#000000', id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Profissional não encontrado' });
            } else {
                res.json({ message: 'Profissional atualizado com sucesso', changes: this.changes });
            }
        }
    );
};

exports.deleteProfessional = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM professionals WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Profissional não encontrado' });
        } else {
            res.json({ message: 'Profissional excluído com sucesso', changes: this.changes });
        }
    });
};
