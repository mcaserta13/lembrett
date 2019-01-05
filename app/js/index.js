const ipcRen = require('electron').ipcRenderer
const btnOpenGit = document.getElementById('btnOpenGit')
const btnNewReminder = document.getElementById('btnNewReminder')
const btnMyReminders = document.getElementById('btnMyReminders')

// Clique no botão do github
btnOpenGit.addEventListener('click', function() {
    ipcRen.send('btnOpenGit', btnOpenGit.getAttribute('data-href'))
})

// Clique no botão novo lembrete
btnNewReminder.addEventListener('click', function() {
    ipcRen.send('btnNewReminder')
})

// Clique no botão meus lembretes
btnMyReminders.addEventListener('click', function() {
    ipcRen.send('btnMyReminders')
})
