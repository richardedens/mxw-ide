'use strict';
const electron = require('electron');

/**
 * Express JS Server
 */
const express = require('express');
const expressApp = express();
var server = false;

exports.restartServer = function(path, cb) {
	if (server !== false) {
		server.close();
	}
    
    // Add headers
    expressApp.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', false);

        // Pass to next layer of middleware
        next();
    });
    
    expressApp.use(express.static(path));
    server = expressApp.listen(3001, function () {
        console.log('Example app listening on port 3001!');
        cb();
    });
};

/**
 * Dialogs
 */

// Open directory dialog
const dialog = electron.dialog
exports.selectDirectory = function(cb) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }, cb)
};

/**
 * Main Process
 */
const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({showDevTools: true});

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		frame: false
	});

	win.loadURL(`file://${__dirname}/main.html`);
	win.on('closed', onClosed);
	win.webContents.on('did-finish-load', function() {
		win.show();
		win.maximize();
	});

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
