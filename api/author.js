const _ = require('lodash')
const wrap = require('co-express')
const auth = require('azure-mobile-apps/src/auth')

const api = {
  /**
     * Authenticates the author by matching the userame and password
     */
  post: wrap(function * (req, res, next) {
    const context = req.azureMobile
    const sign = auth(context.configuration.auth).sign

    // Find matching username in the database
    const author = yield req.azureMobile.data.execute({
      sql: 'SELECT TOP 1 * FROM Author WHERE username = @username AND password = @password;',
      parameters: [
        { name: 'username', value: req.body.Username },
        { name: 'password', value: req.body.Password }
      ]
    })

    if (_.isEmpty(author)) {
      res.status(500).send({ error: 'Incorrect username or password.' })
      return
    }

    res.status(200).json(createResponse(sign, author[0]))
  }),

  put: wrap(function * (req, res, next) {
    const context = req.azureMobile
    const sign = auth(context.configuration.auth).sign

    context.tables('Author')
      .insert({
        username: req.body.Username,
        password: req.body.Password,
        first_name: req.body.FirstName,
        last_name: req.body.LastName,
        email: req.body.Email,
        date_of_birth: req.body.DateOfBirth
      })
      .then(function (author) {
        res.status(200).json(createResponse(sign, author))
      })
      .catch(next)
  })
}

function createResponse (sign, author) {
  return {
    Token: sign({ sub: author.Id })
  }
}

module.exports = api
