const Chart = require('chart.js');
const mqtt = require('mqtt');
const { ipcRenderer } = require('electron');

let readValueMax = 0;

const client = mqtt.connect('mqtt://localhost:1883');

let ctx = document.getElementById('myChart');

//recebe qual foi a escolha do usuário para renderizar o gráfico corretamente
ipcRenderer.on('plot-data', (event, data) => {
    console.log(data);
    if (data == 'analog') {
        readValueMax = 1023;
    } else if (data == 'digital') {
        readValueMax = 1;
    }
});

//Cria um novo gráfico com valores zerados
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Reading graph',
            data: [],
            borderWidth: 1,
            borderColor: '#5586B2',
            backgroundColor: 'transparent'
        }]
    },

    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    suggestedMax: readValueMax,
                    suggestedMin: 0
                }
            }]
        }
    }
});

//Se conecta e dá um subscribe no broker 'data'
client.on('connect', () => {
    client.subscribe('data', (err) => {
        if (err) {
            alert('error: ' + err);
        }
    });
});

//recebe os dados publicados no broker 'data' e vai plotando no gráfico
client.on('message', (topic, message) => {
    let dataPloting = parseInt(message.toString());

    //retira o último elemento do array de dados
    myChart.data.labels.push('reading');

    //adiciona a leitura no final do array de dados
    myChart.data.datasets[0].data.push(dataPloting);

    //atualiza o gráfico
    myChart.update();

    //remove os primeiros índices do gráfico
    //para não travar a renderização do gráfico devido ao limite alto de dados
    setTimeout(() => {
        myChart.data.labels.shift();
        myChart.data.datasets[0].data.shift();
    }, 5000);
});