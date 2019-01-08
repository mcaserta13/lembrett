const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, 'lembrett.db')
var db = new sqlite3.Database(dbPath)
 
db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS reminder (id INTEGER PRIMARY KEY, description TEXT, date_remind TEXT, horary_remind TEXT, repeat INT, read INT)')
});
 
db.close();