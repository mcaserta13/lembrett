const { app, BrowserWindow, ipcMain } = require('electron')
var path = require('path')
var shell = require('electron').shell;

function createWindow() {
    // Criar o componente da tela
    mainWindow = new BrowserWindow({ width: 300, height: 500, resizable: false, icon: path.join(__dirname, 'app/icon/reminder.ico') })

    mainWindow.setMenu(null)

    // Carregar o arquivo index.html
    mainWindow.loadFile('index.html')
}

app.on('ready', createWindow)

// Encerrar a aplicação
ipcMain.on('btnCloseTapped', function (event, arg) {
    app.quit()
});

ipcMain.on('btnOpenGit', function (event, arg) {
    event.preventDefault();
    shell.openExternal(arg);
});