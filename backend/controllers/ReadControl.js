// const { ipcRenderer } = require('electron');
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    client.subscribe('data', (err) => {
        if (err) {
            alert('error: ' + err);
        }
    });
});

client.on('message', (topic, message) => {
    console.log(message.toString());
});

//A fazer
//Pegar os dados de leitura do front-end enviar para o banco de dados