class Cell {
    constructor(indexes) {
        this.indexes = indexes;
        this.tile = null;
        this.discovered = false;
        this.legal = false;
        this.possible_tiles = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => true));
    }

    toJSON() {
        return {
            indexes: { x: this.indexes.x, y: this.indexes.y },
            tile: this.tile ? this.tile.toJSON() : null,
            discovered: this.discovered,
            legal: this.legal,
            possible_tiles: this.possible_tiles
        }
    }

    fromJSON(json) {
        this.indexes = createVector(json.indexes.x, json.indexes.y);
        if (!json.tile)
            this.tile = null;
        else {
            this.tile = new Tile(0, 0);
            this.tile.fromJSON(json.tile)
        }
        this.discovered = json.discovered;
        this.legal = json.legal;
        this.possible_tiles = json.possible_tiles;
    }

    update() {
        this.side = height / (grid.range * 2 + 1);
        this.pos = createVector(height / 2, height / 2).add(p5.Vector.sub(this.indexes, grid.center).mult(this.side));
        this.rendered_pos = p5.Vector.add(this.pos, grid.center);
        if (this.tile)
            this.tile.update();

        this.focused = (
            this.discovered && !this.tile &&
            mouseX > this.pos.x + grid.center.x - this.side / 2 &&
            mouseX < this.pos.x + grid.center.x + this.side / 2 &&
            mouseY > this.pos.y + grid.center.y - this.side / 2 &&
            mouseY < this.pos.y + grid.center.y + this.side / 2
        )
    }

    show() {
        if (this.rendered_pos.x < -this.side || this.rendered_pos.y < -this.side || this.rendered_pos.x > height + this.side || this.rendered_pos.y > height + this.side)
            return;

        fill(230, 238, 245);
        
        if (my_name == players[current_player_index].name && (this.tile || this.legal) && this.possible_tiles.flat().some(tile => tile))
            fill(195, 198, 255);

        rect(this.rendered_pos.x, this.rendered_pos.y, this.side);
    }

    show_tile() {
        if (this.tile && this.rendered_pos.x > -this.side && this.rendered_pos.y > -this.side && this.rendered_pos.x < height + this.side && this.rendered_pos.y < height + this.side)
            this.tile.show();
    }

    show_info() {
        if (this.discovered && !this.tile && this.focused)
            this.draw_possible_tiles();
    }

    calc_possible_tiles(extra_placements = []) {
        let off, norm_off, dir;
        let tile, other_tile;

        this.possible_tiles = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => true));
        for (let a = 0; a < TWO_PI; a += HALF_PI) {
            dir = createVector(round(cos(a)), round(sin(a)));
            off = dir.copy();
            while (grid.cells[this.indexes.x + off.x][this.indexes.y + off.y].tile || extra_placements.some(placement => this.indexes.x + off.x == placement.cell.indexes.x && this.indexes.y + off.y == placement.cell.indexes.y)) {
                tile = grid.cells[this.indexes.x + off.x][this.indexes.y + off.y].tile || extra_placements.find(placement => this.indexes.x + off.x == placement.cell.indexes.x && this.indexes.y + off.y == placement.cell.indexes.y).tile;
                this.possible_tiles[tile.colour][tile.shape] = false;

                if (off.mag() == 2) {
                    norm_off = p5.Vector.normalize(off);
                    other_tile = grid.cells[this.indexes.x + norm_off.x][this.indexes.y + norm_off.y].tile || extra_placements.find(placement => this.indexes.x + norm_off.x == placement.cell.indexes.x && this.indexes.y + norm_off.y == placement.cell.indexes.y).tile;
                    this.possible_tiles.forEach((row, i) => { row.forEach((_, j) => { if ((tile.colour == other_tile.colour && i != tile.colour) || (tile.shape == other_tile.shape && j != tile.shape)) { this.possible_tiles[i][j] = false; }}); });
                }

                off.add(dir);
            }
            if (off.mag() == 2) {
                norm_off = p5.Vector.normalize(off);
                tile = grid.cells[this.indexes.x + norm_off.x][this.indexes.y + norm_off.y].tile || extra_placements.find(placement => this.indexes.x + norm_off.x == placement.cell.indexes.x && this.indexes.y + norm_off.y == placement.cell.indexes.y).tile;
                this.possible_tiles.forEach((row, i) => { row.forEach((_, j) => { if (i != tile.colour && j != tile.shape) { this.possible_tiles[i][j] = false; }}); });
            }
        }

        for (let a = 0; a < PI; a += HALF_PI) {
            off = createVector(round(cos(a)), round(sin(a)));
            let left, right;
            if (grid.cells[this.indexes.x - off.x][this.indexes.y - off.y].tile)
                left = grid.cells[this.indexes.x - off.x][this.indexes.y - off.y].tile;
            else if (extra_placements.find(placement => this.indexes.x - off.x == placement.cell.indexes.x && this.indexes.y - off.y == placement.cell.indexes.y))
                left = extra_placements.find(placement => this.indexes.x - off.x == placement.cell.indexes.x && this.indexes.y - off.y == placement.cell.indexes.y).tile;

            if (grid.cells[this.indexes.x + off.x][this.indexes.y + off.y].tile)
                right = grid.cells[this.indexes.x + off.x][this.indexes.y + off.y].tile;
            else if (extra_placements.find(placement => this.indexes.x + off.x == placement.cell.indexes.x && this.indexes.y + off.y == placement.cell.indexes.y))
                right = extra_placements.find(placement => this.indexes.x + off.x == placement.cell.indexes.x && this.indexes.y + off.y == placement.cell.indexes.y).tile;

            if (left && right && left.colour != right.colour && left.shape != right.shape)
                this.possible_tiles.forEach((row, i) => { row.forEach((_, j) => this.possible_tiles[i][j] = false); });
        }
    }

    draw_possible_tiles() {
        push()
        translate(45, 45);
        for (let i = 0; i < 6; i++)
            for (let j = 0; j < 6; j++)
                draw_tile(createVector(i, j).mult(37), 37, i, j, this.possible_tiles[i][j] ? 255 : 17); 

        pop();
    }
}