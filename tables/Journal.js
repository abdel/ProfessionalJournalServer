var azureMobileApps = require('azure-mobile-apps');

var table = azureMobileApps.table();

// Defines the list of columns
table.columns = {
  "title": "string",
  "author_id": "string",
  "description": "string"
};

// Turns off dynamic schema
table.dynamicSchema = false;

module.exports = table;
