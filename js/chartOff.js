const Chart = require('chart.js');
const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

const ctx = document.getElementById('myChart');

let readValueMax = 0;

ipcRenderer.on('plot-data', (event, data) => {
    if (data == 'analog') {
        readValueMax = 1023;
    } else if (data == 'digital') {
        readValueMax = 1;
    }
});


const datas = fs.readFileSync(path.join(__dirname, '../backend/database/datas.csv'));
const processedData = datas.toString();
const dataArray = processedData.split('\n');

const timesTamp = fs.readFileSync(path.join(__dirname, '../backend/database/timestamp.csv'));
const processedTimesTamp = timesTamp.toString();
const labelsArray = processedTimesTamp.split('\n');

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labelsArray,
        datasets: [{
            label: 'Reading graph off',
            data: dataArray,
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