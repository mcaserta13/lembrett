const { app, BrowserWindow, ipcMain } = require('electron')
var path = require('path')
var shell = require('electron').shell
const notifier = require('node-notifier');

var mainWindow

function createWindow() {

    // Criar o componente da tela
    mainWindow = new BrowserWindow({ width: 350, height: 550, resizable: true, icon: path.join(__dirname, 'app/icon/reminder.ico') })

   // mainWindow.setMenu(null)

    // Carregar o arquivo index.html
    mainWindow.loadFile('index.html')
}

app.on('ready', createWindow)

// Abrir a URL do Git
ipcMain.on('btnOpenGit', function (event, arg) {
    event.preventDefault()
    shell.openExternal(arg)
})

// Novo lembrete
ipcMain.on('btnNewReminder', function (event, arg) {
    mainWindow.loadURL(`file://${__dirname}/app/html/new-reminder.html`)
})

// Meus lembretes
ipcMain.on('btnMyReminders', function (event, arg) {
})

// Criar novo lembrete
ipcMain.on('btnCreate', function (event, arg) {
})

// Cancelar
ipcMain.on('btnCancel', function (event, arg) {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
})

// Notificar o SO
/*
    notifier.notify({
    title: 'My notification',
    message: 'Hello, there!'
  });
*/