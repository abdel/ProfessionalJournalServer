const azureAuth = require('azure-mobile-apps/src/auth')

module.exports = (req, res, next) => {
  const context = req.azureMobile

  // Allow non-authenticated URLs
  if (req.url === '/api/author') {
    next()
    return
  }

  // Validate auth config
  if (context.configuration &&
      context.configuration.auth &&
      Object.keys(context.configuration.auth).length === 0
  ) {
    res.status(200).send({ error: 'Failed to authenticate token.' })
    return
  }

  // Authenticate tokens
  const authUtils = azureAuth(context.configuration.auth)

  const token = req.get('x-zumo-auth')
  if (token) {
    req.azureMobile = req.azureMobile || {}
    req.azureMobile.auth = authUtils

    if (context.configuration.auth.validateTokens !== false) {
      authUtils.validate(token)
        .then(function (user) {
          req.azureMobile.user = user
          next()
        })
        .catch(function (error) {
          res.status(401).send(error)
        })
    } else {
      try {
        req.azureMobile.user = authUtils.decode(token)
        next()
      } catch (error) {
        res.status(401).send(error)
      }
    }
  }

  // Fallback
  res.status(200).send({ error: `Uanuthorised access: ${req.url}` })
}
