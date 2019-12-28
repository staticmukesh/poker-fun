var ctx = document.getElementById('canvas').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Object.keys(data.points),
        datasets: [{
            fill: false,
            label: 'Profit/Loss',
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)',
            data:  Object.values(data.points),
        }]
    },
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Games'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Bets (in SGD)'
                }
            }]
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                title: function(){
                    return ''
                },
                label: function(item) {
                    if (item.yLabel >= 0) {
                        return "Profit: $" + item.yLabel
                    } else {
                        return "Loss: $" + item.yLabel
                    }
                }
            }
        },
        animation: {
            duration: 2000,
        }
    }
});
