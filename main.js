const { app, BrowserWindow, ipcMain } = require('electron')
var path = require('path')
var shell = require('electron').shell
const scheduler = require("node-schedule");
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

// Novo lembrete schedulado
ipcMain.on('newSchedule', function(event, arg) {
    console.log("RECEBIDO NO NEW SCHEDULE")
    scheduleNotification(arg[0], arg[1], arg[2], arg[3])
})

// Schedular a notificação no SO
async function scheduleNotification(description, date, horary, repeat) {
    if (repeat <= 0) {
        var scheduledDate = new Date(date + " " + horary)

        console.log("DATA SCHEDULADA " + scheduledDate)
        scheduler.scheduleJob(scheduledDate, function () {
            console.log("CHEGOU A HORA")
            notify(description)
        });
    }
}

// Notificar o SO
async function notify(description) {
    // Notificar o SO
    notifier.notify({
        title: 'Chegou a hora! - lembrett -',
        message: description,
        priority: 2,
        icon: './app/icon/reminder.ico'
    });
}