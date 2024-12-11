class Player {
    constructor(index, name, color, computer) {
        this.index = index;
        this.name = name;
        this.color = color;
        this.computer = computer;
        
        this.tiles = Array.from({ length: 6 }, () => null);
        this.tile_stack = [];
        let angle = TWO_PI / num_players * this.index + HALF_PI;
        this.stack_pos = createVector(height / 2, height / 2).add(p5.Vector.fromAngle(angle).mult(height / 2 - 50).add(createVector(0, height / 5).rotate(angle)));
        
        this.points = [0];
        this.possible_sets;
        this.max_set;
        this.hand_spots = Array.from({ length: 6 }, () => null);
        
        let ang = TWO_PI / num_players * this.index + HALF_PI;
        for (let i = 0; i < 6; i++) {
            let pos = createVector(height / 2, height / 2);
            pos.add(createVector(height / 2 - 50, 0).rotate(ang));
            pos.add(createVector((i - this.tiles.length / 2 + .5) * 50, 0).rotate(ang - HALF_PI));
            this.hand_spots[i] = pos;
        }
    }

    toJSON() {
        return { 
            index: this.index, 
            name: this.name, 
            color: this.color, 
            computer: this.computer, 

            tiles: this.tiles.map(tile => tile?.toJSON()),
            tile_stack: this.tile_stack.map(tile => tile?.toJSON()),
            stack_pos: { x: this.stack_pos.x, y: this.stack_pos.y },
            
            points: this.points, 
            possible_sets: this.possible_sets, 
            max_set: this.max_set 
        }
    }

    fromJSON(json) {
        this.index = json.index;
        this.name = json.name;
        this.color = json.color;
        this.computer = json.computer;
        
        for (let i = 0; i < json.tiles.length; i++)
            this.tiles[i].fromJSON(json.tiles[i]);

        this.tile_stack = Array.from({ length: json.tile_stack.length }, () => new Tile(0, 0));
        for (let i = 0; i < json.tile_stack.length; i++)
            this.tile_stack[i].fromJSON(json.tile_stack[i]);

        this.stack_pos = createVector(json.stack_pos.x, json.stack_pos.y);
        
        this.points = json.points;
        this.possible_sets = json.possible_sets;
        this.max_set = json.max_set;
    }

    auto_play() {
        let best_move = this.place_tile_recursive();

        if (best_move) {
            for (let placement of best_move.placements) {
                grid.place(placement.cell.indexes, placement.tile);
                this.tiles[this.tiles.indexOf(placement.tile)] = null;

                if (this.tiles.every(tile => tile == null) && this.tile_stack.length == 0) {
                    best_move.points += 6;
                    game_over = true;
                }
            }

            this.points.push(this.points?.[this.points.length - 1] + best_move.points);
        }

        for (let cell of grid.cells.flatMap(row => row.filter(cell => cell.discovered && !cell.tile)))
            cell.calc_possible_tiles();
    }

    place_tile_recursive(placements = [], remaining_tiles = this.tiles, best_move = null) {
        let available_cells = [];
        let dirs, dir, off;

        if (placements.length == 0) {
            available_cells = grid.cells.flatMap(row => row.filter(cell => cell.discovered && !cell.tile));
        } else if (placements.length == 1) {
            for (let a = 0; a < TWO_PI; a += HALF_PI) {
                dir = createVector(round(cos(a)), round(sin(a)));
                off = dir.copy();
                while (grid.cells[placements[0].cell.indexes.x + off.x][placements[0].cell.indexes.y + off.y].tile)
                    off.add(dir);
               
                available_cells.push(grid.cells[placements[0].cell.indexes.x + off.x][placements[0].cell.indexes.y + off.y]);
            }
        } else {
            dirs = [];
            for (let a = (placements[0].cell.indexes.y == placements[1].cell.indexes.y) ? 0 : HALF_PI; a < TWO_PI; a += PI)
                dirs.push(createVector(round(cos(a)), round(sin(a))));

            for (let dir of dirs) {
                off = dir.copy();
                while (grid.cells[placements[0].cell.indexes.x + off.x][placements[0].cell.indexes.y + off.y].tile || placements.some(p => placements[0].cell.indexes.x + off.x == p.cell.indexes.x && placements[0].cell.indexes.y + off.y == p.cell.indexes.y))
                    off.add(dir);
                
                available_cells.push(grid.cells[placements[0].cell.indexes.x + off.x][placements[0].cell.indexes.y + off.y]);
            }
        }

        let placed = false;
        let colour, shape;
        let next_layer_placements, tiles;
        for (let i = remaining_tiles.length - 1; i >= 0; i--) {
            if (!remaining_tiles[i]) continue;
            
            colour = remaining_tiles[i].colour;
            shape = remaining_tiles[i].shape;

            for (let j = 0; j < available_cells.length; j++) {
                available_cells[j].calc_possible_tiles(placements);
                if (available_cells[j].possible_tiles[colour][shape]) {
                    next_layer_placements = [
                        ...placements, 
                        {
                            cell: available_cells[j],
                            tile: remaining_tiles[i]
                        }   
                    ]
                    
                    tiles = remaining_tiles.filter((_, index) => index != i);

                    placed = true;
                    best_move = this.place_tile_recursive(next_layer_placements, tiles, best_move);
                }
            }
        }

        if (!placed) {
            let points = grid.calc_points(placements);
            if (best_move == null || points > best_move.points || (points == best_move.points && placements.length > best_move.placements.length)) {
                best_move = {
                    points: points,
                    placements: placements
                };
            }
        }

        return best_move;
    }

    find_max_set() {
        this.find_sets();
        this.max_set = this.possible_sets.reduce((max, current) => current.length > max.length ? current : max, this.possible_sets[0]);
    }

    find_sets() {
        this.possible_sets = [];

        setup_combination_matrix();

        for (let i = 0; i < this.tiles.length; i++)
            if (this.tiles[i] != null)
                combinations[this.tiles[i].shape][this.tiles[i].colour] = i;

        for (let i = 0; i < 6; i++) {
            let superset = [];
            for (let j = 0; j < 6; j++)
                if (combinations[i][j] != null)
                    superset.push(combinations[i][j]);

            if (superset.length > 0) {
                for (let k = 1; k < pow(2, superset.length); k++) {
                    let set = [];
                    let bin = binary(k, superset.length);

                    for (let l = 0; l < bin.length; l++)
                        if (bin[l])
                            set.push(superset[l]);

                    this.possible_sets.push(set);
                }
            }
        }

        for (let j = 0; j < 6; j++) {
            let superset = [];
            for (let i = 0; i < 6; i++)
                if (combinations[i][j] != null)
                    superset.push(combinations[i][j]);

            if (superset.length > 1) {
                for (let k = 1; k < pow(2, superset.length); k++) {
                    let set = [];
                    let bin = binary(k, superset.length);
                    let sum = 0;
                    for (let l = 0; l < bin.length; l++)
                        sum += bin[l];

                    if (sum > 1) {
                        for (let l = 0; l < bin.length; l++)
                            if (bin[l])
                                set.push(superset[l]);

                        this.possible_sets.push(set);
                    }
                }
            }
        }

        this.possible_sets.sort((a, b) => a.length - b.length);
    }

    place_max_set() {
        for (let i = 0; i < this.max_set.length; i++) {
            grid.place(createVector(grid.center.x + i - floor(this.max_set.length / 2), grid.center.y), this.tiles[this.max_set[i]]);
            this.tiles[this.max_set[i]] = null;
        }

        this.add_points(this.max_set.length + 6 * (this.max_set.length == 6)); 
        update_chart();
    }

    draw_tiles() {
        for (let i = 0; i < this.tiles.length; i++)
            if (this.tiles[i] == null)
                this.add_to_hand(i);
    }

    add_to_hand(index) {
        if (this.tile_stack.length == 0) return;

        let tile = this.tile_stack.pop();
        this.tiles[index] = tile;
        this.tiles[index].target_pos = this.hand_spots[index].copy();
        this.tiles[index].target_side = 50;
    }

    add_points(points) {
        this.points.push(this.points[this.points.length - 1] + points);
    }

    show(hidden) {
        for (let tile of this.tiles)
            tile?.update();

        stroke(0);
        fill(28, 29, 31);
        rect(this.stack_pos.x, this.stack_pos.y, 50, 50);
        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(24);
        text(this.tile_stack.length, this.stack_pos.x, this.stack_pos.y);

        push();
        fill(127);
        stroke(0);  
        for (let i in this.tiles) {
            push();
            translate(height / 2, height / 2);
            rotate(TWO_PI / players.length * this.index + HALF_PI);
            rect(height / 2 - 50, ((5 - i) - this.tiles.length / 2 + .5) * 50, 50, 50);
            pop();

            this.tiles[i]?.show(hidden);
        }
        
        translate(height / 2, height / 2);
        rotate(TWO_PI / players.length * this.index + HALF_PI);
        translate(height / 2 - 50, -200);
        rotate(-HALF_PI);

        rectMode(CORNER);
        fill(255);
        stroke(0);
        rect(-50, -25, 100, 50);

        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();
        textSize(24);
        text(this.points[this.points.length - 1] || 0, 0, 0);
        pop();
    }
}

function mouseClicked() {
    if (game_over || my_name != players[current_player_index].name) return;

    let selected_tile = players[current_player_index].tiles.find(tile => tile?.selected);
    if (selected_tile) {
        for (let i = 0; i < grid.cells.length; i++) {
            for (let j = 0; j < grid.cells[i].length; j++) {
                if (
                    selected_tile &&
                    grid.cells[i][j].legal &&
                    mouseX > grid.cells[i][j].pos.x + grid.center.x - grid.cells[i][j].side / 2 &&
                    mouseX < grid.cells[i][j].pos.x + grid.center.x + grid.cells[i][j].side / 2 &&
                    mouseY > grid.cells[i][j].pos.y + grid.center.y - grid.cells[i][j].side / 2 &&
                    mouseY < grid.cells[i][j].pos.y + grid.center.y + grid.cells[i][j].side / 2 &&
                    grid.cells[i][j].possible_tiles[selected_tile.colour][selected_tile.shape]
                ) {
                    selected_tile.selected = false;
                    grid.place(createVector(i, j), selected_tile, true);
                    players[current_player_index].tiles[players[current_player_index].tiles.indexOf(selected_tile)] = null;
                    grid.evaluate_legal_cells();
                }
            }
        }
    }

    for (let i in players[current_player_index].tiles) {
        if (!players[current_player_index].tiles[i])
            continue;

        players[current_player_index].tiles[i].selected = (
            mouseX > players[current_player_index].tiles[i].pos.x - players[current_player_index].tiles[i].side / 2 &&
            mouseX < players[current_player_index].tiles[i].pos.x + players[current_player_index].tiles[i].side / 2 &&
            mouseY > players[current_player_index].tiles[i].pos.y - players[current_player_index].tiles[i].side / 2 &&
            mouseY < players[current_player_index].tiles[i].pos.y + players[current_player_index].tiles[i].side / 2
        )
    }
}