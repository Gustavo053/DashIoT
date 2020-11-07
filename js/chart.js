const Chart = require('chart.js');

let ctx = document.getElementById('myChart');

let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['0', '1', '2', '3', '4', '5'],
        datasets: [{
            label: 'Reading graph',
            data: [253, 973, 125, 0, 1023, 127],
            borderWidth: 5,
            borderColor: '#AF6FC6',
            backgroundColor: 'transparent'
        }]
    },

    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});