const wrap = require('co-express')

const api = {
  /**
     * Authenticates the author by matching the userame and password
     */
  get: wrap(function * (req, res, next) {
    delete req.session.user
    delete req.session.authenticated
  })
}

module.exports = api
