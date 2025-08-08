const db = require('../database/database');

exports.getConfig = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM config LIMIT 1');
        let config = stmt.get();

        if (!config) {
            // Se não houver configuração, cria uma padrão
            const insertStmt = db.prepare('INSERT INTO config (holidays) VALUES (?)');
            insertStmt.run(JSON.stringify([]));
            config = { id: 1, holidays: '[]' }; // Retorna a configuração padrão
        }

        // Parseia o JSON de feriados
        config.holidays = JSON.parse(config.holidays);
        res.json(config);
    } catch (error) {
        console.error('Erro ao obter configuração:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter configuração.' });
    }
};

exports.updateConfig = (req, res) => {
    const { holidays } = req.body;

    if (!Array.isArray(holidays)) {
        return res.status(400).json({ message: 'Feriados devem ser um array.' });
    }

    try {
        // Verifica se já existe uma configuração
        const checkStmt = db.prepare('SELECT id FROM config LIMIT 1');
        const existingConfig = checkStmt.get();

        if (existingConfig) {
            // Atualiza a configuração existente
            const updateStmt = db.prepare('UPDATE config SET holidays = ? WHERE id = ?');
            updateStmt.run(JSON.stringify(holidays), existingConfig.id);
            res.json({ message: 'Configuração atualizada com sucesso!' });
        } else {
            // Cria uma nova configuração se não existir
            const insertStmt = db.prepare('INSERT INTO config (holidays) VALUES (?)');
            insertStmt.run(JSON.stringify(holidays));
            res.status(201).json({ message: 'Configuração criada com sucesso!' });
        }
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar configuração.' });
    }
};
