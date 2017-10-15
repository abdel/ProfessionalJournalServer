const _ = require('lodash')
const wrap = require('co-express')

const api = {
  /**
     * Creates a new journal
     */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile

    context.tables('Journal')
      .insert({
        title: req.body.title,
        description: req.body.description,
        author_id: context.user.id
      })
      .then(function (journal) {
        res.status(200).send({ msg: 'Successfully created a journal.' })
      })
      .catch(function (error) {
        console.log('Failed to create a journal', error)
        res.status(500).send({ error: 'Failed to create a journal.' })
      })
  }),

  get: wrap(function * (req, res, next) {
    const journals = yield req.azureMobile.data.execute({
      sql: 'SELECT * FROM Journal WHERE author_id = @author_id ORDER BY createdAt DESC;',
      parameters: [
        { name: 'author_id', value: req.azureMobile.user.id }
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
