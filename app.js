// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// Constants
const port = process.env.PORT || 3000

// Dependencies
const morgan = require('morgan')
const express = require('express')
const azureMobileApps = require('azure-mobile-apps')

// Middlewares
const auth = require('./middlewares/auth')

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

// Import the files from the tables directory to configure the /tables endpoint
mobileApp.tables.import('./tables')

// Import the files from the api directory to configure the /api endpoint
mobileApp.api.import('./api')

// Initialize the database before listening for incoming requests
// The tables.initialize() method does the initialization asynchronously
// and returns a Promise.
mobileApp.tables.initialize()
  .then(function () {
    app.use(auth) // Authentication middleware
    app.use(morgan('combined')) // Log requests
    app.use(mobileApp) // Register the Azure Mobile Apps middleware
    app.listen(port) // Listen for requests

    console.log(`Backend API listening on port ${port}`)
  })
