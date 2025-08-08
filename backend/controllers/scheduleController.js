const db = require('../database/database')
const { addHistoryEntry } = require('./historyController')

exports.getSchedule = (req, res) => {
  const { year, month } = req.params
  db.get(
    'SELECT * FROM schedule WHERE year = ? AND month = ?',
    [year, month],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json(row ? JSON.parse(row.data) : {})
    },
  )
}

exports.saveSchedule = (req, res) => {
  const { year, month, data } = req.body
  if (!year || !month || !data) {
    res.status(400).json({ error: 'Year, month, and data are required' })
    return
  }

  const jsonData = JSON.stringify(data)

  db.run(
    `INSERT OR REPLACE INTO schedule (year, month, data) VALUES (?, ?, ?)`,
    [year, month, jsonData],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      addHistoryEntry('save_schedule', { year, month, data })
      res.json({ message: 'Schedule saved successfully', changes: this.changes })
    },
  )
}
