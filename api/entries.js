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

    for (let i = 0; i < entries.length; i++) {
      const entryVersion = yield req.azureMobile.data.execute({
        sql: `SELECT * FROM EntryVersion WHERE id = @id;`,
        parameters: [
          { name: 'id', value: entries[i].entry_version_id }
        ]
      })

      entries[i].entry_version = entryVersion[0]
    }

    res.status(200).send({ entries })
  })
}

module.exports = api
