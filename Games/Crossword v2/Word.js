class Word {
    constructor(index, number, pos, dir, len) {
        this.index = index;
        this.number = number;
        this.pos = pos;
        this.dir = dir;
        this.len = len;

        this.cells = [];
        for (let i = 0; i < len; i++)
            this.cells.push(grid.cells[pos.x + abs(dir - 1) * i][pos.y + dir * i]);

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

    resetCharacterCount() {
        for (let i = 0; i < this.len; i++) {
            if (this.dir == 0) {
                grid.cells[this.pos.x + i][this.pos.y].horizontalCharacterCount = [];
                for (let a = 0; a < alphabet.length; a++)
                    grid.cells[this.pos.x + i][this.pos.y].horizontalCharacterCount.push(0);
            } else {
                grid.cells[this.pos.x][this.pos.y + i].verticalCharacterCount = [];
                for (let a = 0; a < alphabet.length; a++)
                    grid.cells[this.pos.x][this.pos.y + i].verticalCharacterCount.push(0);
            }
        }
    }

    updatePool() {
        let temp = [];
        for (let j = 0; j < this.len; j++)
            temp.push([...grid.cells[this.pos.x + abs(this.dir - 1) * j][this.pos.y + this.dir * j].possibleCharacters]);

        for (let j = this.pool.length - 1; j >= 0; j--) {
            for (let c = 0; c < this.len; c++) {
                if (!temp[c].includes(this.pool[j]["solution"].charAt(c))) {
                    this.pool.splice(j, 1);
                    c = this.len;
                }
            }
        }

        if (this.pool.length == 0) {
            console.log("error");
            noLoop();
        }
    }
}