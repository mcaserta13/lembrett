const ipcRen = require('electron').ipcRenderer
const btnCreate = document.getElementById('btnCreate')
const btnCancel = document.getElementById('btnCancel')

// Clique no botão para criar novo lembrete
btnCreate.addEventListener('click', function() {
    ipcRen.send('btnCreate')
})

// Clique no botão para cencelar
btnCancel.addEventListener('click', function() {
    ipcRen.send('btnCancel')
})