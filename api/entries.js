const _ = require('lodash')
const wrap = require('co-express')

const api = {
  get: wrap(function * (req, res, next) {
    let entryQuery = `SELECT * FROM Entry WHERE journal_id = @journal_id`
    const entryParams = [ { name: 'journal_id', value: req.query.journal_id } ]

    if (req.query.text !== null) {
      entryQuery += ` AND title LIKE '%@title%'`
      entryQuery.push({ name: 'title', value: req.query.text })
    }

    if (req.query.deleted === true) {
      entryQuery += ` AND deleted = @deleted`
      entryParams.push({ name: 'deleted', value: true })
    }

    if (req.query.hidden === true) {
      entryQuery += ` AND hidden = @hidden`
      entryParams.push({ name: 'hidden', value: true })
    }

    const entries = yield req.azureMobile.data.execute({
      sql: entryQuery,
      parameters: entryParams
    })

    if (_.isEmpty(entries)) {
      res.status(500).send({ error: 'No entries found for this journal.' })
      return
    }

    for (let i = 0; i < entries.length; i++) {
      const versionQuery = `SELECT * FROM EntryVersion WHERE id = @id`
      const versionParams = [ { name: 'id', value: entries[i].entry_version_id } ]

      const entryVersion = yield req.azureMobile.data.execute({
        sql: versionQuery,
        parameters: versionParams
      })

      entries[i].entry_version = entryVersion[0]
    }

    res.status(200).send({ entries })
  })
}

module.exports = api
