const { screen } = require("electron");
const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const url = require("url");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(Infinity);

const path = require("path");
const io = require("socket.io-client");
require("events").EventEmitter.defaultMaxListeners = Infinity;
let socket = io.connect("http://103.154.233.201:3001");
const { exec } = require("child_process");
process.env.NODE_ENV = "development";
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new BrowserWindow({
        width: width,
        height: height,
        icon: './src/favicon.ico',
        frame: false,
        resizable: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            backgroundThrottling: false,
            contextIsolation: false,
            devTools: true,
            webSecurity: false
        },
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        app.quit();
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.disableHardwareAcceleration();
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

socket.on("connect", function () {
    console.log("connected");
});

ipcMain.on("authenticate", function (e, userData) {
    socket.emit("authenticate", userData);
});

socket.on('authResponce', function (result) {
    win.webContents.send('authResponse', result);
})

ipcMain.on("getLastWin", function (e, userId) {
    socket.emit("userData", userId);
});

socket.on("lastWinData", function (data) {
    win.webContents.send("lastWinner", data);
});

ipcMain.on('getTime', function () {
    getTime();
})

function getTime() {
    socket.on("timer", function (data) {
        win.webContents.send("timer", data);
    })
}

ipcMain.on('getWinners', function () {
    getWinners();
})

function getWinners() {
    socket.on("showWinners", function (data) {
        win.webContents.send("winners", data);
    })
}

ipcMain.on('logout', function () {
    win.close();
})