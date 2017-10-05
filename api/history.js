const _ = require('lodash')
const wrap = require('co-express')

const api = {
  get: wrap(function * (req, res, next) {
    const versions = yield req.azureMobile.data.execute({
      sql: `SELECT * FROM EntryVersion as v
            INNER JOIN Entry as e ON v.entry_id = e.id
            WHERE v.entry_id = @entry_id;`,
      parameters: [
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    if (_.isEmpty(versions)) {
      res.status(500).send({ error: 'No entry versions found for this entry.' })
      return
    }

    res.status(200).send({ versions })
  })
}

module.exports = api
