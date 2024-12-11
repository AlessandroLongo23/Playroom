const canvas0 = document.getElementById('chart0');
const ctx0 = canvas0.getContext('2d');
let chart0;

function create_chart() {
    labels0 = players[0].points.map((_, index) => `${index + 1}`);

    datasets = [];
    for (let i = 0; i < players.length; i++)
        datasets.push({
            label: players[i].name,
            data: players[i].points,
            borderColor: players[i].color,
            backgroundColor: players[i].color,
            // tension: .4,
            animation: false,
            pointRadius: 2,
        });

    chart0 = new Chart(ctx0, {
        type: 'line',
        data: {
            labels: labels0,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Round'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            }
        }
    });
}

function update_chart() {
    sorted_players = [...players].sort((a, b) => (b.points[b.points.length - 1] || 0) - (a.points[a.points.length - 1] || 0));
    labels0 = sorted_players[0].points.map((_, index) => `${index + 1}`);

    for (let i = 0; i < sorted_players.length; i++) {
        chart0.data.datasets[i].data = sorted_players[i].points;
        chart0.data.datasets[i].label = sorted_players[i].name;
        chart0.data.datasets[i].borderColor = sorted_players[i].color;
        chart0.data.datasets[i].backgroundColor = sorted_players[i].color;
    }

    chart0.data.labels = labels0;
    chart0.update();
}
