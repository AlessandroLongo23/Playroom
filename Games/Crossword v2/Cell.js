class Cell {
    constructor(x, y, side) {
        this.indexes = createVector(x, y);
        this.pos = createVector(x * side, y * side);
        this.side = side;
        // if (x + y == 5 || x + y == 15 || x + y == 25)
        //     this.black = true;
        // else
        this.black = false;

        this.number = 0;
        this.horizontalIndex = -1;
        this.verticalIndex = -1;
        this.collapsed = false;
        this.character = "";
        this.possibleCharacters = [];
        this.updated = 0;

        this.horizontalCharacterCount = [];
        this.verticalCharacterCount = [];

        this.horizontalCharacterProbability = [];
        this.verticalCharacterProbability = [];

        this.charactersProbabilities = [];
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

    reset() {
        this.number = 0;
        this.horizontalIndex = -1;
        this.verticalIndex = -1;
        this.collapsed = false;
        this.character = "";
        this.possibleCharacters = [];
        this.updated = 0;
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
        // if (!this.collapsed)
        //     text(random(this.possibleCharacters), this.pos.x + this.side / 2, this.pos.y + this.side / 2);
        // else
        text(this.character, this.pos.x + this.side / 2, this.pos.y + this.side / 2);

        if (this.number) {
            textAlign(LEFT, TOP);
            textSize(this.side / 4);
            text(this.number, this.pos.x + this.side / 12, this.pos.y + this.side / 12);
        }
        pop();
    }

    collapse(character) {
        this.possibleCharacters = [character];
        this.character = character;
        this.collapsed = true;
        this.updated = true;

        grid.queue.push(this);
        grid.dfsUpdate();
    }
}