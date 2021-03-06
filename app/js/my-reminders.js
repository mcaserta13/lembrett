
const lstReminder = document.getElementById('reminderList')
const btnBack = document.getElementById('btnBack')
const ipcRen = require('electron').ipcRenderer
const sqlite3 = require('sqlite3').verbose();

const app = require('electron').remote.app

const path = require('path')
const dbPath = (process.env.NODE_ENV === 'development') ? './lembrett.db' : path.resolve(app.getPath('userData'), 'lembrett.db');
var db = new sqlite3.Database(dbPath)

document.addEventListener('DOMContentLoaded', populateList);

btnBack.addEventListener('click', function () {
    ipcRen.send('btnCancel')
})

$('body').delegate('.btn-remove', 'click', function () {
    ipcRen.send('removeScheduled', [$(this).attr('data-id')])

    setTimeout(() => {  
        populateList()
    }, 500);
})

function populateList() {
    try {
        lstReminder.innerHTML = ""

        db.each('SELECT * FROM reminder', function (err, row) {
            var cardContent = '<div class="card-content">' +
                '<div class="col-10">';

            if (row.repeat === 0) {
                cardContent += '<div class="card-title">' +
                    row.date_remind +
                    '</div>';
            } else {
                cardContent += '<div class="card-title">' +
                    'Diariamente as ' + row.horary_remind +
                    '</div>';
            }

            cardContent += '<div class="card-body">' +
                row.description +
                '</div>' +
                '</div>' +

                '<div class="card-options col-2">' +
                '<div class="card-remove-btn">' +
                '<span class="btn-remove" data-id="' + row.id + '"' + '>x</span>' +
                '</div>' +
                '</div>' +
                '</div>';

            lstReminder.innerHTML += cardContent
        })

    } catch (error) {
        console.log("Error " + error)
    }

}