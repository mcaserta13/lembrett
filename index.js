const ipcRen = require('electron').ipcRenderer
const btnOpenGit = document.getElementById('btnOpenGit')

// Clique no botão do github
btnOpenGit.addEventListener('click', function() {
    ipcRen.send('btnOpenGit', btnOpenGit.getAttribute('data-href'))
});
