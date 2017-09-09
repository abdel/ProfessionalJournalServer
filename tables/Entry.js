var azureMobileApps = require('azure-mobile-apps');

var table = azureMobileApps.table();

// Defines the list of columns
table.columns = {
  "text_entry": "string",
  "attachment": "string",
  "modify_reason": "string",
  "version_track_id": "string",
  "entry_id": "string"
};

// Turns off dynamic schema
table.dynamicSchema = false;

module.exports = table;
