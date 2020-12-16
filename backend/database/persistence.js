const { ipcMain } = require('electron');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

let client;

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
    } else {
        client.end();
        return
    }

    client.on('message', (topic, message) => {
        fs.appendFileSync(path.join(__dirname, 'datas.csv'), message.toString() + '\n');
    });
});