let vhome = new Vue({
    el: '#home',
    data: {
        home: true
    }
});

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: ['CPU %', 'MEMORY %', 'TEMP °C'],
        datasets: [{
            label: 'System view',
            data: [[50, 0], [50, 0], [10, 0], 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: [
                'rgba(0, 255, 0, 0.5)',
                'rgba(0, 255, 0, 0.5)',
                'rgba(0, 255, 0, 0.5)'
            ],
            borderColor: [
                'rgba(0, 255, 0, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(0, 255, 0, 1)'
            ],
            borderWidth: 1
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