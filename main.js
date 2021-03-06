// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url');
const fs = require('fs')
const io = require('socket.io-client')
let socket
var exec = require('child_process').exec
const { FaBullseye } = require('react-icons/fa')
// const exec = require('child_process').exec
let cartState
let browserWindow
function createWindow() {
  // Create the browser window.
 var mainWindow = new BrowserWindow({
    title: 'JaCart Monitor',
    width: 600,
    height: 565,
    darkTheme: true,
    minWidth: 550,
    maxHeight: 685,
    minHeight: 565,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  })
  mainWindow.setMenuBarVisibility(false)
  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3002')

  browserWindow = mainWindow
  
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('start-all-servers', (ev, arg) => {
  console.log(arg)
  run_sh_start(arg.ros)
  start_local_server(arg.local_path)
  start_ui_server(arg.ui_path)
})

ipcMain.on('local-server-restart', (ev, arg) => {
  start_local_server(arg)
})
ipcMain.on('local-server-stop', (ev, arg) => {
  stop_local_server(arg)
})
ipcMain.on('ui-server-restart', (ev, arg) => {
  start_ui_server(arg)
})
ipcMain.on('ui-server-stop', (ev, arg) => {
  stop_ui_server(arg)
})
ipcMain.on('pullover', (ev, arg) => {
  console.log('trigger pullover: ' + arg)
  pullover(arg)
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function start_local_server (arg) {
  console.log('Starting Local Server.')
  child = exec('./scripts/local-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
    console.log('Error: ' + error)
    console.log('Stderr: ' + stderr)
  })
  localServerStarted = true
  socket = io('http://localhost:8021/ui')
  console.log('LOCAL SERVER STARTED')
  startFileListener(arg.path)
}
function run_sh_start(arg) {
  console.log('Starting run.sh')
  var flags = "";
  if (arg.param) {
    flags = "-p";
  }
  var cmd = './scripts/ros-start.sh \'' + arg.path + '\' \'' + flags+ '\''
  console.log(cmd)
  child = exec(cmd, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
    console.log('Error: ' + error)
    console.log('Stderr: ' + stderr)
  })
}
function start_ui_server(arg) {
  console.log('Starting UI Server.')
  child = exec('./scripts/ui-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
    console.log('Error: ' + error)
    console.log('Stderr: ' + stderr)
  })
}
function stop_local_server(arg) {
  console.log('Stopping Local Server.')
  child = exec('./scripts/local-server-stop.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
}
function stop_ui_server(arg) {
  console.log('Stopping UI Server.')
  child = exec('./scripts/ui-server-stop.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
}

function readFile(path) {
  console.log('reading from: ' + path)
  cartState = JSON.parse(fs.readFileSync(path + '/cart.json', 'utf-8'))
}

ipcMain.on('save-and-restart', (ev, arg) => {
    readFile(arg.path)
    cartState.destination = arg.destination
    cartState.state = arg.state
    console.log('Set Destination to ' + arg.destination)
    console.log('Set State to ' + arg.state)
    writeFile(arg.path)
    child = exec('./scripts/restart-server.sh', function (error, stdout, stderr) {
      console.log('Server Restarted')
    })
})

function pullover(state) {
  console.log('pullover socket')
  if (localServerStarted) {
    socket.emit('pullover', state)
  } 
}

function writeFile(path) {
  fs.writeFileSync(path + '/cart.json', JSON.stringify(cartState))
}

function startFileListener(path) {
  console.log('File Listener started on path: ' + path)
  fs.watchFile(path + '/cart.json', (curr, prev) => {
    console.log("WATCH CHANGE");
    readFile(path)
    console.log('new state: ' + cartState.pullover)
    browserWindow.webContents.send('state-change', cartState);
  });
}
