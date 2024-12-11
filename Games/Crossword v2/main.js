function preload() {
    data = loadJSON("clues.json");
    frequencies = loadJSON("frequencies.json");
}

function setup() {
    gridWidth = 9;
    gridHeight = 9;
    side = 40;

    generate = false;
    alphabet = [];
    for (let i = 0; i < 26; i++)
        alphabet.push(char(65 + i));

    createCanvas(gridWidth * side, gridHeight * side);

    grid = new Grid(gridWidth, gridHeight, side);
    grid.updateNumbers();
}

function draw() {
    if (generate) {
        res = grid.getMinEntropyCell();
        if (res[0])
            res[0].collapse(res[1]);
        else
            generate = false;
    }

    grid.show();
}

function mouseClicked() {
    grid.update();
}

function keyPressed() {
    if (keyCode == ENTER) {
        grid.setupEntropy();
        generate = true;
    }
}