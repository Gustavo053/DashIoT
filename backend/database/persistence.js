const { ipcMain } = require('electron');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

let client;
let flagControl = false;

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
        if (flagControl) {
            const date = new Date();

            const recordExecution = fs.readFileSync(path.join(__dirname, 'execution.csv'));
            const arrayRecordExecution = recordExecution.toString().split(',');

            if (arrayRecordExecution[0] == 'Date') {
                console.log(arrayRecordExecution);
                fs.appendFileSync(path.join(__dirname, 'execution.csv'), date.getDay() + '-' + date.getFullYear() + ',' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '\n');
            } else {
                console.log(arrayRecordExecution);
                fs.appendFileSync(path.join(__dirname, 'execution.csv'), 'Date, Hours' + '\n' + date.getDay() + '-' + date.getFullYear() + ',' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '\n');
            }

            flagControl = false;
        }
        fs.appendFileSync(path.join(__dirname, 'datas.csv'), message.toString() + '\n');
    });
});