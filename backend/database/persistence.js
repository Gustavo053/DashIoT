const { ipcMain } = require('electron');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

let client;
let flagControl = false;

let start;
let end;
ipcMain.on('data-persistence', (event, data) => {
    console.log(data);

    if (data == 'start') {
        client = mqtt.connect('mqtt://localhost:1883');

        //Se conecta e dá um subscribe no broker 'data'
        client.on('connect', () => {
            client.subscribe('data', (err) => {
                if (err) {
                    alert('error: ' + err);
                }
            });
        });
        flagControl = true;
    } else {
        client.end();
        return
    }
    client.on('message', (topic, message) => {
        start = performance.now();
        if (flagControl) {
            const date = new Date();

            const recordExecution = fs.readFileSync(path.join(__dirname, 'cache.csv'));
            const arrayRecordExecution = recordExecution.toString().split(',');

            if (arrayRecordExecution[0] == 'Date') {
                console.log(arrayRecordExecution);
                fs.appendFileSync(path.join(__dirname, 'cache.csv'), date.getDay() + '-' + date.getFullYear() + ',' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '\n');
            } else {
                console.log(arrayRecordExecution);
                fs.appendFileSync(path.join(__dirname, 'cache.csv'), 'Date,Hours' + '\n' + date.getDay() + '-' + date.getFullYear() + ',' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '\n');
            }

            flagControl = false;
        }
        fs.appendFileSync(path.join(__dirname, 'datas.csv'), message.toString() + '\n');
        end = performance.now() - start;
        fs.appendFileSync(path.join(__dirname, 'timestamp.csv'), end.toFixed(2) + '\n');
    });
});

ipcMain.on('clear-file', (event, data) => {
    if (data == 'datas.csv') {
        fs.writeFileSync(path.join(__dirname, 'datas.csv'), '');
        fs.writeFileSync(path.join(__dirname, 'timestamp.csv'), '');
    } else if (data == 'cache.csv') {
        fs.writeFileSync(path.join(__dirname, 'cache.csv'), '');
    }
});