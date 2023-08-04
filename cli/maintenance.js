import fs from 'fs';
import { fileURLToPath } from 'url';
import path ,{ dirname}  from 'path';
import * as url from 'url';
import { exit } from 'process';
import { systemCurrentState } from '../helpers/filehelper.js';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));
const __dirnames = url.fileURLToPath(new URL('.', import.meta.url));
const mainttence = {
    maintenance: true,
    date:Date.now()
};
const fileName = 'maintenance.json';
export const filePath = `${__dirname}/${fileName}`;
if (process.argv.includes('down')) {
    down();
}

if (process.argv.includes('up')) {
    up();
}

if (process.argv.includes('read')) {
    read();
}
 
function down() {
    fs.writeFile(fileName, JSON.stringify(mainttence), (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('\x1b[41m', 'System is down', '\x1b[0m');
    });
}

function up() {
    const mainttence = {
        maintenance: false,
        date:Date.now()
    };
    // fs.stat(`${__dirname}/${fileName}`, function (err, stats) {
    //     console.log(err);//here we got all information of file in stats variable
     
    //     if (err) {
    //         if (err.code == 'ENOENT') {
    //             console.log('Already Up!!',stats);
    //             exit(0);
    //         }
    //     }
    // fs.unlink(filePath, function (err) {
    //     if (err) {
    //         if (err.code == 'ENOENT') {
    //             console.log('\x1b[32m', 'Already Up', '\x1b[0m');
    //             exit(0);
    //         }
    //     };
    //     console.log('\x1b[32m', 'System is Up and running', '\x1b[0m')
    // });
    fs.writeFile(fileName, JSON.stringify(mainttence), (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('\x1b[32m', 'System is Up and running', '\x1b[0m')
    });
// });

}

function read() {
    systemCurrentState(fs, filePath, function (data) {
        console.log(data)
    });
}