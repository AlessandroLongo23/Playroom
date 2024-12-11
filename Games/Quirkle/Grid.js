class Grid {
    constructor() {
        this.cells = Array.from({ length: 91 }, (_, i) => Array.from({ length: 91 }, (_, j) => new Cell(createVector(i, j))));
        this.range = 15;
        this.target_range = 15;
        this.center = createVector(floor(this.cells.length / 2), floor(this.cells.length / 2));
    }

    toJSON() {
        return {
            cells: this.cells.map(row => row.map(cell => cell.toJSON())),
        }
    }

    fromJSON(json) {
        for (let i = 0; i < this.cells.length; i++)
            for (let j = 0; j < this.cells[i].length; j++)
                this.cells[i][j].fromJSON(json.cells[i][j]);
    }

    initialize() {
        this.cells.forEach(row => row.forEach(cell => cell.update()));
    } 

    update() {
        this.range += (this.target_range - this.range) * .1;
        
        if (mouseIsPressed)
            this.center.add(p5.Vector.sub(createVector(pmouseX, pmouseY), createVector(mouseX, mouseY)).div(grid.cells[0][0].side));

        this.cells.forEach(row => row.forEach(cell => cell.update()));
    }

    show() {
        rectMode(CENTER, CENTER);
        stroke(51, 50);
        fill(230, 238, 245);
        
        this.cells.forEach(row => row.forEach(cell => cell.show()));
        this.cells.forEach(row => row.forEach(cell => cell.show_tile()));
        this.cells.forEach(row => row.forEach(cell => cell.show_info()));
    }

    place(cell_coord, tile, temp = false) {
        tile.cell_indexes = cell_coord.copy();
        tile.placed = false;
        this.cells[cell_coord.x][cell_coord.y].tile = tile;
        this.cells[cell_coord.x][cell_coord.y].discovered = true;
        this.cells[cell_coord.x][cell_coord.y].temp = temp;

        for (let i = 0; i < TWO_PI; i += HALF_PI) {
            let off = createVector(round(cos(i)), round(sin(i)));
            while (this.cells[cell_coord.x + off.x][cell_coord.y + off.y].tile)
                off = off.add(createVector(round(cos(i)), round(sin(i))));
            
            this.cells[cell_coord.x + off.x][cell_coord.y + off.y].discovered = true;
            this.cells[cell_coord.x + off.x][cell_coord.y + off.y].calc_possible_tiles();
        }
    }

    calc_points(placements) {
        let points = 0;

        if (placements.length == 1) {
            for (let i = 0; i < PI; i += HALF_PI) {
                let streak = 0;
                for (let j = -1; j <= 1; j += 2) {
                    let dir = createVector(round(cos(i)), round(sin(i))).mult(j);
                    let off = p5.Vector.add(createVector(), dir);
                    while (this.cells[placements[0].cell.indexes.x + off.x][placements[0].cell.indexes.y + off.y].tile) {
                        off = p5.Vector.add(off, dir);
                        streak++;
                    }
                }

                if (streak > 0) streak++;
                points += streak + 6 * (streak == 6);
            }
        } else if (placements.length > 1) {
            if (placements[0].cell.indexes.y == placements[1].cell.indexes.y) {
                let min_x = min(placements.map(p => p.cell.indexes.x));
                let max_x = max(placements.map(p => p.cell.indexes.x));
                while (this.cells[min_x - 1][placements[0].cell.indexes.y].tile) min_x--;
                while (this.cells[max_x + 1][placements[0].cell.indexes.y].tile) max_x++;

                points += max_x - min_x + 1 + 6 * (max_x - min_x + 1 == 6);

                for (let placement of placements) {
                    let streak = 0;
                    let i = HALF_PI;
                    for (let j = -1; j <= 1; j += 2) {
                        let dir = createVector(round(cos(i)), round(sin(i))).mult(j);
                        let off = p5.Vector.add(createVector(), dir);
                        while (this.cells[placement.cell.indexes.x + off.x][placement.cell.indexes.y + off.y].tile) {
                            off = p5.Vector.add(off, dir);
                            streak++;
                        }
                    }

                    if (streak > 0) streak++;
                    points += streak + 6 * (streak == 6);
                }
            } else if (placements[0].cell.indexes.x == placements[1].cell.indexes.x) {
                let min_y = min(placements.map(p => p.cell.indexes.y));
                let max_y = max(placements.map(p => p.cell.indexes.y));
                while (this.cells[placements[0].cell.indexes.x][min_y - 1].tile) min_y--;
                while (this.cells[placements[0].cell.indexes.x][max_y + 1].tile) max_y++;

                points += max_y - min_y + 1 + 6 * (max_y - min_y + 1 == 6);

                for (let placement of placements) {
                    let streak = 0;
                    let i = 0;
                    for (let j = -1; j <= 1; j += 2) {
                        let dir = createVector(round(cos(i)), round(sin(i))).mult(j);
                        let off = p5.Vector.add(createVector(), dir);
                        while (this.cells[placement.cell.indexes.x + off.x][placement.cell.indexes.y + off.y].tile) {
                            off = p5.Vector.add(off, dir);
                            streak++;
                        }
                    }

                    if (streak > 0) streak++;
                    points += streak + 6 * (streak == 6);
                }
            }
        }

        return points;
    }

    evaluate_legal_cells() {
        this.cells.forEach(row => row.forEach(cell => cell.legal = false));
        let placed_cells = this.cells.flatMap(row => row).filter(cell => cell.temp);
        let dir, dirs, off;
        if (placed_cells.length == 0) {
            this.cells.flatMap(row => row).forEach(cell => cell.legal = cell.discovered);
        } else if (placed_cells.length == 1) {
            for (let a = 0; a < TWO_PI; a += HALF_PI) {
                dir = createVector(round(cos(a)), round(sin(a)));
                off = dir.copy();
                while (grid.cells[placed_cells[0].indexes.x + off.x][placed_cells[0].indexes.y + off.y].tile)
                    off.add(dir);
               
                grid.cells[placed_cells[0].indexes.x + off.x][placed_cells[0].indexes.y + off.y].legal = true;
            }
        } else {
            dirs = [];
            for (let a = (placed_cells[0].indexes.y == placed_cells[1].indexes.y) ? 0 : HALF_PI; a < TWO_PI; a += PI)
                dirs.push(createVector(round(cos(a)), round(sin(a))));

            for (let dir of dirs) {
                off = dir.copy();
                while (grid.cells[placed_cells[0].indexes.x + off.x][placed_cells[0].indexes.y + off.y].tile || placed_cells.some(p => placed_cells[0].indexes.x + off.x == p.indexes.x && placed_cells[0].indexes.y + off.y == p.indexes.y))
                    off.add(dir);
                
                grid.cells[placed_cells[0].indexes.x + off.x][placed_cells[0].indexes.y + off.y].legal = true;
            }
        }
    }
}