const wrap = require('co-express')

const api = {
  /**
   * Unhide an entry
   */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile

    const entry = yield context.data.execute({
      sql: `UPDATE Entry SET hidden = @hidden WHERE id = @entry_id;`,
      parameters: [
        { name: 'hidden', value: false },
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    if (!entry) {
      res.status(500).send({ error: 'Failed to unhide entry. Please try again.' })
      return
    }

    res.status(200).send({ entry })
  })
}

module.exports = api