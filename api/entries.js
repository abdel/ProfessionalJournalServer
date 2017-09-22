const _ = require('lodash')
const wrap = require('co-express')

const api = {
  get: wrap(function * (req, res, next) {
    const entries = yield req.azureMobile.data.execute({
      sql: `SELECT * FROM Entry
            WHERE author_id = @author_id AND journal_id = @journal_id;`,
      parameters: [
        { name: 'author_id', value: req.azureMobile.user.id },
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
