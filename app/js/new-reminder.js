const ipcRen = require('electron').ipcRenderer
const btnCreate = document.getElementById('btnCreate')
const btnCancel = document.getElementById('btnCancel')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./lembrett.sql');

// Clique no botão para criar novo lembrete
btnCreate.addEventListener('click', function() {
    insertNewReminder("teste", 123)
})

// Clique no botão para cencelar
btnCancel.addEventListener('click', function() {
    ipcRen.send('btnCancel')
})


function insertNewReminder(description, date){
    let stmt = db.prepare("INSERT INTO reminder (description, date_remind) VALUES (?,?)")
    stmt.run(description, date, function(){
        console.log("Novo lembrete criado com sucesso!")
        launch_toast()
    })
}

function listReminders(){
    db.each("SELECT * FROM reminder", function(err, row) {
    });
}

function launch_toast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
    setTimeout(function() {
        ipcRen.send('btnCancel')
    }, 2000)
}