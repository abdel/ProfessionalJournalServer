const _ = require('lodash')
const wrap = require('co-express')

const api = {
  /**
   * Get entry
   */
  get: wrap(function * (req, res, next) {
    const entry = yield req.azureMobile.data.execute({
      sql: 'SELECT * FROM Entry WHERE id = @entry_id;',
      parameters: [
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })

    if (_.isEmpty(entry)) {
      res.status(500).send({ error: 'Entry not found.' })
      return
    }

    res.status(200).send({ entry })
  }),

  /**
   * Create a new entry
   */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile

    const entry = yield context.tables('Entry').insert({
      title: req.body.title,
      journal_id: req.body.journal_id,
      location: req.body.location,
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
      modify_reason: 'Initial version',
      attachment: null
    })

    if (!entryVersion) {
      res.status(500).send({ error: 'Failed to create entry version. Please try again.' })
      return
    }

    yield req.azureMobile.data.execute({
      sql: `UPDATE Entry SET entry_version_id = @entry_version_id WHERE id = @id;`,
      parameters: [
        { name: 'id', value: entry.id },
        { name: 'entry_version_id', value: entryVersion.id }
      ]
    })
  }),

  /**
   * Modify the entry
   */
  put: wrap(function * (req, res, next) {
    const context = req.azureMobile

    const entryVersion = yield context.tables('EntryVersion').insert({
      entry_id: req.body.id,
      text_entry: req.body.entry_version.text_entry,
      version_track_id: req.body.entry_version.version_track_id,
      modify_reason: req.body.entry_version.modify_reason,
      attachment: null
    })

    if (!entryVersion) {
      res.status(500).send({ error: 'Failed to create entry version. Please try again.' })
      return
    }

    yield req.azureMobile.data.execute({
      sql: `UPDATE Entry SET entry_version_id = @entry_version_id WHERE id = @id;`,
      parameters: [
        { name: 'id', value: req.body.id },
        { name: 'entry_version_id', value: entryVersion.id }
      ]
    })
  }),

  /**
   * Mark entry as deleted
   */
  delete: wrap(function * (req, res, next) {
    yield req.azureMobile.data.execute({
      sql: 'UPDATE Entry SET deleted = @deleted WHERE id = @entry_id;',
      parameters: [
        { name: 'deleted', value: true },
        { name: 'entry_id', value: req.query.entry_id }
      ]
    })
  })
}

module.exports = api
