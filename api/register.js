const _ = require('lodash')
const wrap = require('co-express')
const response = require('../utils/response')

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
      response(res, 500, 'Username already exists.')
      return
    }

    // Insert new author
    var insertQuery = {
      sql: `INSERT INTO Author (first_name, last_name, username, password, email, date_of_birth) 
            VALUES (@first_name, @last_name, @username, @password, @email, @date_of_birth)`,
      parameters: [
        { name: 'username', value: req.body.Username },
        { name: 'password', value: req.body.Password },
        { name: 'first_name', value: req.body.FirstName },
        { name: 'last_name', value: req.body.LastName },
        { name: 'email', value: req.body.Email },
        { name: 'date_of_birth', value: req.body.DateOfBirth }
      ]
    }

    // Execute insert query and return result
    req.azureMobile.data.execute(insertQuery)
      .then(function (result) {
        response(res, 200, 'Successfully registered author.')
      })
      .catch(function () {
        response(res, 500, 'Failed to register author.')
      })
  })
}

module.exports = api
