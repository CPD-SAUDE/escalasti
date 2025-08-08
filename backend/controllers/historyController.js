const db = require('../database/database')

exports.getHistory = (req, res) => {
  db.all(
    'SELECT * FROM history ORDER BY timestamp DESC LIMIT 100',
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json(rows)
    },
  )
}

exports.addHistoryEntry = (action, details) => {
  db.run(
    'INSERT INTO history (action, details, timestamp) VALUES (?, ?, datetime("now"))',
    [action, JSON.stringify(details)],
    function (err) {
      if (err) {
        console.error('Error adding history entry:', err.message)
      }
    },
  )
}
