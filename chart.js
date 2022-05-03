
export const buildChart = () => {
    const ctx = document.getElementById('myChart');
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Hz',
                fill: true,
                data: [
                    {
                        x: 10,
                        y: 8
                    },
                    {
                        x: 134,
                        y: -1
                    },
                    {
                        x: 2000,
                        y: -2
                    },
                ],
                backgroundColor: [
                    'rgba(99, 170, 180, 0.2)',
                ],
                borderColor: [
                    'rgba(99, 170, 180, 1)',
                ],
                borderWidth: 1,
                showLine: true,
                pointRadius: 5,
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0.4,
                }
            },
            scales: {
                y: {
                    beginatzero: true,
                    suggestedmin: -10,
                    ticks: {
                        callback: (val, index, ticks) => {
                            return `${val} db`
                        }
                    },
                    suggestedmax: 10,
                    grid: {
                        display: true,
                        color: "rgba(255, 255, 255, 0.2)",
                    },
                },
                x: {
                    grid: {
                        display: true,
                        color: "rgba(255, 255, 255, 0.1)",
                    }
                }
            }
        }
    });
}

export const addData = (chart, data) => {
    chart.data.datasets[0].data = data;
    //chart.update();
}
