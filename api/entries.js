const _ = require('lodash')
const wrap = require('co-express')

const api = {
  get: wrap(function * (req, res, next) {
    let entryQuery = `SELECT * FROM Entry WHERE journal_id = @journal_id`
    const entryParams = [ { name: 'journal_id', value: req.query.journal_id } ]

    console.log(req.query)

    if (req.query.text !== '') {
      entryQuery += ` AND title LIKE '%` + req.query.text + `%'`
      entryParams.push({ name: 'title', value: req.query.text })
    }

    if (req.query.deleted === 'False' && req.query.hidden === 'False') {
      entryQuery += ` AND deleted = @deleted AND hidden = @hidden`
      entryParams.push({ name: 'deleted', value: false })
      entryParams.push({ name: 'hidden', value: false })
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
