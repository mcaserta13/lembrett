const { app, BrowserWindow, ipcMain, Menu } = require('electron')
var path = require('path')
var shell = require('electron').shell
const scheduler = require('node-schedule')
const notifier = require('node-notifier')
const sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database('./lembrett.sql')

var mainWindow

function createWindow() {

    // Criar o componente da tela
    mainWindow = new BrowserWindow({ width: 350, height: 620, resizable: false, icon: path.join(__dirname, 'app/icon/reminder.png')})

    var template = []
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    mainWindow.setMenu(null)
    
    // Verificar se a tabela já existe
    tableExists(function(exists) {
        if (exists) {
            // Limpar todos lembretes antigos que não repetem
            cleanOldReminders()

            // Criar as tarefas scheduladas salvas no banco de dados
            createSchedules()
        }
    })

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
    mainWindow.loadURL(`file://${__dirname}/app/html/my-reminders.html`)
})

// Criar novo lembrete
ipcMain.on('btnCreate', function (event, arg) {
})

// Cancelar
ipcMain.on('btnCancel', function (event, arg) {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
})

// Novo lembrete schedulado
ipcMain.on('newSchedule', function (event, arg) {
    scheduleNotification(arg[0], arg[1], arg[2], arg[3], arg[4])
})

// Remover scheduled
ipcMain.on('removeScheduled', function(event, arg) {
    removeScheduled(arg[0])
})

// Schedular a notificação no SO
async function scheduleNotification(description, date, horary, repeat, notificationId) {
    if (repeat <= 0) {
        var scheduledDate = new Date(date + ' ' + horary)
        console.log('Lembrete schedulado em : ' + scheduledDate)
        scheduler.scheduleJob(scheduledDate, function () {
            notify(description, notificationId)
        })
    } else {
        var splittedHorary = horary.split(':')
        scheduler.scheduleJob(splittedHorary[1] + ' ' + splittedHorary[0] + ' * * *', function () {
            notify(description, 0)
        })
    }
}

// Notificar o SO
async function notify(description, id) {
    // Notificar o SO
    notifier.notify({
        title: 'Chegou a hora!',
        message: description,
        priority: 2,
        icon: './app/icon/reminder.png'
    })

    if (id > 0) {
        // Remover o lembrete
        removeScheduled(id)
    }
}

// Criar as notificações scheduladas de acordo com o banco de dados
async function createSchedules() {
    try {
        db.each('SELECT * FROM reminder', function (err, row) {
            var id = row.id
            var description = row.description
            var date = row.date_remind
            var horary = row.horary_remind
            var repeat = row.repeat

            if (repeat <= 0) {
                var scheduledDate = new Date(date + ' ' + horary)
                console.log('Lembrete schedulado em : ' + scheduledDate)
                scheduler.scheduleJob(scheduledDate, function () {
                    notify(description, id)
                })
            } else {
                var splittedHorary = horary.split(':')
                console.log("Lembrete schedulado diariamente as " + horary)
                scheduler.scheduleJob(splittedHorary[1] + ' ' + splittedHorary[0] + ' * * *', function () {
                    notify(description, 0)
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// Remover um lembrete do banco de dados de acordo com o id
async function removeScheduled(id) {
    let stmt = db.prepare('DELETE FROM reminder WHERE id = ?')
    stmt.run(id, function () {
        console.log("Lembrete de código #" + id + " removido!")
    })
}

// Remover lembretes antigos
function cleanOldReminders() {
    try {
        let stmt = db.prepare("DELETE FROM reminder WHERE repeat = 0 AND (date('now') > date(date_remind) AND time('now', '-2 hours') > time(horary_remind)) OR (date('now') = date(date_remind) AND time('now', '-2 hours') > time(horary_remind))")
        stmt.run(function (e, row) {
            console.log("Lembretes antigos removidos com sucesso!")
        })
    } catch (error) {
        console.log(error)
    }

}

// Verificar se a tabela existe no banco de dados
tableExists = function (callback){
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='reminder'", function (err, row) {
        if (err != null || row === undefined) {
            callback(false)
        } else {
            callback(true)
        }
    })
}