var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./lembrett.sql');
 
db.serialize(function() {
  db.run("CREATE TABLE reminder (id PRIMARY KEY, description TEXT, date_remind TEXT, repeat INT)")
});
 
db.close();