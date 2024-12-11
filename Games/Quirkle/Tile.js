class Tile {
    constructor(colour, shape) {
        this.colour = colour;
        this.shape = shape;
        this.cell_indexes = null;
        
        this.pos = null;
        this.target_pos = null;
        this.side = 50;
        this.target_side = null;
        
        this.selected = false;
        this.placed = false;
        this.animation_speed = 0.25;
    }

    update() {
        if (this.cell_indexes) {
            this.target_pos = grid.cells[this.cell_indexes.x][this.cell_indexes.y].rendered_pos;
            this.target_side = grid.cells[this.cell_indexes.x][this.cell_indexes.y].side;
        }

        if (!this.target_pos || !this.target_side) return;

        if (!this.placed && (p5.Vector.sub(this.pos, this.target_pos).mag() > 1 || abs(this.side - this.target_side) > 1)) {
            this.pos.add(p5.Vector.sub(this.target_pos, this.pos).mult(this.animation_speed));
            this.side += (this.target_side - this.side) * this.animation_speed;
        } else {
            this.placed = true;
            this.pos = this.target_pos;
            this.side = this.target_side;
        }
    }

    show(hidden = false) {
        draw_tile(this.pos, this.side, this.colour, this.shape, this.selected ? 200 : 255, hidden);
    }

    toJSON() {
        return {
            colour: this.colour,
            shape: this.shape,
            cell_indexes: this.cell_indexes ? { x: this.cell_indexes.x, y: this.cell_indexes.y } : null,
            pos: this.pos ? { x: this.pos.x, y: this.pos.y} : null,
            target_pos: this.target_pos ? { x: this.target_pos.x, y: this.target_pos.y } : null,
            side: this.side,
            target_side: this.target_side,
            placed: this.placed,
            animation_speed: this.animation_speed
        }
    }
    
    fromJSON(json) {
        this.colour = json.colour;
        this.shape = json.shape;
        this.cell_indexes = json.cell_indexes ? createVector(json.cell_indexes.x, json.cell_indexes.y) : null;
        this.pos = json.pos ? createVector(json.pos.x, json.pos.y) : null;
        this.target_pos = json.target_pos ? createVector(json.target_pos.x, json.target_pos.y) : null;
        this.side = json.side;
        this.target_side = json.target_side;
        this.placed = json.placed;
        this.animation_speed = json.animation_speed;
    }
}

function draw_tile(pos, side, colour, shape, opacity = 255, hidden = false) {
    push();
    stroke(0);
    fill(28, 29, 31);
    translate(pos.x, pos.y);
    rect(0, 0, side);

    if (hidden) {
        pop();
        return;
    }

    let fill_color = colors[colour];
    fill_color.setAlpha(opacity);
    fill(fill_color);

    switch (shape) {
        case 0:
            ellipse(0, 0, side * .7);
            break;
        case 1:
            rect(0, 0, side * .7);
            break;
        case 2:
            rotate(TWO_PI / 8);
            rect(0, 0, side * .5);
            break;
        case 3:
            beginShape();
            for (let i = PI / 4; i < TWO_PI + PI / 4; i += TWO_PI / 4) {
                vertex(side * .5 * cos(i), side * .5 * sin(i));
                vertex(side * .2 * cos(i + TWO_PI / 8), side * .2 * sin(i + TWO_PI / 8));
            }
            endShape();
            break;
        case 4:
            beginShape();
            for (let i = PI / 4; i < TWO_PI + PI / 4; i += TWO_PI / 8) {
                vertex(side * .4 * cos(i), side * .4 * sin(i));
                vertex(side * .2 * cos(i + TWO_PI / 16), side * .2 * sin(i + TWO_PI / 16));
            }
            endShape();
            break;
        case 5:
            for (let i = 0; i < 4; i++) {
                beginShape();
                vertex(-side * .1, -side * .1);
                bezierVertex(-side * .4, -side * .5, side * .4, -side * .5, side * .1, -side * .1);
                endShape();
                rotate(HALF_PI);
            }
            noStroke();
            ellipse(0, 0, side * .3);
            break;
    }
    pop();
}