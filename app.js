// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// Constants
const port = process.env.PORT || 3000

// Dependencies
const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const azureMobileApps = require('azure-mobile-apps')
const MemoryStore = require('memorystore')(session)

// Set up a standard Express app
const app = express()

// If you are producing a combined Web + Mobile app, then you should handle
// anything like logging, registering middleware, etc. here

// Configuration of the Azure Mobile Apps can be done via an object, the
// environment or an auxiliary file.  For more information, see
// http://azure.github.io/azure-mobile-apps-node/global.html#configuration
const mobileApp = azureMobileApps({
  // Explicitly enable the Azure Mobile Apps home page
  homePage: true,
  // Explicitly enable swagger support. UI support is enabled by
  // installing the swagger-ui npm module.
  swagger: true
})

const checkAuth = (req, res, next) => {
  // Allow public endpoints
  if (
    req.url === '/api/login' ||
    req.url === '/api/register'
  ) {
    next()
    return
  }

  console.log('Session', req.session)

  // Allow authenticated users
  if (req.session && req.session.authenticated && req.session.user) {
    next()
    return
  }

  res.status(401).send({ error: `Uanuthorised access: ${req.url}` })
}

// Import the files from the tables directory to configure the /tables endpoint
mobileApp.tables.import('./tables')

// Import the files from the api directory to configure the /api endpoint
mobileApp.api.import('./api')

// Initialize the database before listening for incoming requests
// The tables.initialize() method does the initialization asynchronously
// and returns a Promise.
mobileApp.tables.initialize()
  .then(function () {
    app.use(session({
      secret: 'vxHNgaBoKYd"OMTc^z4f',
      resave: false,
      saveUninitialized: true,
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h 
      })
    }))
    app.use(morgan('combined'))
    app.use(checkAuth)
    app.use(mobileApp) // Register the Azure Mobile Apps middleware
    app.listen(port) // Listen for requests

    console.log(`Backend API listening on port ${port}`)
  })
