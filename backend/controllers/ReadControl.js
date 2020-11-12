const mqtt = require('mqtt');
let readingValues = document.getElementById('values');

const client = mqtt.connect('mqtt://localhost:1883');

//Se conecta e dá um subscribe no broker 'data'
client.on('connect', () => {
    client.subscribe('data', (err) => {
        if (err) {
            alert('error: ' + err);
        }
    });
});

//recebe os dados publicados no broker 'data' e renderiza-os no front-end
client.on('message', (topic, message) => {
    readingValues.innerHTML = message.toString();
});

//A fazer
//Pegar os dados de leitura do front-end enviar para o banco de dados