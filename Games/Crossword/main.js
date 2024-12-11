function preload() {
    raw = loadJSON("clues.json");
}

function setup() {
    gridWidth = 20;
    gridHeight = 12;
    side = 40;

    generate = false;

    createCanvas(gridWidth * side, gridHeight * side);

    data = process();

    grid = new Grid(gridWidth, gridHeight, side);
    grid.show();
}

function draw() {
    if (generate)
        grid.evaluateEntropy().collapse();

    grid.show();
}

function mouseClicked() {
    grid.update();
}

function keyPressed() {
    if (keyCode == ENTER)
        generate = true;
}

function process() {
    rawLength = Object.keys(raw).length;

    data = [];
    let maxLength = 0;
    for (let i = 0; i < rawLength; i++)
        maxLength = raw[i]["solution"].length > maxLength ? raw[i]["solution"].length : maxLength;

    for (let i = 0; i <= maxLength; i++)
        data[i] = [];

    for (let i = 0; i < rawLength; i++)
        data[raw[i]["solution"].length].push(raw[i]);

    function compareSolutions(a, b) {
        if (a.solution < b.solution) {
            return -1;
        } else if (a.solution > b.solution) {
            return 1;
        } else {
            return 0;
        }
    }

    function groupWordsBySolution(words) {
        const groupedWords = [];
        let currentGroup = { solution: '', clues: [] };

        for (const word of words) {
            if (currentGroup.solution !== word.solution) {
                if (currentGroup.solution)
                    groupedWords.push(currentGroup);

                currentGroup = { solution: word.solution, clues: [word.clue] };
            } else {
                currentGroup.clues.push(word.clue);
            }
        }

        if (currentGroup.solution)
            groupedWords.push(currentGroup);

        return groupedWords;
    }

    for (let i = 0; i < data.length; i++)
        data[i] = groupWordsBySolution(data[i]);

    return data;
}

class Grid {
    constructor(gridWidth, gridHeight, side) {
        this.cells = matrix(gridWidth, gridHeight);
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.side = side;

        for (let x = 0; x < gridWidth; x++)
            for (let y = 0; y < gridHeight; y++)
                this.cells[x][y] = new Cell(x, y, side);

        this.verticals = [];
        this.horizontals = [];
    }

    show() {
        for (let x = 0; x < this.gridWidth; x++)
            for (let y = 0; y < this.gridHeight; y++)
                this.cells[x][y].show();

        if (generate)
            fill(0, 255, 0)
        else
            fill(255, 0, 0)

        ellipse(10, 10, 5);
    }

    update() {
        for (let x = 0; x < this.gridWidth; x++)
            for (let y = 0; y < this.gridHeight; y++)
                this.cells[x][y].update();
    }

    updateNumbers() {
        let number = 1;
        let wordAdded;
        this.horizontals = [];
        this.verticals = [];

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                this.cells[x][y].number = 0;
                wordAdded = false;

                if (x == 0 && !this.cells[x][y].black && !this.cells[x + 1][y].black) {
                    wordAdded = true;
                    this.cells[x][y].number = number;
                    this.horizontals.push(new Word(this.horizontals.length, number, createVector(x, y), 0, this.search(x, y, 0)));
                }
                if (y == 0 && !this.cells[x][y].black && !this.cells[x][y + 1].black) {
                    wordAdded = true;
                    this.cells[x][y].number = number;
                    this.verticals.push(new Word(this.verticals.length, number, createVector(x, y), 1, this.search(x, y, 1)));
                }
                if (x > 0 && x < this.gridWidth - 1 && this.cells[x - 1][y].black && !this.cells[x][y].black && !this.cells[x + 1][y].black) {
                    wordAdded = true;
                    this.cells[x][y].number = number;
                    this.horizontals.push(new Word(this.horizontals.length, number, createVector(x, y), 0, this.search(x, y, 0)));
                }
                if (y > 0 && y < this.gridHeight - 1 && this.cells[x][y - 1].black && !this.cells[x][y].black && !this.cells[x][y + 1].black) {
                    wordAdded = true;
                    this.cells[x][y].number = number;
                    this.verticals.push(new Word(this.verticals.length, number, createVector(x, y), 1, this.search(x, y, 1)));
                }

                if (wordAdded)
                    number++;
            }
        }
        this.show();
    }

    search(x, y, dir, len = 1) {
        if (dir == 0)
            if (x == this.gridWidth - 1 || this.cells[x + 1][y].black)
                return len;
            else
                return this.search(x + 1, y, dir, len + 1);
        else {
            if (y == this.gridHeight - 1 || this.cells[x][y + 1].black)
                return len;
            else
                return this.search(x, y + 1, dir, len + 1);
        }
    }

    evaluateEntropy() {
        let minEntropy = 1;
        let minEntropyWord;

        for (let i = 0; i < this.horizontals.length; i++) {
            if (!this.horizontals[i].collapsed) {
                if (this.horizontals[i].pool.length == 0)
                    console.log("error")

                if (this.horizontals[i].pool.length / pow(26, this.horizontals[i].len) < minEntropy) {
                    minEntropy = this.horizontals[i].pool.length / pow(26, this.horizontals[i].len);
                    minEntropyWord = this.horizontals[i];
                }
            }
        }

        for (let i = 0; i < this.verticals.length; i++) {
            if (!this.verticals[i].collapsed) {
                if (this.verticals[i].pool.length == 0)
                    console.log("error")

                if (this.verticals[i].pool.length / pow(26, this.verticals[i].len) < minEntropy) {
                    minEntropy = this.verticals[i].pool.length / pow(26, this.verticals[i].len);
                    minEntropyWord = this.verticals[i];
                }
            }
        }

        return minEntropyWord;
    }
}

class Cell {
    constructor(x, y, side) {
        this.indexes = createVector(x, y);
        this.pos = createVector(x * side, y * side);
        if (x + y == 5 || x + y == 15 || x + y == 25)
            this.black = true;
        else
            this.black = false;
        this.character = "";
        this.side = side;
        this.number = 0;
        this.horizontalIndex = -1;
        this.verticalIndex = -1;
    }

    update() {
        if (
            mouseX > this.pos.x && mouseX < this.pos.x + this.side &&
            mouseY > this.pos.y && mouseY < this.pos.y + this.side
        ) {
            this.black = !this.black;
            grid.updateNumbers();
        }
    }

    show() {
        push();
        stroke(30);
        if (this.black)
            fill(30);
        else
            fill(220);

        rect(this.pos.x, this.pos.y, this.side);
        noStroke();
        fill(30);
        textAlign(CENTER, CENTER);
        textSize(side * 0.75);
        text(this.character, this.pos.x + this.side / 2, this.pos.y + this.side / 2);

        if (this.number) {
            textAlign(LEFT, TOP);
            textSize(this.side / 4);
            text(this.number, this.pos.x + this.side / 12, this.pos.y + this.side / 12);
        }
        pop();
    }
}

class Word {
    constructor(index, number, pos, dir, len) {
        this.index = index;
        this.number = number;
        this.pos = pos;
        this.dir = dir;
        this.len = len;

        this.characters = [];
        this.clue = "";
        this.pool = [...data[len]];
        this.entropy = data[len].length / pow(26, len);
        this.collapsed = false;

        for (let i = 0; i < len; i++) {
            if (dir == 0)
                grid.cells[pos.x + i][pos.y].horizontalIndex = index;
            else
                grid.cells[pos.x][pos.y + i].verticalIndex = index;
        }
    }

    reset() {
        console.log(this.pos, this.len, this.dir, "cancelled");

        this.characters = [];
        for (let i = 0; i < this.len; i++)
            grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].character = "";

        this.clue = "";
        this.pool = [...data[this.len]];
        this.entropy = data[this.len].length / pow(26, this.len);
        this.collapsed = false;

        this.updateEntropy();
    }

    collapse() {
        let pick = random(this.pool);

        console.log(this.pos, this.len, this.dir, pick["solution"], "collapsed")

        for (let i = 0; i < this.len; i++) {
            this.characters[i] = pick["solution"].charAt(i);

            grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].character = this.characters[i];
            if (this.dir == 0) {
                if (grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].verticalIndex != -1 && !grid.verticals[grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].verticalIndex].collapsed)
                    grid.verticals[grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].verticalIndex].updateEntropy();
            } else {
                if (grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].horizontalIndex != -1 && !grid.horizontals[grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].horizontalIndex].collapsed)
                    grid.horizontals[grid.cells[this.pos.x + abs(this.dir - 1) * i][this.pos.y + this.dir * i].horizontalIndex].updateEntropy();
            }
        }

        this.clue = random(pick["clue"]);
        this.collapsed = true;
        this.pool = [];
    }

    updateEntropy() {
        let temp = [];
        for (let j = 0; j < this.len; j++)
            temp.push(grid.cells[this.pos.x + abs(this.dir - 1) * j][this.pos.y + this.dir * j].character);

        for (let j = this.pool.length - 1; j >= 0; j--) {
            for (let c = 0; c < this.len; c++) {
                if (temp[c] != "" && this.pool[j]["solution"].charAt(c) != temp[c]) {
                    this.pool.splice(j, 1);
                    c = this.len;
                }
            }
        }

        if (this.pool.length == 0 && !this.collapsed) {
            for (let j = 0; j < this.len; j++) {
                grid.cells[this.pos.x + abs(this.dir - 1) * j][this.pos.y + this.dir * j].character == "";
                if (this.dir == 0)
                    grid.verticals[grid.cells[this.pos.x + j][this.pos.y].verticalIndex].reset();
                else
                    grid.horizontals[grid.cells[this.pos.x][this.pos.y + j].horizontalIndex].reset();
            }

            this.updateEntropy();
        }

        this.entropy = this.pool.length / pow(26, this.len);

        console.log(this.pos, this.len, this.dir, this.pool.length, this.entropy, "updated");
    }
}