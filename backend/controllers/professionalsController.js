const db = require('../database/database')
const { addHistoryEntry } = require('./historyController')

exports.getAllProfessionals = (req, res) => {
  db.all('SELECT * FROM professionals', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
}

exports.addProfessional = (req, res) => {
  const { name, color } = req.body
  if (!name || !color) {
    res.status(400).json({ error: 'Name and color are required' })
    return
  }
  db.run(
    'INSERT INTO professionals (name, color) VALUES (?, ?)',
    [name, color],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      const newProfessional = { id: this.lastID, name, color }
      addHistoryEntry('add_professional', newProfessional)
      res.status(201).json(newProfessional)
    },
  )
}

exports.updateProfessional = (req, res) => {
  const { id } = req.params
  const { name, color } = req.body
  if (!name || !color) {
    res.status(400).json({ error: 'Name and color are required' })
    return
  }
  db.run(
    'UPDATE professionals SET name = ?, color = ? WHERE id = ?',
    [name, color, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (this.changes === 0) {
        res.status(404).json({ message: 'Professional not found' })
        return
      }
      const updatedProfessional = { id: parseInt(id), name, color }
      addHistoryEntry('update_professional', updatedProfessional)
      res.json(updatedProfessional)
    },
  )
}

exports.deleteProfessional = (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM professionals WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Professional not found' })
      return
    }
    addHistoryEntry('delete_professional', { id: parseInt(id) })
    res.json({ message: 'Professional deleted successfully' })
  })
}
