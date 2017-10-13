const _ = require('lodash')
const wrap = require('co-express')

const api = {
  get: wrap(function * (req, res, next) {
    const entry = yield req.azureMobile.data.execute({
      sql: `SELECT * FROM Entry WHERE id = @entry_id;`,
      parameters: [
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    const versions = yield req.azureMobile.data.execute({
      sql: `SELECT * FROM EntryVersion WHERE entry_id = @entry_id ORDER BY version_track_id DESC;`,
      parameters: [
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    if (_.isEmpty(versions)) {
      res.status(500).send({ error: 'No entry versions found for this entry.' })
      return
    }

    const entries = []
    for (let i = 0; i < versions.length; i++) {
      entries[i] = {
        id: entry[0].id,
        title: entry[0].title,
        location: entry[0].location
      }
      entries[i].entry_version = versions[i]
    }

    res.status(200).send({ entries })
  })
}

module.exports = api
