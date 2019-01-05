const { app, BrowserWindow, ipcRenderer } = require('electron')

function createWindow() {
    // Criar o componente da tela
    mainWindow = new BrowserWindow({ width: 300, height: 500, resizable: false, frame: false, transparent: true })

    // Carregar o arquivo index.html
    mainWindow.loadFile('index.html')
}

app.on('ready', createWindow)

ipcRenderer.on('close-main-window', function () {
    app.quit();
});