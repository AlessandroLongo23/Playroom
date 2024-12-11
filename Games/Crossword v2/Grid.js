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

        this.queue = [];
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
                grid.cells[x][y].reset();

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

    setupEntropy() {
        for (let i = 0; i < this.horizontals.length; i++) {
            let word = this.horizontals[i];

            word.resetCharacterCount();

            let c = 0;
            for (let cell of word.cells) {
                for (let w = 0; w < data[word.len].length; w++)
                    cell.horizontalCharacterCount[unchar(data[word.len][w]["solution"].charAt(c)) - 65]++;

                for (let a = 0; a < alphabet.length; a++)
                    cell.horizontalCharacterProbability[a] = cell.horizontalCharacterCount[a] / frequencies[a] / data[word.len].length;

                c++;
            }
        }

        for (let i = 0; i < this.verticals.length; i++) {
            let word = this.verticals[i];

            word.resetCharacterCount();

            let c = 0;
            for (let cell of word.cells) {
                for (let w = 0; w < data[word.len].length; w++)
                    cell.verticalCharacterCount[unchar(data[word.len][w]["solution"].charAt(c)) - 65]++;

                for (let a = 0; a < alphabet.length; a++)
                    cell.verticalCharacterProbability[a] = cell.verticalCharacterCount[a] / frequencies[a] / data[word.len].length;

                c++;
            }
        }

        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (!this.cells[x][y].black) {
                    if (this.cells[x][y].horizontalIndex != -1 && this.cells[x][y].verticalIndex != -1) {
                        for (let c = 0; c < alphabet.length; c++)
                            this.cells[x][y].charactersProbabilities[c] = this.cells[x][y].horizontalCharacterProbability[c] * this.cells[x][y].verticalCharacterProbability[c];
                    } else if (this.cells[x][y].horizontalIndex == -1) {
                        for (let c = 0; c < alphabet.length; c++)
                            this.cells[x][y].charactersProbabilities[c] = this.cells[x][y].verticalCharacterProbability[c];
                    } else {
                        for (let c = 0; c < alphabet.length; c++)
                            this.cells[x][y].charactersProbabilities[c] = this.cells[x][y].horizontalCharacterProbability[c];
                    }

                    for (let c = 0; c < alphabet.length; c++)
                        if (this.cells[x][y].charactersProbabilities[c] > 0)
                            this.cells[x][y].possibleCharacters.push(alphabet[c]);
                }
            }
        }
    }

    dfsUpdate() {
        if (this.queue.length != 0) {
            let pivot = this.queue.splice(0, 1)[0];

            if (pivot.horizontalIndex != -1) {
                let word = this.horizontals[pivot.horizontalIndex];

                word.updatePool();

                for (let c = 0; c < word.len; c++) {
                    let cell = this.cells[word.pos.x + c][word.pos.y];
                    if (!cell.collapsed) {
                        for (let w = 0; w < word.pool.length; w++)
                            cell.horizontalCharacterCount[unchar(word.pool[w]["solution"].charAt(c)) - 65]++;

                        for (let a = 0; a < alphabet.length; a++)
                            cell.horizontalCharacterProbability[a] = cell.horizontalCharacterCount[a] / word.pool.length;
                    }
                }
            }

            if (pivot.verticalIndex != -1) {
                let word = this.verticals[pivot.verticalIndex];

                word.updatePool();

                for (let c = 0; c < word.len; c++) {
                    let cell = this.cells[word.pos.x][word.pos.y + c];
                    if (!cell.collapsed) {
                        for (let w = 0; w < word.pool.length; w++)
                            cell.verticalCharacterCount[unchar(word.pool[w]["solution"].charAt(c)) - 65]++;

                        for (let a = 0; a < alphabet.length; a++)
                            cell.verticalCharacterProbability[a] = cell.verticalCharacterCount[a] / word.pool.length;
                    }
                }
            }

            pivot.updated = true;

            if (
                pivot.indexes.y > 0 &&
                !this.cells[pivot.indexes.x][pivot.indexes.y - 1].black &&
                !this.cells[pivot.indexes.x][pivot.indexes.y - 1].updated
            )
                this.queue.push(this.cells[pivot.indexes.x][pivot.indexes.y - 1]);

            if (
                pivot.indexes.x > 0 &&
                !this.cells[pivot.indexes.x - 1][pivot.indexes.y].black &&
                !this.cells[pivot.indexes.x - 1][pivot.indexes.y].updated
            )
                this.queue.push(this.cells[pivot.indexes.x - 1][pivot.indexes.y]);

            if (
                pivot.indexes.y < this.gridHeight - 1 &&
                !this.cells[pivot.indexes.x][pivot.indexes.y + 1].black &&
                !this.cells[pivot.indexes.x][pivot.indexes.y + 1].updated
            )
                this.queue.push(this.cells[pivot.indexes.x][pivot.indexes.y + 1]);

            if (
                pivot.indexes.x < this.gridWidth - 1 &&
                !this.cells[pivot.indexes.x + 1][pivot.indexes.y].black &&
                !this.cells[pivot.indexes.x + 1][pivot.indexes.y].updated
            )
                this.queue.push(this.cells[pivot.indexes.x + 1][pivot.indexes.y]);

            this.dfsUpdate();
        } else
            this.updateProbabilites();
    }

    updateProbabilites() {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (this.cells[x][y].horizontalIndex != -1 && this.cells[x][y].verticalIndex != -1) {
                    for (let c = 0; c < alphabet.length; c++)
                        this.cells[x][y].charactersProbabilities[c] = this.cells[x][y].horizontalCharacterProbability[c] * this.cells[x][y].verticalCharacterProbability[c];
                } else if (this.cells[x][y].horizontalIndex == -1) {
                    for (let c = 0; c < alphabet.length; c++)
                        this.cells[x][y].charactersProbabilities[c] = this.cells[x][y].verticalCharacterProbability[c];
                } else {
                    for (let c = 0; c < alphabet.length; c++)
                        this.cells[x][y].charactersProbabilities[c] = this.cells[x][y].horizontalCharacterProbability[c];
                }

                for (let c = 0; c < alphabet.length; c++)
                    this.cells[x][y].charactersProbabilities[c] /= frequencies[c];
            }
        }
    }

    getMinEntropyCell() {
        let minEntropyCell;
        let maxChance = 0;
        let maxChanceCharacter;

        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (!this.cells[x][y].black && !this.cells[x][y].collapsed) {
                    this.cells[x][y].updated = 0;
                    for (let c = 0; c < alphabet.length; c++) {
                        if (this.cells[x][y].charactersProbabilities[c] > maxChance) {
                            minEntropyCell = this.cells[x][y];
                            maxChance = this.cells[x][y].charactersProbabilities[c];
                            maxChanceCharacter = alphabet[c];
                        }
                    }
                }
            }
        }

        return [minEntropyCell, maxChanceCharacter];
    }
}