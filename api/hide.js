const wrap = require('co-express')

const api = {
  /**
   * Hide an entry
   */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile

    yield context.data.execute({
      sql: `UPDATE Entry SET hidden = @hidden WHERE id = @entry_id;`,
      parameters: [
        { name: 'hidden', value: true },
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    res.status(200).send({ hidden: true })
  })
}

module.exports = api
