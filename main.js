// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')
var exec = require('child_process').exec
// const exec = require('child_process').exec
let cartState

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

var child 
ipcMain.on('start-all-servers', (ev, arg) => {
  console.log(arg)
  run_sh_start({path: arg.ros_path})
  start_local_server(arg.local_path)
  start_ui_server(arg.ui_path)
  start_pose_server(arg.pose_path)
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
ipcMain.on('pose-server-restart', (ev, arg) => {
  start_pose_server(arg)
})
ipcMain.on('pose-server-stop', (ev, arg) => {
  stop_pose_server(arg)
  
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
}
function run_sh_start(arg) {
  console.log('Starting run.sh')
  child = exec('./scripts/ros-start.sh \'' + arg.path + '\'', function (error, stdout, stderr) {
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
function start_pose_server(arg) {
  console.log('Starting Pose Server.')
  child = exec('./scripts/pose-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
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
function stop_pose_server(arg) {
  console.log('Stopping Pose Server')
  child = exec('./scripts/pose-server-stop.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
}

function readFile(path) {
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

function writeFile(path) {
  fs.writeFileSync(path + '/cart.json', JSON.stringify(cartState))
}