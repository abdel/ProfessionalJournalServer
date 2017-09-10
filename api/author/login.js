const _ = require('lodash')
const wrap = require('co-express')

const api = {
  /**
     * Authenticates the author by matching the userame and password
     */
  post: wrap(function * (req, res, next) {
    // Find matching username in the database
    const checkAuthor = yield req.azureMobile.data.execute({
      sql: 'SELECT TOP 1 * FROM Author WHERE username = @username AND password = @password;',
      parameters: [
        { name: 'username', value: req.body.Username },
        { name: 'password', value: req.body.Password }
      ]
    })

    if (_.isEmpty(checkAuthor)) {
      res.status(500).send({ error: 'Incorrect username or password.' })
      return
    }

    req.session.user = checkAuthor
    req.session.authenticated = true

    res.status(200).send({msg: 'Successfully logged in!'})
  })
}

module.exports = api
