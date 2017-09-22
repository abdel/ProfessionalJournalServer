const _ = require('lodash')
const wrap = require('co-express')

const api = {
  get: wrap(function * (req, res, next) {
    const entries = yield req.azureMobile.data.execute({
      sql: `SELECT * FROM Entry WHERE journal_id = @journal_id;`,
      parameters: [
        { name: 'journal_id', value: req.query.journal_id }
      ]
    })

    if (_.isEmpty(entries)) {
      res.status(500).send({ error: 'No entries found for this journal.' })
      return
    }

    res.status(200).send({ entries })
  })
}

module.exports = api
