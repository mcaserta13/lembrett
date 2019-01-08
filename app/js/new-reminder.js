const ipcRen = require('electron').ipcRenderer
const btnCreate = document.getElementById('btnCreate')
const btnCancel = document.getElementById('btnCancel')
const inptDate = document.getElementById('inptDate')
const inptTime = document.getElementById('inptTime')
const inptDescription = document.getElementById('inptDescription')
const sltRepeat = document.getElementById('sltRepeat')
const dvDate = document.getElementById('dvDate')

const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, '../../lembrett.sql')
var db = new sqlite3.Database(dbPath)

// Change no select
sltRepeat.addEventListener('change', function(){
    if (this.value === '1') {
        dvDate.style.display = 'none'
    } else {
        dvDate.style.display = 'block'
    }
})

// Clique no botão para criar novo lembrete
btnCreate.addEventListener('click', function () {

    if (isEmpty(inptDescription.value) || isEmpty(inptDescription.value) || (sltRepeat.value === "0" && isEmpty(inptDate.value))) {
        launch_required_toast()
    } else {
        insertNewReminder(inptDescription.value, inptDate.value, inptTime.value, sltRepeat.value)
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
    let stmt = db.prepare('INSERT INTO reminder (description, date_remind, horary_remind, repeat, read) VALUES (?,?,?,?,?)')
    stmt.run(description, date, horary, repeat, 0, function () {
        ipcRen.send('newSchedule', [description, date, horary, repeat, this.lastID])
        listReminders()
        launch_toast()
    })
}

function listReminders() {
    db.each('SELECT * FROM reminder', function (err, row) {
        console.log(row)
    });
}

// Exibir toast
function launch_toast() {
    var x = document.getElementById('toast')
    x.className = 'show';
    setTimeout(function () { x.className = x.className.replace('show', ''); }, 2000);
    setTimeout(function () {
        ipcRen.send('btnCancel')
    }, 2000)
}

// Exibir toast de campos requeridos
function launch_required_toast() {
    var x = document.getElementById('required-toast')
    x.className = 'show';
    setTimeout(function () { x.className = x.className.replace('show', ''); }, 2000);
}
