alert('If you find this website helpful, please consider donation.')

var ctx = document.getElementById('canvas').getContext('2d');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(data.points),
        datasets: [{
            label: 'Profit',
            backgroundColor: function(context) {
                var index = context.dataIndex;
                var value = context.dataset.data[index];
                console.log(value)
                return value >= 0 ? 'rgb(54, 162, 235)' : 'rgb(255, 99, 132)';
            },
            data:  Object.values(data.points),
        }, {
            type: 'line',
            fill: 'false',
            label: 'Loss',
            borderWidth: 1,
            borderColor: 'rgb(75, 192, 192)',
            pointRadius: 0,
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
