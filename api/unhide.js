const wrap = require('co-express')

const api = {
  /**
   * Unhide an entry
   */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile

    yield context.data.execute({
      sql: `UPDATE Entry SET hidden = @hidden WHERE id = @entry_id;`,
      parameters: [
        { name: 'hidden', value: false },
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    res.status(200).send({ hidden: false })
  })
}

module.exports = api
