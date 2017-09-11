const _ = require('lodash')
const wrap = require('co-express')

const api = {
  /**
     * Creates a new journal
     */
  post: wrap(function * (req, res, next) {
    // Insert new journal
    var insertQuery = {
      sql: 'INSERT INTO Journal (title, description) VALUES (title, description)',
      parameters: [
        { name: 'title', value: req.body.Title },
        { name: 'description', value: req.body.Description }
      ]
    }

    // Execute insert query and return result
    req.azureMobile.data.execute(insertQuery)
      .then(function (result) {
        res.status(200).send({ msg: 'Successfully created a journal.' })
      })
      .catch(function () {
        res.status(500).send({ error: 'Failed to create a journal.' })
      })
  }),

  get: wrap(function * (req, res, next) {
    const journals = yield req.azureMobile.data.execute({
      sql: 'SELECT * FROM Journal WHERE author_id = @username;',
      parameters: [
        { name: 'author_id', value: req.azureMobile.user.Id }
      ]
    })

    if (_.isEmpty(journals)) {
      res.status(500).send({ error: 'No journals found for this author' })
      return
    }

    res.status(200).send({ journals })
  })
}

module.exports = api
