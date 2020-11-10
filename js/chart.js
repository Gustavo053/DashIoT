const Chart = require('chart.js');
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

let ctx = document.getElementById('myChart');

let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['none', 'none', 'none', 'reading'],
        datasets: [{
            label: 'Reading graph',
            data: [0, 0, 0, 0],
            borderWidth: 5,
            borderColor: '#AF6FC6',
            backgroundColor: 'transparent'
        }]
    },

    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 1023,
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

//recebe os dados publicados no broker 'data' e renderiza-os no front-end
client.on('message', (topic, message) => {
    let dataPloting = parseInt(message.toString());

    //retira o último elemento do array de dados
    myChart.data.datasets[0].data.pop();

    //adiciona a leitura no final do array de dados
    myChart.data.datasets[0].data.push(dataPloting);

    //atualiza o gráfico
    myChart.update();
});