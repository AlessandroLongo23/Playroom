let maskImg;
let confs = [];

function preload() {
    for (let i = 0; i < 10; i++)
        confs[i] = loadImage(i + ".png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    side = 75;
    grid = new Grid(side);

    configuration = new Configuration([
        new Coin(createVector(0, -sqrt(3) / 2)),
        new Coin(createVector(-.5, 0)),
        new Coin(createVector(.5, 0)),
        new Coin(createVector(0, sqrt(3) / 2))
    ]);
    unique_configurations = [configuration];
    arcs = [];
    
    queue = [configuration];
    layer = 1;
    while (unique_configurations.length < 10) {
        next_layer = [];
        for (let conf of queue)
            next_layer = next_layer.concat(conf.generate_children());
    
        queue = next_layer;
        layer++;
    }

    // for (let i = 0; i < unique_configurations.length; i++)
    //     unique_configurations[i].print(i);

    maskImg = createGraphics(100, 100);
    maskImg.ellipse(50, 50, 100, 100);

    numIterations = 100;
    repulsionFactor = 5;
    attractionFactor = .001;
    damping = .8;
    borderRepulsionFactor = repulsionFactor * 2;
}

function draw() {
    // grid.show();
    // configuration.show();

    for (let i = 0; i < numIterations; i++) {
        unique_configurations.forEach(node => {
            node.force.set(0, 0);

            const borderForces = [
                { x: 0, y: -node.pos.y }, 
                { x: 0, y: height - node.pos.y },
                { x: -node.pos.x, y: 0 }, 
                { x: width - node.pos.x, y: 0 }
            ];

            borderForces.forEach(borderForce => {
                const distanceSquared = borderForce.x * borderForce.x + borderForce.y * borderForce.y;
                const force = borderRepulsionFactor / distanceSquared;

                node.force.x -= force * borderForce.x;
                node.force.y -= force * borderForce.y;
            });
    
            arcs.forEach(arc => {
                if (arc.parent == node) {
                    const dx = arc.child.pos.x - node.pos.x;
                    const dy = arc.child.pos.y - node.pos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = attractionFactor * distance;
                    node.force.x += force * dx / distance;
                    node.force.y += force * dy / distance;
                } else if (arc.child == node) {
                    const dx = arc.parent.pos.x - node.pos.x;
                    const dy = arc.parent.pos.y - node.pos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = attractionFactor * distance;
                    node.force.x += force * dx / distance;
                    node.force.y += force * dy / distance;
                }
            });
    
            unique_configurations.forEach(otherNode => {
                if (otherNode != node) {
                    const dx = otherNode.pos.x - node.pos.x;
                    const dy = otherNode.pos.y - node.pos.y;
                    const distanceSquared = dx * dx + dy * dy;
                    const force = repulsionFactor / distanceSquared;
                    node.force.x -= force * dx;
                    node.force.y -= force * dy;
                }
            });
        });
    
        unique_configurations.forEach(node => {
            node.velocity.add(node.force).mult(damping);
            node.pos.add(node.velocity);
        });
    }

    background(255);
    for (let arc of arcs)
        line(arc.parent.pos.x, arc.parent.pos.y, arc.child.pos.x, arc.child.pos.y);

    for (let i = 0; i < 10; i++) {
        confs[i].mask(maskImg);
        image(confs[i], unique_configurations[i].pos.x - 50, unique_configurations[i].pos.y - 50, 100, 100);
    }
}

function mouseClicked() {
    let selected_coin = configuration.coins.find(coin => dist(coin.pos.x, coin.pos.y, mouseX, mouseY) < coin.rad);
    if (selected_coin) {
        configuration.coins.forEach((coin) => { coin.selected = false });
        selected_coin.selected = true;
        configuration.calc_legal_moves(selected_coin);
    } else {
        let prev_selected_coin = configuration.coins.find(coin => coin.selected);
        if (prev_selected_coin) {
            let valid_move = prev_selected_coin.legal_moves.find(move => dist(move.pos.x, move.pos.y, mouseX, mouseY) < grid.side / 2);
            if (valid_move) {
                prev_selected_coin.grid_pos = valid_move.grid_pos;
                prev_selected_coin.pos = valid_move.pos;
                configuration.update();
            }
        
            prev_selected_coin.selected = false;
        }
    }
}

function array_to_number(arr) {
    let arrStr = arr.join('');

    let hash = 0;
    for (let i = 0; i < arrStr.length; i++) {
        hash = (hash << 5) + arrStr.charCodeAt(i);
        hash = hash & hash;
        hash = Math.abs(hash);
    }
    
    return hash;
}

p5.Vector.prototype.round = function(precision) {
    this.x = round(this.x, precision) || 0;
    this.y = round(this.y, precision) || 0;

    return this;
}

class Configuration {
    constructor(coins) {
        this.pos = createVector(random(width), random(height));
        this.velocity = createVector();
        this.force = createVector();
        this.coins = coins;
        this.id = this.calc_id();
    }

    update() {
        this.id = this.calc_id();
    }

    show() {
        for (let coin of this.coins)
            coin.show();
    }

    calc_id() {
        let m = math.zeros(this.coins.length, this.coins.length);
        for (let i = 0; i < this.coins.length; i++)
            for (let j = 0; j < this.coins.length; j++)
                m.set([i, j], round(this.coins[i].dist(this.coins[j]), 3));
    
        return array_to_number(sort(math.eigs(m).values._data.map(value => round(value, 3))));
    }

    calc_legal_moves(coin) {
        coin.legal_moves = [];

        let new_move, ortho, half, d, mag;
        for (let i = 0; i < this.coins.length; i++) {
            for (let j = i + 1; j < this.coins.length; j++) {
                if (this.coins[i] != coin && this.coins[j] != coin) {
                    d = round(this.coins[i].dist(this.coins[j]), 3);
                    if (d == 1 || d == round(sqrt(3), 3) || d == 2) {
                        mag = round(sqrt(1 - sq(d / 2)), 3);
                        ortho = this.coins[i].grid_pos.copy().sub(this.coins[j].grid_pos).rotate(PI / 2).setMag(mag);
                        half = this.coins[i].grid_pos.copy().add(this.coins[j].grid_pos).div(2);

                        for (let side of [-1, 1]) {
                            new_move = {};
                            new_move.grid_pos = half.copy().add(ortho.copy().mult(side)).round(3);
                            new_move.pos = calc_pos(new_move.grid_pos);
                            if (!this.coins.find(c => c.grid_pos.equals(new_move.grid_pos)) && !coin.legal_moves.find(valid_move => valid_move.grid_pos.equals(new_move.grid_pos)))
                                coin.legal_moves.push(new_move);
                        }
                    }
                }
            }
        }
    }

    generate_children() {
        let children = [];
        for (let selected_coin of this.coins) {
            this.calc_legal_moves(selected_coin);
            for (let move of selected_coin.legal_moves) {
                let new_coins = this.coins.filter(coin => coin != selected_coin).concat([new Coin(move.grid_pos)]);
                let new_configuration = new Configuration(new_coins);
                if (!unique_configurations.find(conf => conf.id == new_configuration.id)) {
                    arcs.push(new Arc(this, new_configuration));
                    new_configuration.parent = this;
                    unique_configurations.push(new_configuration);
                    children.push(new_configuration);
                }
            }
        }

        return children;
    }

    print(index) {
        let tl = createVector(width, height);
        let br = createVector(0, 0);

        for (let coin of this.coins) {
            tl.x = min(tl.x, coin.pos.x);
            tl.y = min(tl.y, coin.pos.y);
            br.x = max(br.x, coin.pos.x);
            br.y = max(br.y, coin.pos.y);
        }

        let side_length = max(br.x - tl.x, br.y - tl.y) + side * 4;
        let center = createVector((tl.x + br.x) / 2, (tl.y + br.y) / 2);

        grid.show();
        this.show();
        let img = get(center.x - side_length / 2, center.y - side_length / 2, side_length, side_length);
        img.save("" + index, "png");
        clear();
    }
}

class Arc {
    constructor(parent, child) {
        this.parent = parent;
        this.child = child;   
    }

    update() {

    }

    show() {

    }
}

class Grid {
    constructor(side) {
        this.side = side;
    }

    show() {
        background(29, 38, 46);

        push();
        stroke(180, 197, 212, 10)
        translate(width / 2 - this.side / 2, height / 2);
        for (let i = 0; i < 3; i++) {
            rotate(TWO_PI / 6);
            for (let y = -20 * this.side * sqrt(3) / 2; y < 20 * this.side * sqrt(3) / 2; y += this.side * sqrt(3) / 2)
                line(-width, y, width, y);
        }
        pop();
    }
}

function calc_pos(grid_pos) {
    return createVector(width / 2 + grid_pos.x * grid.side, height / 2 + grid_pos.y * grid.side);
}

class Coin {
    constructor(grid_pos) {
        this.grid_pos = grid_pos.round(3);
        this.rad = side / 2;
        this.calc_pos()
        this.selected = false;
        this.legal_moves = [];
        this.configuration;
    }

    calc_pos() {
        this.pos = createVector(width / 2 + this.grid_pos.x * this.rad * 2, height / 2 + this.grid_pos.y * this.rad * 2);
    }

    dist(other) {
        return dist(this.grid_pos.x, this.grid_pos.y, other.grid_pos.x, other.grid_pos.y);
    }

    show() {
        if (this.selected) {
            for (let move of this.legal_moves) {
                push();
                translate(move.pos);
                noStroke();
                fill(66, 151, 227, 51);

                // translate(-this.rad, -this.rad);
                // tint(255, 64);
                // image(coin, 0, 0, this.rad * 2, this.rad * 2)

                ellipse(0, 0, this.rad * 2);
                pop();
            }
        }

        push();
        translate(this.pos);
        noStroke();
        fill(this.selected ? color(48, 199, 123) : color(66, 151, 227));
        
        // translate(-this.rad, -this.rad)
        // tint(255, 255)
        // image(coin, 0, 0, this.rad * 2, this.rad * 2)
        
        ellipse(0, 0, this.rad * 2);
        pop();
    }
}
