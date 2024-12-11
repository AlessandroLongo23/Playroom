var numx, numy
var lato, mine
var i, j
var neighbours
var color
var liv
var shown

function setup() {
    createCanvas(windowWidth, windowHeight - 5)

    liv = 1.5
    shown = 0

    l = 50
    numx = floor(height / l)
    numy = floor(height / l)
    grid = matrix(numx, numy)
    fill(255)
    stroke(0)
    strokeWeight(2)
    textSize(2 / 3 * l)
    textAlign(CENTER)

    for (i = 0; i < numx; i++) {
        for (j = 0; j < numy; j++) {
            grid[i][j] = new Cell(i, j)
            rect(i * l, j * l, l, l)
        }
    }

    for (i = 0; i < numx; i++)
        for (j = 0; j < numy; j++)
            grid[i][j].create_bomb(i, j, color)
}

function draw() {
    var w = 1

    for (var i = 0; i < numx; i++)
        for (var j = 0; j < numy; j++)
            if (grid[i][j].state == 1 && grid[i][j].flag != 1)
                w = 0

    if (w)
        win()
}

function win() {
    push()
    rectMode(CENTER)
    stroke(0)
    strokeWeight(3)
    fill(255)
    rect(width / 2, height / 2 - 15, 350, 200, 10)

    textSize(75)
    textAlign(CENTER)
    fill(0)
    text("Vittoria!", width / 2, height / 2)
    pop()

    noLoop()
}

function mousePressed() {
    for (let i = 0; i < numx; i++) {
        for (let j = 0; j < numy; j++) {
            if (mouseX < i * l + l && mouseX > i * l && mouseY < j * l + l && mouseY > j * l) {
                if (grid[i][j].neighbours != 0 && grid[i][j].state == 0) {
                    grid[i][j].control = 1
                    push()
                    stroke(0)
                    strokeWeight(2)
                    fill(200)
                    rect(i * l, j * l, l, l)
                    shown++
                    switch (grid[i][j].neighbours) {
                        case 1:
                            fill(0, 0, 255)
                            break
                        case 2:
                            fill(0, 255, 0)
                            break
                        case 3:
                            fill(255, 0, 0)
                            break
                        case 4:
                            fill(0, 0, 150)
                            break
                        case 5:
                            fill(150, 0, 0)
                            break
                        case 6:
                            fill(0, 255, 255)
                            break
                        case 7:
                            fill(100, 100, 100)
                            break
                        case 8:
                            fill(100, 100, 0)
                            break
                    }
                    text(grid[i][j].neighbours, i * l + l / 2, j * l + l * 3 / 4)
                } else if (grid[i][j].neighbours != 0 && grid[i][j].state == 1) {
                    grid[i][j].control = 1
                    push()
                    fill(0)
                    ellipse(i * l + l / 2, j * l + l / 2, l / 2)
                    pop()

                    showAll()
                } else {
                    grid[i][j].control = 1
                    push()
                    fill(200)
                    rect(i * l, j * l, l, l)
                    pop()
                    grid[i][j].show(i, j)
                }
            }
        }
    }
}

function keyPressed() {
    if (key == 'f') {
        for (i = 0; i < numx; i++) {
            for (j = 0; j < numy; j++) {
                if (mouseX > i * l && mouseX < i * l + l && mouseY > j * l && mouseY < j * l + l && grid[i][j].flag == 0 && grid[i][j].control == 0) {
                    push()
                    stroke(0)
                    strokeWeight(2)
                    line(i * l + 2 / 3 * l, j * l + l / 4, i * l + 2 / 3 * l, j * l + l * 3 / 4)
                    fill(255, 0, 0)
                    beginShape()
                    vertex(i * l + 2 / 3 * l, j * l + l / 4)
                    vertex(i * l + 2 / 3 * l, j * l + l / 2)
                    vertex(i * l + 1 / 3 * l, j * l + l * 3 / 8)
                    endShape(CLOSE)
                    pop()

                    grid[i][j].flag = 1
                } else if (mouseX > i * l && mouseX < i * l + l && mouseY > j * l && mouseY < j * l + l && grid[i][j].flag == 1 && grid[i][j].control == 0) {
                    fill(255)
                    rect(i * l, j * l, l, l)
                    grid[i][j].flag = 0
                }
            }
        }
    }
}

class Cell {
    constructor(i, j) {
        this.x = i * l
        this.y = j * l
        this.color = 255
        this.state = 0
        this.neighbours = 0
        this.control = 0
        this.flag = 0
    }

    show(i, j) {
        this.i = i
        this.j = j

        var dx = 1
        var sx = 1
        var up = 1
        var down = 1

        if (i == 0)
            sx = 0
        if (i == numx - 1)
            dx = 0
        if (j == 0)
            up = 0
        if (j == numy - 1)
            down = 0

        for (var posx = i - sx; posx <= i + dx; posx++) {
            for (var posy = j - up; posy <= j + down; posy++) {
                if (grid[posx][posy].neighbours == 0 && grid[posx][posy].control == 0) {
                    grid[posx][posy].control = 1
                    push()
                    fill(200)
                    rect(posx * l, posy * l, l, l)
                    pop()
                    shown++
                    grid[posx][posy].show(posx, posy)
                } else if (grid[posx][posy].neighbours != 0) {
                    grid[posx][posy].control = 1
                    push()
                    fill(200)
                    rect(posx * l, posy * l, l, l)
                    switch (grid[posx][posy].neighbours) {
                        case 1:
                            fill(0, 0, 255)
                            break
                        case 2:
                            fill(0, 255, 0)
                            break
                        case 3:
                            fill(255, 0, 0)
                            break
                        case 4:
                            fill(0, 0, 150)
                            break
                        case 5:
                            fill(150, 0, 0)
                            break
                        case 6:
                            fill(0, 255, 255)
                            break
                        case 7:
                            fill(100, 100, 100)
                            break
                        case 8:
                            fill(100, 100, 0)
                            break
                    }
                    text(grid[posx][posy].neighbours, posx * l + l / 2, posy * l + l * 3 / 4)
                    pop()
                }
            }
        }
    }

    create_bomb(i, j, color) {
        this.i = i
        this.j = j
        this.color = color
        this.mine = random(0, 10)
        if (this.mine <= liv) {
            grid[i][j].state = 1
            grid[i][j].set(i, j)
        }
    }

    set(i, j) {
        this.i = i
        this.j = j

        var dx = 1
        var sx = 1
        var up = 1
        var down = 1

        if (i == 0)
            sx = 0
        if (i == numx - 1)
            dx = 0
        if (j == 0)
            up = 0
        if (j == numy - 1)
            down = 0

        for (var posx = i - sx; posx <= i + dx; posx++)
            for (var posy = j - up; posy <= j + down; posy++)
                grid[posx][posy].neighbours += 1
    }
}

function showAll() {
    for (i = 0; i < numx; i++) {
        for (j = 0; j < numy; j++) {
            if (grid[i][j].state == 0 && grid[i][j].neighbours != 0) {
                grid[i][j].control = 1
                push()
                fill(200)
                rect(i * l, j * l, l, l)
                switch (grid[i][j].neighbours) {
                    case 1:
                        fill(0, 0, 255)
                        break
                    case 2:
                        fill(0, 255, 0)
                        break
                    case 3:
                        fill(255, 0, 0)
                        break
                    case 4:
                        fill(0, 0, 150)
                        break
                    case 5:
                        fill(150, 0, 0)
                        break
                    case 6:
                        fill(0, 255, 255)
                        break
                    case 7:
                        fill(100, 100, 100)
                        break
                    case 8:
                        fill(100, 100, 0)
                        break
                }
                text(grid[i][j].neighbours, i * l + l / 2, j * l + l * 3 / 4)
                pop()
            } else if (grid[i][j].state == 1) {
                grid[i][j].control = 1
                push()
                fill(0)
                ellipse(i * l + l / 2, j * l + l / 2, l / 2)
                pop()
            } else {
                grid[i][j].control = 1
                push()
                fill(200)
                rect(i * l, j * l, l, l)
                pop()
            }
            noLoop()
        }
    }
}