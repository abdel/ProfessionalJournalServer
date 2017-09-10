const _ = require('lodash')
const wrap = require('co-express')
const response = require('../utils/response')

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
        response(res, 200, 'Successfully created a journal.')
      })
      .catch(function () {
        response(res, 500, 'Failed to create a journal.')
      })
  }),

  get: wrap(function * (req, res, next) {
    const journals = yield req.azureMobile.data.execute({
      sql: 'SELECT * FROM Journal WHERE author_id = @username;',
      parameters: [
        { name: 'author_id', value: req.session.user.Id }
      ]
    })

    if (_.isEmpty(journals)) {
      response(res, 500, 'No journals found for this author')
      return
    }

    res.status(200).send({ journals })
  })
}

module.exports = api
