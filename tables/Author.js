const azureMobileApps = require('azure-mobile-apps')

const table = azureMobileApps.table()

// Defines the list of columns
table.columns = {
  'username': 'string',
  'password': 'string',
  'first_name': 'string',
  'last_name': 'string',
  'email': 'string',
  'date_of_birth': 'date'
}

// Turns off dynamic schema
table.dynamicSchema = false

module.exports = table
