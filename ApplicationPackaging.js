var asar = require('asar');

var src = 'builds/vk-dialogs-win32-x64/';
var dest = 'name.asar';

asar.createPackage(src, dest, function() {
  console.log('done.');
})