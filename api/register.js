const _ = require('lodash')
const wrap = require('co-express')

const api = {
  /**
     * Registers a new author by checking for existing username before
     * inserting the author into the database.
     */
  post: wrap(function * (req, res, next) {
    // Find matching username in the database
    var checkUsername = yield req.azureMobile.data.execute({
      sql: 'SELECT username FROM Author WHERE username = @username',
      parameters: [
        { name: 'username', value: req.body.username }
      ]
    })

    // Cancel registration if username is not unique
    if (!_.isEmpty(checkUsername)) {
      res.status(500).send({ error: 'Username already exists.' })
      return
    }

    // Insert new author
    req.azureMobile.tables('Author')
      .insert({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth
      })
      .then(function (author) {
        res.status(200).send({ msg: 'Successfully registered author.' })
      })
      .catch(function () {
        res.status(500).send({ error: 'Failed to register author.' })
      })
  })
}

module.exports = api
