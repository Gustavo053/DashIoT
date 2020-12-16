const { ipcMain } = require('electron');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

const client = mqtt.connect('mqtt://localhost:1883');

//Se conecta e dá um subscribe no broker 'data'
client.on('connect', () => {
    client.subscribe('data', (err) => {
        if (err) {
            alert('error: ' + err);
        }
    });
});

let i = 0
ipcMain.on('data-persistence', (event, data) => {
    //recebe os dados publicados no broker 'data' e renderiza-os no front-end
    client.on('message', (topic, message) => {
        if (data == 'stop') {
            return;
        } else {
            // fs.appendFileSync(path.join(__dirname, 'datas.csv'), message.toString() + '\n');
            console.log('estou sendo chamado', i++);
        }
    });
});