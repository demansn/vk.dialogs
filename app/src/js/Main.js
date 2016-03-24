'use strict'

let ipc = require("electron").ipcRenderer;
console.log('main loaded');

ipc.send('mainLoaded');