function setup() {
    createCanvas(600, 600)
    create_grid()
    len = width / 4
    points = 0

    textSize(len / 2)
    textAlign(CENTER, CENTER)
}

function draw() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            grid[i][j].show()
}

function create_grid() {
    grid = matrix(4, 4)
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            grid[i][j] = new Cell(i, j)

    add_tile()
}

class Cell {
    constructor(i, j) {
        this.value = 0
        this.pos = createVector(i, j)
    }

    show() {
        stroke(0)
        fill(255, 255, map(log_b(2, this.value), 0, 10, 255, 0))
        rect(this.pos.x * len, this.pos.y * len, len - 1, len - 1)

        if (this.value != 0) {
            noStroke()
            fill(0)
            text(this.value, this.pos.x * len + len / 2, this.pos.y * len + len / 2 + len / 25)
        }
    }
}

function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        change = false
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                if (grid[i][j].value != 0) {
                    var index = i
                    while (index >= 0) {
                        if (index == 0) {
                            index = -1
                        } else {
                            if (grid[index][j].value != grid[index - 1][j].value && grid[index - 1][j].value != 0) {
                                index = -1
                            } else if (grid[index][j].value == grid[index - 1][j].value) {
                                grid[index][j].value = 0
                                grid[index - 1][j].value *= 2
                                points += grid[index - 1][j].value
                                index--
                                change = true
                            } else {
                                grid[index - 1][j].value = grid[index][j].value
                                grid[index][j].value = 0
                                index--
                                change = true
                            }
                        }
                    }
                }
            }
        }

        if (change)
            add_tile()
    } else if (keyCode == UP_ARROW) {
        change = false
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (grid[i][j].value != 0) {
                    var index = j
                    while (index >= 0) {
                        if (index == 0) {
                            index = -1
                        } else {
                            if (grid[i][index].value != grid[i][index - 1].value && grid[i][index - 1].value != 0) {
                                index = -1
                            } else if (grid[i][index].value == grid[i][index - 1].value) {
                                grid[i][index].value = 0
                                grid[i][index - 1].value *= 2
                                points += grid[i][index - 1].value
                                index--
                                change = true
                            } else {
                                grid[i][index - 1].value = grid[i][index].value
                                grid[i][index].value = 0
                                index--
                                change = true
                            }
                        }
                    }
                }
            }
        }

        if (change)
            add_tile()
    } else if (keyCode == RIGHT_ARROW) {
        change = false
        for (var j = 0; j < 4; j++) {
            for (var i = 3; i >= 0; i--) {
                if (grid[i][j].value != 0) {
                    var index = i
                    while (index < 4) {
                        if (index == 3) {
                            index = 4
                        } else {
                            if (grid[index][j].value != grid[index + 1][j].value && grid[index + 1][j].value != 0) {
                                index = 4
                            } else if (grid[index][j].value == grid[index + 1][j].value) {
                                grid[index][j].value = 0
                                grid[index + 1][j].value *= 2
                                points += grid[index + 1][j].value
                                index++
                                change = true
                            } else {
                                grid[index + 1][j].value = grid[index][j].value
                                grid[index][j].value = 0
                                index++
                                change = true
                            }
                        }
                    }
                }
            }
        }

        if (change)
            add_tile()
    } else if (keyCode == DOWN_ARROW) {
        change = false
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j >= 0; j--) {
                if (grid[i][j].value != 0) {
                    var index = j
                    while (index < 4) {
                        if (index == 3) {
                            index = 4
                        } else {
                            if (grid[i][index].value != grid[i][index + 1].value && grid[i][index + 1].value != 0) {
                                index = 4
                            } else if (grid[i][index].value == grid[i][index + 1].value) {
                                grid[i][index].value = 0
                                grid[i][index + 1].value *= 2
                                points += grid[i][index + 1].value
                                index++
                                change = true
                            } else {
                                grid[i][index + 1].value = grid[i][index].value
                                grid[i][index].value = 0
                                index++
                                change = true
                            }
                        }
                    }
                }
            }
        }

        if (change)
            add_tile()
    }
}

function add_tile() {
    x = random([0, 1, 2, 3])
    y = random([0, 1, 2, 3])

    if (grid[x][y].value != 0) {
        return add_tile()
    } else {
        num = random([2, 2, 2, 2, 2, 2, 2, 2, 2, 4])
        grid[x][y].value = num
        return
    }
}
