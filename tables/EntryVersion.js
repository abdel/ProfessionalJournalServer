var azureMobileApps = require('azure-mobile-apps');

var table = azureMobileApps.table();

// Defines the list of columns
table.columns = {
  "title" "string",
  "location": "string",
  "hidden": "boolean",
  "deleted": "boolean",
  "entry_version_id": "string",
  "journal_id": "string"
};

// Turns off dynamic schema
table.dynamicSchema = false;

module.exports = table;
