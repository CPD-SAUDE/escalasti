const db = require('../database/database')

exports.getConfig = (req, res) => {
  db.get('SELECT * FROM config WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(row || {})
  })
}

exports.updateConfig = (req, res) => {
  const { api_url } = req.body
  db.run(
    `INSERT OR REPLACE INTO config (id, api_url) VALUES (1, ?)`,
    [api_url],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json({ message: 'Config updated successfully', changes: this.changes })
    },
  )
}
