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
        { name: 'username', value: req.body.username },
        { name: 'password', value: req.body.password }
      ]
    })

    if (_.isEmpty(author)) {
      res.status(500).send({ error: 'Incorrect username or password.' })
      return
    }

    res.status(200).json(createResponse(sign, author[0]))
  })
}

function createResponse (sign, author) {
  return {
    Token: sign({ sub: author.id })
  }
}

module.exports = api
