const db = require('../database/database');

exports.getScheduleByMonth = (req, res) => {
    const { year, month } = req.params; // month é 1-indexed

    if (!year || !month) {
        return res.status(400).json({ message: 'Ano e mês são obrigatórios.' });
    }

    try {
        // Converte o mês para ter dois dígitos (ex: 01, 02)
        const formattedMonth = String(month).padStart(2, '0');
        const startDate = `${year}-${formattedMonth}-01`;
        const endDate = `${year}-${formattedMonth}-31`; // Simplificado, pode ser melhorado para meses com menos dias

        const stmt = db.prepare('SELECT * FROM schedule WHERE date BETWEEN ? AND ? ORDER BY date ASC');
        const schedule = stmt.all(startDate, endDate);
        res.json(schedule);
    } catch (error) {
        console.error('Erro ao obter escala por mês:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter escala.' });
    }
};

exports.addOrUpdateScheduleEntry = (req, res) => {
    const { date, professionalId } = req.body;

    if (!date || professionalId === undefined || professionalId === null) {
        return res.status(400).json({ message: 'Data e ID do profissional são obrigatórios.' });
    }

    try {
        // Verifica se já existe uma entrada para a data
        const existingEntryStmt = db.prepare('SELECT id FROM schedule WHERE date = ?');
        const existingEntry = existingEntryStmt.get(date);

        if (existingEntry) {
            // Se professionalId for null, significa remover o profissional da data
            if (professionalId === null) {
                const deleteStmt = db.prepare('DELETE FROM schedule WHERE id = ?');
                deleteStmt.run(existingEntry.id);
                res.json({ message: 'Profissional removido da data com sucesso!' });
            } else {
                // Atualiza a entrada existente
                const updateStmt = db.prepare('UPDATE schedule SET professionalId = ? WHERE id = ?');
                updateStmt.run(professionalId, existingEntry.id);
                res.json({ message: 'Escala atualizada com sucesso!' });
            }
        } else {
            // Se professionalId for null e não existir entrada, não faz nada
            if (professionalId === null) {
                return res.status(200).json({ message: 'Nenhuma entrada para remover.' });
            }
            // Adiciona uma nova entrada
            const insertStmt = db.prepare('INSERT INTO schedule (date, professionalId) VALUES (?, ?)');
            const info = insertStmt.run(date, professionalId);
            res.status(201).json({ message: 'Escala adicionada com sucesso!', id: info.lastInsertRowid });
        }
    } catch (error) {
        console.error('Erro ao adicionar ou atualizar escala:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao adicionar ou atualizar escala.' });
    }
};

exports.deleteScheduleEntry = (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('DELETE FROM schedule WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Entrada da escala não encontrada.' });
        }
        res.json({ message: 'Entrada da escala removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover entrada da escala:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao remover entrada da escala.' });
    }
};
