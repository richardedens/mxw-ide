/*global require */
moonlightui().onready(function() {

    // A model used to define the current project.
    moonlightui().module('core').model('projectModel', function() {

        return {
            projectPath : ''
        }

    });

    // Set menu.
    const {remote} = require('electron');
    const {fs} = require('fs');
    const {Menu} = remote;

    const {path} = require('path');

    // Reload on F5
    document.addEventListener("keydown", function (e) {
        if (e.which === 116) {
            location.reload();
        }
    });

    const menu = Menu.buildFromTemplate([
        {
            label: 'MOONLIGHTUI',
            submenu: [
                {
                    label: 'Development tools',
                    click: function() {
                        var win = remote.getCurrentWindow();
                        win.openDevTools();
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    // Set interface
    moonlightui().energize('.moonlightui');

    // Close the application
    moonlightui('.main-app .moonlightui-modal-close').on('click', function() {
        var win = remote.getCurrentWindow();
        win.close();
        nodeRequire('electron').quit();
    });
    // Minify the application
    moonlightui('.main-app .moonlightui-modal-min').on('click', function() {
        var win = remote.getCurrentWindow();
        win.minimize();
    });
    // Maximize the application
    moonlightui('.main-app .moonlightui-modal-max').on('click', function() {
        var win = remote.getCurrentWindow();
        if (!win.isMaximized()) {
            win.maximize();
        } else {
            win.unmaximize();
        }
    });
    // Maximize on doubleclick header
    moonlightui('.main-app.moonlightui-modal-header').on('dblclick', function() {
        var win = remote.getCurrentWindow();
        if (!win.isMaximized()) {
            win.maximize();
        } else {
            win.unmaximize();
        }
    });

});

