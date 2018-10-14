var sys = require('util');
var exec = require('child_process').exec;

child = exec("mysqldump -uroot --no-data=FALSE dbpictures > dbpictures.sql", function (error, stdout, stderr) {
    if (String(stdout).length > 0)
        console.error('stdout: ' + stdout);

    if (String(stderr).length > 0)
        console.error('stderr: ' + stderr);

    if (error !== null) {
        console.log('exec error: ' + error);
    }
});