const db = require('../database/database');

exports.getProfessionals = (req, res) => {
    db.all("SELECT * FROM professionals ORDER BY name ASC", (err, rows) => {
        if (err) {
            console.error("Erro ao buscar profissionais:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.addProfessional = (req, res) => {
    const { name, defaultHours, color } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Nome do profissional é obrigatório." });
    }
    db.run(`INSERT INTO professionals (name, defaultHours, color) VALUES (?, ?, ?)`,
        [name, defaultHours || 0, color || '#000000'],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed: professionals.name")) {
                    return res.status(409).json({ error: "Já existe um profissional com este nome." });
                }
                console.error("Erro ao adicionar profissional:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Profissional adicionado com sucesso', id: this.lastID });
        }
    );
};

exports.updateProfessional = (req, res) => {
    const { id } = req.params;
    const { name, defaultHours, color } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Nome do profissional é obrigatório." });
    }
    db.run(`UPDATE professionals SET name = ?, defaultHours = ?, color = ? WHERE id = ?`,
        [name, defaultHours, color, id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed: professionals.name")) {
                    return res.status(409).json({ error: "Já existe outro profissional com este nome." });
                }
                console.error("Erro ao atualizar profissional:", err.message);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Profissional não encontrado." });
            }
            res.json({ message: 'Profissional atualizado com sucesso', changes: this.changes });
        }
    );
};

exports.deleteProfessional = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM professionals WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error("Erro ao deletar profissional:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Profissional não encontrado." });
        }
        res.json({ message: 'Profissional deletado com sucesso', changes: this.changes });
    });
};
