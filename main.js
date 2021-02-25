// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
var exec = require('child_process').exec
// const exec = require('child_process').exec

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
  child = exec(arg.path + '/run.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
  child = exec('./scripts/local-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
  child = exec('./scripts/ui-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
  child = exec('./scripts/pose-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})

ipcMain.on('local-server-restart', (ev, arg) => {
  console.log(arg)
  child = exec('./scripts/local-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})
ipcMain.on('local-server-stop', (ev, arg) => {
  console.log(arg)
  child = exec('./scripts/local-server-stop.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})
ipcMain.on('ui-server-restart', (ev, arg) => {
  console.log(arg)
  child = exec('./scripts/ui-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})
ipcMain.on('ui-server-stop', (ev, arg) => {
  console.log(arg)
  child = exec('./scripts/ui-server-stop.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})
ipcMain.on('pose-server-restart', (ev, arg) => {
  console.log(arg)
  child = exec('./scripts/pose-server-start.sh \'' + arg.path + '\' ' + arg.port, function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})
ipcMain.on('pose-server-stop', (ev, arg) => {
  console.log(arg)
  child = exec('./scripts/pose-server-stop.sh', function (error, stdout, stderr) {
    console.log('Output: ' + stdout)
  })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
