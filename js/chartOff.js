const Chart = require('chart.js');
const path = require('path');
const fs = require('fs');

const ctx = document.getElementById('myChart');

const datas = fs.readFileSync(path.join(__dirname, '../backend/database/datas.csv'));
const processedData = datas.toString();
const dataArray = processedData.split('\n');

let labelsArray = [];

let i = 0;
while (i < dataArray.length) {
    labelsArray[i] = i;
    i++;
}

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
                    suggestedMax: 1023,
                    suggestedMin: 0
                }
            }]
        }
    }

});