const socket = new WebSocket('ws://localhost:5500');

ready = [];

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.type == 'setup') {
        ready = data.ready_arr;
    } else if (data.type == 'ready') {
        ready = data.ready_arr;
        if (ready.every(client => client))
           start_game(data.players_info);
    } else if (data.type == 'update') {
        grid.fromJSON(data.grid);
        for (let i = 0; i < players.length; i++)
            players[i].fromJSON(data.players[i]);

        current_player_index = data.turn;
    }
});

window.addEventListener('click', event => {
    if (event.target.id == 'ready')
        socket.send(JSON.stringify({ type: 'ready' }));
});

window.addEventListener('keyup', _ => {
    if (!game_over)
        return;

    // socket.send(JSON.stringify({ type: 'name', name: document.getElementById('player_name').value }));
});