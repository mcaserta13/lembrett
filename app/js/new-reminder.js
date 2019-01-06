const ipcRen = require('electron').ipcRenderer
const btnCreate = document.getElementById('btnCreate')
const btnCancel = document.getElementById('btnCancel')
const inptDate = document.getElementById('inptDate')
const inptTime = document.getElementById('inptTime')
const inptDescription = document.getElementById('inptDescription')

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./lembrett.sql');

// Clique no botão para criar novo lembrete
btnCreate.addEventListener('click', function () {

    if (isEmpty(inptDescription.value) || isEmpty(inptDate.value) || isEmpty(inptDescription.value)) {
        launch_required_toast()
    } else {
        insertNewReminder(inptDescription.value, inptDate.value, inptTime.value, 0)
    }
})

function isEmpty(str) {
    return !str.replace(/\s+/, '').length;
}

// Clique no botão para cencelar
btnCancel.addEventListener('click', function () {
    ipcRen.send('btnCancel')
})

// Inserir novo lembrete no banco de dados
function insertNewReminder(description, date, horary, repeat) {
    let stmt = db.prepare("INSERT INTO reminder (description, date_remind, horary_remind, repeat, read) VALUES (?,?,?,?,?)")
    stmt.run(description, date, horary, repeat, 0, function () {
        ipcRen.send('newSchedule', [description, date, horary, repeat])
        listReminders()
        launch_toast()
    })
}

function listReminders() {
    console.log("LIST REMINDER");
    db.each("SELECT * FROM reminder", function (err, row) {
        console.log(err);
        console.log(row)
    });
}

// Exibir toast
function launch_toast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
    setTimeout(function () {
        ipcRen.send('btnCancel')
    }, 2000)
}

// Exibir toast de campos requeridos
function launch_required_toast() {
    var x = document.getElementById("required-toast")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
}
