const _ = require('lodash')
const wrap = require('co-express')

const api = {
  /**
     * Creates a new entry
     */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile

    const entry = yield context.tables('Entry').insert({
      title: req.body.title,
      journal_id: req.body.journal_id,
      location: null,
      deleted: false,
      hidden: false
    })

    if (!entry) {
      res.status(500).send({ error: 'Failed to create entry. Please try again.' })
      return
    }

    const entryVersion = yield context.tables('EntryVersion').insert({
      entry_id: entry.id,
      text_entry: req.body.entry_version.text_entry,
      version_track_id: 1,
      modify_reason: null,
      attachment: null
    })

    if (!entryVersion) {
      res.status(500).send({ error: 'Failed to create entry version. Please try again.' })
      return
    }

    yield context.tables('Entry').update(entry, {
      entry_version_id: entryVersion.id
    })
  }),

  get: wrap(function * (req, res, next) {
    const entry = yield req.azureMobile.data.execute({
      sql: 'SELECT * FROM Entry WHERE id = @id;',
      parameters: [
        { name: 'id', value: req.query.id }
      ]
    })

    if (_.isEmpty(entry)) {
      res.status(500).send({ error: 'Entry not found.' })
      return
    }

    res.status(200).send({ entry })
  })
}

module.exports = api
