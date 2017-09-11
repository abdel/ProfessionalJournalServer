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
        { name: 'username', value: req.body.Username }
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
        username: req.body.Username,
        password: req.body.Password,
        first_name: req.body.FirstName,
        last_name: req.body.LastName,
        email: req.body.Email,
        date_of_birth: req.body.DateOfBirth
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
