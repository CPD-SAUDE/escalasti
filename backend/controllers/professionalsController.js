const db = require('../database/database');

exports.getAllProfessionals = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM professionals ORDER BY name ASC');
        const professionals = stmt.all();
        res.json(professionals);
    } catch (error) {
        console.error('Erro ao obter profissionais:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter profissionais.' });
    }
};

exports.getProfessionalById = (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('SELECT * FROM professionals WHERE id = ?');
        const professional = stmt.get(id);
        if (professional) {
            res.json(professional);
        } else {
            res.status(404).json({ message: 'Profissional não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao obter profissional por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter profissional.' });
    }
};

exports.addProfessional = (req, res) => {
    const { name, color } = req.body;
    if (!name || !color) {
        return res.status(400).json({ message: 'Nome e cor são obrigatórios.' });
    }
    try {
        const stmt = db.prepare('INSERT INTO professionals (name, color) VALUES (?, ?)');
        const info = stmt.run(name, color);
        res.status(201).json({ message: 'Profissional adicionado com sucesso!', id: info.lastInsertRowid });
    } catch (error) {
        console.error('Erro ao adicionar profissional:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao adicionar profissional.' });
    }
};

exports.updateProfessional = (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    if (!name || !color) {
        return res.status(400).json({ message: 'Nome e cor são obrigatórios.' });
    }
    try {
        const stmt = db.prepare('UPDATE professionals SET name = ?, color = ? WHERE id = ?');
        const info = stmt.run(name, color, id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Profissional não encontrado.' });
        }
        res.json({ message: 'Profissional atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar profissional:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar profissional.' });
    }
};

exports.deleteProfessional = (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM professionals WHERE id = ?');
        const info = stmt.run(id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Profissional não encontrado.' });
        }
        res.json({ message: 'Profissional removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover profissional:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao remover profissional.' });
    }
};
