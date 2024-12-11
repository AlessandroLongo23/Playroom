function preload() {
    quirkle_title = loadImage('Asset/quirkle.png');
}

function setup() {
    console.clear();
    createCanvas(windowWidth, windowHeight);

    grid = new Grid();
    grid.initialize();

    combinations = matrix(6, 6);
    setup_combination_matrix();
    num_copies = 3
    turn_duration = 120; 

    tiles = [];
    for (let i = 0; i < num_copies; i++)
        for (let j = 0; j < 6; j++)
            for (let k = 0; k < 6; k++)
                tiles.push(new Tile(j, k));

    tiles = shuffle(tiles);

    game_over = false;
    colors = [
        color(231, 47, 45),
        color(255, 128, 0),
        color(253, 220, 1),
        color(0, 159, 77),
        color(0, 126, 195),
        color(124, 101, 173)
    ]

    my_name = '';
    players = [];
    num_players = 4;
    computer_players_info = [
        {
            name: '',
            color: 'blue',
        },
        {
            name: 'Thilo',
            color: 'green',
        },
        {
            name: 'Apo',
            color: 'red',
        },
        {
            name: 'Douglas',
            color: 'orange',
        }
    ]

    current_player_index = -1;
    game_over = true;
}

function start_game(players_info) {
    console.log(players_info)
    document.getElementById('player_name').remove();
    place_btn = document.createElement('button')
    place_btn.id = 'place';
    place_btn.innerHTML = 'Place';
    place_btn.onclick = function() {
        if (game_over || my_name != players[current_player_index].name)
            return;

        next_player();
    };
    document.body.appendChild(place_btn);

    game_over = false;
    for (let i = 0; i < players_info.length; i++)
        players.push(new Player(i, players_info[i].name, players_info[i].color, players_info[i].computer));

    let i = 0;
    let tile;
    while (tiles.length > 0) {
        tile = tiles.pop();
        tile.pos = players[i].stack_pos.copy();
        players[i].tile_stack.push(tile);
        i = (i + 1) % players.length;
    } 

    for (let player of players) {
        player.draw_tiles();
        player.find_sets();
    }

    create_chart();

    for (let i = 0; i < players.length; i++) {
        players[i].find_max_set();
        if (current_player_index == -1 || players[i].max_set.length > players[current_player_index].max_set.length)
            current_player_index = i;
    }

    players[current_player_index].place_max_set();
    next_player();
}

function draw() {
    if (!game_over) {
        background(230, 238, 245);

        grid.update();
        grid.show();

        for (let i = 0; i < players.length; i++)
            players[i].show(my_name != players[i].name);

        if (!game_over && players[current_player_index]?.computer) {
            if (frameCount == turn_duration / 2)
                players[current_player_index].auto_play();

            if (frameCount == turn_duration) 
                next_player();
        }

        display_info();
    } else {
        rectMode(CENTER);
        rect(width / 2, height / 2, width / 2, height * 2 / 3, 15);
        
        textSize(24);
        textAlign(CENTER, CENTER);
        let ready_btn = document.getElementById('ready')
        if (ready_btn) {
            ready_btn.disabled = document.getElementById('player_name').value.length == 0;
            my_name = document.getElementById('player_name').value;
        } else
            text('Waiting for other players' + '.', width / 2, height * .75);

        text(ready.filter(client => client).length + ' / ' + ready.length + " players ready", width / 2, height / 2);

        let aspect_ratio = quirkle_title.width / quirkle_title.height;
        let new_width = width * .4;
        let new_height = new_width / aspect_ratio;
        imageMode(CENTER);
        image(quirkle_title, width / 2, height / 3, new_width, new_height);

        document.documentElement.style.setProperty('--offset-x', frameCount * .193);
        document.documentElement.style.setProperty('--offset-y', frameCount * .454);
    }
}

function mouseWheel(event) {
    grid.target_range = max(8, min(25, grid.target_range + event.delta * 0.01));
}

function setup_combination_matrix() {
    for (let j = 0; j < combinations.length; j++)
        for (let k = 0; k < combinations[j].length; k++)
            combinations[j][k] = null;
}

function next_player() {
    players[current_player_index].draw_tiles();

    placed_tiles = grid.cells.flatMap(row => row.filter(cell => cell.temp)).map(cell => new Object({cell: cell})); 
    players[current_player_index].add_points(grid.calc_points(placed_tiles));
    for (let i = 0; i < placed_tiles.length; i++)
        placed_tiles[i].cell.temp = false;

    current_player_index = (current_player_index + 1) % players.length;
    update_chart();
    frameCount = 0;

    grid.evaluate_legal_cells();

    socket.send(JSON.stringify({ type: 'update', players: players.map(p => p.toJSON()), grid: grid.toJSON(), turn: current_player_index }));
}

function display_info() {
    push();
    rectMode(CORNER);
    fill(255);
    stroke(0);
    rect(height, 0, width - height, height);

    aspect_ratio = quirkle_title.width / quirkle_title.height;
    margin = 100
    new_width = width - height - margin;
    new_height = new_width / aspect_ratio;
    imageMode(CORNER);
    image(quirkle_title, height + margin / 2, margin / 2, new_width, new_height);

    pos = [0.16, 0.50, 0.83]

    sorted_players = [...players].sort((a, b) => (b.points[b.points.length - 1] || 0) - (a.points[a.points.length - 1] || 0));

    noFill();
    stroke(0);
    rect(height + margin / 2, new_height + margin * 2, new_width, (sorted_players.length + 1) * 50);
    for (let i = 0; i < pos.length - 1; i++)
        rect(height + margin / 2, new_height + margin * 2, new_width * (pos[i] + pos[i + 1]) / 2, (sorted_players.length + 1) * 50);

    fill(0);
    noStroke();
    textAlign(CENTER, TOP);

    textSize(32);
    text('Players', height + margin / 2 + new_width * pos[0], margin * 2 + new_height);
    textSize(24);
    for (let i = 0; i < sorted_players.length; i++)
        text((i + 1) + '. ' + sorted_players[i].name, height + margin / 2 + new_width * pos[0], margin * 2 + new_height + (i + 1) * 50);

    textSize(32);
    text('Score', height + margin / 2 + new_width * pos[1], margin * 2 + new_height);
    textSize(24);
    for (let i = 0; i < sorted_players.length; i++)
        text(sorted_players[i].points[sorted_players[i].points.length - 1] || '0', height + margin / 2 + new_width * pos[1], margin * 2 + new_height + (i + 1) * 50);

    textSize(32);
    text('Difference', height + margin / 2 + new_width * pos[2], margin * 2 + new_height);
    textSize(24);
    for (let i = 0; i < sorted_players.length; i++) {
        let difference = (sorted_players[i]?.points[sorted_players[i].points.length - 1] || 0) - (sorted_players[i - 1]?.points[sorted_players[i - 1].points.length - 1] || 0)
        text(i > 0 ? difference : '-', height + margin / 2 + new_width * pos[2], margin * 2 + new_height + (i + 1) * 50);
    }

    pop();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}