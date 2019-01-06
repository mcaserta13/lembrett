
const lstReminder = document.getElementById('reminderList')
const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./lembrett.sql');

document.addEventListener('DOMContentLoaded', populateList);

function populateList() {
    console.log("POPULATE LIST")

    try {
        db.each('SELECT * FROM reminder', function (err, row) {
            console.log("ERRO NO SELECT" + err)
            console.log("LINHA" + row)
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
                '<span>x</span>' +
                '</div>' +
                '</div>' +
                '</div>';

            lstReminder.innerHTML += cardContent
        })
    } catch (error) {
        console.log("ERRO ERROSO " + error)
    }

}