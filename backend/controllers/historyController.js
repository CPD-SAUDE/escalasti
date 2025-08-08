const db = require('../database/database');

exports.getAllHistory = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM history ORDER BY date DESC');
        const history = stmt.all();
        res.json(history);
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter histórico.' });
    }
};

exports.getHistoryByMonth = (req, res) => {
    const { year, month } = req.params; // month é 1-indexed

    if (!year || !month) {
        return res.status(400).json({ message: 'Ano e mês são obrigatórios.' });
    }

    try {
        // Converte o mês para ter dois dígitos (ex: 01, 02)
        const formattedMonth = String(month).padStart(2, '0');
        const startDate = `${year}-${formattedMonth}-01`;
        const endDate = `${year}-${formattedMonth}-31`; // Simplificado, pode ser melhorado para meses com menos dias

        const stmt = db.prepare('SELECT * FROM history WHERE date BETWEEN ? AND ? ORDER BY date DESC');
        const history = stmt.all(startDate, endDate);
        res.json(history);
    } catch (error) {
        console.error('Erro ao obter histórico por mês:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter histórico por mês.' });
    }
};

exports.addHistoryEntry = (req, res) => {
    const { date, description } = req.body;

    if (!date || !description) {
        return res.status(400).json({ message: 'Data e descrição são obrigatórios.' });
    }

    try {
        const stmt = db.prepare('INSERT INTO history (date, description) VALUES (?, ?)');
        const info = stmt.run(date, description);
        res.status(201).json({ message: 'Entrada de histórico adicionada com sucesso!', id: info.lastInsertRowid });
    } catch (error) {
        console.error('Erro ao adicionar entrada de histórico:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao adicionar entrada de histórico.' });
    }
};

// Opcional: Adicionar endpoint para deletar entrada de histórico
exports.deleteHistoryEntry = (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('DELETE FROM history WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Entrada de histórico não encontrada.' });
        }
        res.json({ message: 'Entrada de histórico removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover entrada de histórico:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao remover entrada de histórico.' });
    }
};
