const ipc = require('electron')

var btnClose = document.querySelector("#btnClose")

btnClose.addEventListener('click', btnClose)

function btnClose() {
    ipc.send('close-main-window')
}