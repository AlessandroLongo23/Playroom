var pacman, lives, timer, points
var tempT, tempM
var cells, walls
var energizers = []
var len = 16
var speed
var ghostsMode, ghosts = []
var coins = []

function setup() {

    createCanvas(448, 576)
    frameRate(40)
    points = 0
    timer = 0
    lives = 3

    cells = matrix(28, 36)
    for (var x = 0; x < 28; x++)
        for (var y = 0; y < 36; y++)
            cells[x][y] = new Cell(x, y)

    walls = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]

    for (var x = 0; x < 28; x++)
        for (var y = 0; y < 36; y++)
            cells[x][y].wall = walls[y][x]

    for (var x = 0; x < 28; x++)
        for (var y = 0; y < 36; y++)
            if ((x > 6 && x < 21 && y > 11 && y < 23) || (x != 6 && x != 21 && y == 17) || cells[x][y].wall)
                cells[x][y].coin = false

    cells[1][6].energizer = true
    cells[26][6].energizer = true
    cells[1][26].energizer = true
    cells[26][26].energizer = true

    pacman = new PacMan()
    speed = createVector(1, 0)

    for (var i = 0; i < 4; i++)
        ghosts[i] = new Ghost(i)

    ghostsMode = "scatter"
    tempT = false
    tempM = false
}

function draw() {
    background(0)

    for (var x = 0; x < 28; x++)
        for (var y = 0; y < 36; y++)
            cells[x][y].show()

    drawWalls()

    pacman.update()
    pacman.show()

    for (var i = 0; i < 4; i++) {
        ghosts[i].update()
        ghosts[i].show()
    }

    if (frameCount != 1) {
        timer += 1 / getFrameRate()
        if (tempT && floor(timer) == floor(tempT) + 10) {
            for (var i = 0; i < ghosts.length; i++) {
                if (ghosts[i].pos.x % 2 == 1)
                    ghosts[i].pos.x++

                if (ghosts[i].pos.y % 2 == 1)
                    ghosts[i].pos.y++
            }
            timer = tempT
            tempT = false
            ghostsMode = tempM
        }
    }

    if (floor(timer) % 25 == 0 && ghostsMode != "scatter" && !tempT) {
        ghostsMode = "scatter"
        for (var i = 0; i < ghosts.length; i++) {
            ghosts[i].speed.x *= -1
            ghosts[i].speed.y *= -1
        }
    } else if (floor(timer) % 25 == 5 && ghostsMode != "chase" && !tempT) {
        ghostsMode = "chase"
        for (var i = 0; i < ghosts.length; i++) {
            ghosts[i].speed.x *= -1
            ghosts[i].speed.y *= -1
        }
    }

    info()

    var win = true
    for (var x = 0; x < 28; x++)
        for (var y = 0; y < 36; y++)
            if (cells[x][y].coin)
                win = false

    if (win)
        win()
}

function info() {
    for (var i = 0; i < lives; i++) {
        fill(255, 255, 0)
        noStroke()
        arc(30 * (i + 1), height - 15, len, len, PI / 4, -PI / 4)
    }

    fill(255)
    noStroke()
    textAlign(CENTER)
    textSize(20)
    text("SCORE", width / 2, 25)
    textSize(15)
    text(points, width / 2, 40)
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

function reset() {
    timer = 0

    pacman = new PacMan()
    speed = createVector(1, 0)

    for (var i = 0; i < 4; i++)
        ghosts[i] = new Ghost(i)
    
    ghostsMode = "scatter"
    tempT = false
    tempM = false
}

function drawWalls() {
    strokeWeight(3)
    stroke(0, 0, 200)
    noFill()

    beginShape()
    vertex(0, 16 * len)
    vertex(5 * len, 16 * len)
    vertex(5 * len, 13 * len)
    vertex(2, 13 * len)
    vertex(2, 3 * len)
    vertex(28 * len - 4, 3 * len)
    vertex(28 * len - 4, 13 * len)
    vertex(23 * len, 13 * len)
    vertex(23 * len, 16 * len)
    vertex(28 * len, 16 * len)
    endShape()

    beginShape()
    vertex(0, 16.5 * len)
    vertex(5.5 * len, 16.5 * len)
    vertex(5.5 * len, 12.5 * len)
    vertex(2 + len / 2, 12.5 * len)
    vertex(2 + len / 2, 3.5 * len)
    vertex(13.5 * len, 3.5 * len)
    vertex(13.5 * len, 7.5 * len)
    vertex(14.5 * len, 7.5 * len)
    vertex(14.5 * len, 3.5 * len)
    vertex(27.5 * len - 4, 3.5 * len)
    vertex(27.5 * len - 4, 12.5 * len)
    vertex(22.5 * len, 12.5 * len)
    vertex(22.5 * len, 16.5 * len)
    vertex(28.5 * len, 16.5 * len)
    endShape()

    beginShape()
    vertex(0, 19 * len)
    vertex(5 * len, 19 * len)
    vertex(5 * len, 22 * len)
    vertex(2, 22 * len)
    vertex(2, 34 * len)
    vertex(28 * len - 4, 34 * len)
    vertex(28 * len - 4, 22 * len)
    vertex(23 * len, 22 * len)
    vertex(23 * len, 19 * len)
    vertex(28 * len, 19 * len)
    endShape()

    beginShape()
    vertex(0, 18.5 * len)
    vertex(5.5 * len, 18.5 * len)
    vertex(5.5 * len, 22.5 * len)
    vertex(2 + len / 2, 22.5 * len)
    vertex(2 + len / 2, 27.5 * len)
    vertex(2.5 * len, 27.5 * len)
    vertex(2.5 * len, 28.5 * len)
    vertex(2 + len / 2, 28.5 * len)
    vertex(2 + len / 2, 33.5 * len)
    vertex(27.5 * len - 4, 33.5 * len)
    vertex(27.5 * len - 4, 28.5 * len)
    vertex(25.5 * len, 28.5 * len)
    vertex(25.5 * len, 27.5 * len)
    vertex(27.5 * len - 4, 27.5 * len)
    vertex(27.5 * len - 4, 22.5 * len)
    vertex(22.5 * len, 22.5 * len)
    vertex(22.5 * len, 18.5 * len)
    vertex(28 * len, 18.5 * len)
    endShape()

    beginShape()
    vertex(7.5 * len, 9.5 * len)
    vertex(8.5 * len, 9.5 * len)
    vertex(8.5 * len, 12.5 * len)
    vertex(11.5 * len, 12.5 * len)
    vertex(11.5 * len, 13.5 * len)
    vertex(8.5 * len, 13.5 * len)
    vertex(8.5 * len, 16.5 * len)
    vertex(7.5 * len, 16.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(7.5 * len, 9.5 * len)
    vertex(8.5 * len, 9.5 * len)
    vertex(8.5 * len, 12.5 * len)
    vertex(11.5 * len, 12.5 * len)
    vertex(11.5 * len, 13.5 * len)
    vertex(8.5 * len, 13.5 * len)
    vertex(8.5 * len, 16.5 * len)
    vertex(7.5 * len, 16.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(10.5 * len, 9.5 * len)
    vertex(17.5 * len, 9.5 * len)
    vertex(17.5 * len, 10.5 * len)
    vertex(14.5 * len, 10.5 * len)
    vertex(14.5 * len, 13.5 * len)
    vertex(13.5 * len, 13.5 * len)
    vertex(13.5 * len, 10.5 * len)
    vertex(10.5 * len, 10.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(19.5 * len, 9.5 * len)
    vertex(20.5 * len, 9.5 * len)
    vertex(20.5 * len, 16.5 * len)
    vertex(19.5 * len, 16.5 * len)
    vertex(19.5 * len, 13.5 * len)
    vertex(16.5 * len, 13.5 * len)
    vertex(16.5 * len, 12.5 * len)
    vertex(19.5 * len, 12.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(10.5 * len, 21.5 * len)
    vertex(17.5 * len, 21.5 * len)
    vertex(17.5 * len, 22.5 * len)
    vertex(14.5 * len, 22.5 * len)
    vertex(14.5 * len, 25.5 * len)
    vertex(13.5 * len, 25.5 * len)
    vertex(13.5 * len, 22.5 * len)
    vertex(10.5 * len, 22.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(10.5 * len, 27.5 * len)
    vertex(17.5 * len, 27.5 * len)
    vertex(17.5 * len, 28.5 * len)
    vertex(14.5 * len, 28.5 * len)
    vertex(14.5 * len, 31.5 * len)
    vertex(13.5 * len, 31.5 * len)
    vertex(13.5 * len, 28.5 * len)
    vertex(10.5 * len, 28.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(22.5 * len, 24.5 * len)
    vertex(25.5 * len, 24.5 * len)
    vertex(25.5 * len, 25.5 * len)
    vertex(23.5 * len, 25.5 * len)
    vertex(23.5 * len, 28.5 * len)
    vertex(22.5 * len, 28.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(2.5 * len, 24.5 * len)
    vertex(5.5 * len, 24.5 * len)
    vertex(5.5 * len, 28.5 * len)
    vertex(4.5 * len, 28.5 * len)
    vertex(4.5 * len, 25.5 * len)
    vertex(2.5 * len, 25.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(2.5 * len, 30.5 * len)
    vertex(7.5 * len, 30.5 * len)
    vertex(7.5 * len, 27.5 * len)
    vertex(8.5 * len, 27.5 * len)
    vertex(8.5 * len, 30.5 * len)
    vertex(11.5 * len, 30.5 * len)
    vertex(11.5 * len, 31.5 * len)
    vertex(2.5 * len, 31.5 * len)
    endShape(CLOSE)

    beginShape()
    vertex(16.5 * len, 30.5 * len)
    vertex(19.5 * len, 30.5 * len)
    vertex(19.5 * len, 27.5 * len)
    vertex(20.5 * len, 27.5 * len)
    vertex(20.5 * len, 30.5 * len)
    vertex(25.5 * len, 30.5 * len)
    vertex(25.5 * len, 31.5 * len)
    vertex(16.5 * len, 31.5 * len)
    endShape(CLOSE)

    rect(2.5 * len, 5.5 * len, 3 * len, 2 * len)
    rect(2.5 * len, 9.5 * len, 3 * len, 1 * len)
    rect(7.5 * len, 5.5 * len, 4 * len, 2 * len)
    rect(22.5 * len, 5.5 * len, 3 * len, 2 * len)
    rect(16.5 * len, 5.5 * len, 4 * len, 2 * len)
    rect(22.5 * len, 9.5 * len, 3 * len, 1 * len)
    rect(7.5 * len, 18.5 * len, 1 * len, 4 * len)
    rect(7.5 * len, 24.5 * len, 4 * len, 1 * len)
    rect(19.5 * len, 18.5 * len, 1 * len, 4 * len)
    rect(16.5 * len, 24.5 * len, 4 * len, 1 * len)

    rect(10.5 * len, 15.5 * len, 7 * len, 4 * len)
    rect(11 * len, 16 * len, 6 * len, 3 * len)
    strokeWeight(4)
    stroke(0)
    fill(255)
    rect(13 * len, 15 * len + 9, 2 * len, 8)

    strokeWeight(1)
}

function keyPressed() {
    if (keyCode == 38)
        speed = createVector(0, -1)
    if (keyCode == 40)
        speed = createVector(0, 1)
    if (keyCode == 39)
        speed = createVector(1, 0)
    if (keyCode == 37)
        speed = createVector(-1, 0)
}

class PacMan {
    constructor() {
        this.pos = createVector(14 * len, 26.5 * len)
        this.speed = createVector(1, 0)
    }

    show() {
        push()
        fill(255, 255, 0)
        noStroke()

        translate(this.pos.x, this.pos.y)
        if (this.speed.x == -1)
            rotate(PI)
        else if (this.speed.y == -1)
            rotate(3 * PI / 2)
        else if (this.speed.y == 1)
            rotate(PI / 2)
        
        if (this.speed.x == 0 && this.speed.y == 0)
            ellipse(0, 0, len * 1.5)
        else
            arc(0, 0, len * 1.5, len * 1.5, abs(4 * timer % 1 - 1 / 2) * PI / 3 * 2, abs(4 * timer % 1 - 1 / 2) * -PI / 3 * 2)
        pop()
    }

    update() {
        if (this.pos.x > width - 2 && this.speed.x == 1)
            this.pos.x = 0
        else if (this.pos.x < 0 && this.speed.x == -1) 
            this.pos.x = width - 2
        
        if (this.pos.x < width - len && this.pos.x > len) {
            if (this.pos.x % len == len / 2 && this.pos.y % len == len / 2) {
                if (!cells[(this.pos.x - len / 2) / len + speed.x][(this.pos.y - len / 2) / len + speed.y].wall) {
                    var temp = this.speed
                    this.speed = speed
                }

                if (this.speed.x == 1 && cells[(this.pos.x - len / 2) / len + 1][(this.pos.y - len / 2) / len].wall)
                    this.speed = createVector(0, 0);
                if (this.speed.x == -1 && cells[(this.pos.x - len / 2) / len - 1][(this.pos.y - len / 2) / len].wall)
                    this.speed = createVector(0, 0);
                if (this.speed.y == 1 && cells[(this.pos.x - len / 2) / len][(this.pos.y - len / 2) / len + 1].wall)
                    this.speed = createVector(0, 0);
                if (this.speed.y == -1 && cells[(this.pos.x - len / 2) / len][(this.pos.y - len / 2) / len - 1].wall)
                    this.speed = createVector(0, 0);
            } else {
                if ((speed.x == this.speed.x && speed.y == -this.speed.y) || (speed.x == -this.speed.x && speed.y == this.speed.y))
                    this.speed = speed
            }
        }

        if (cells[floor(this.pos.x / len)][floor(this.pos.y / len)].coin) {
            cells[floor(this.pos.x / len)][floor(this.pos.y / len)].coin = false
            points += 10
        }

        if (cells[floor(this.pos.x / len)][floor(this.pos.y / len)].energizer) {
            tempT = timer
            tempM = ghostsMode
            ghostsMode = "frightened"
            for (var i = 0; i < ghosts.length; i++) {
                ghosts[i].speed.x *= -1
                ghosts[i].speed.y *= -1
            }
            cells[floor(this.pos.x / len)][floor(this.pos.y / len)].energizer = false
        }

        this.pos.add(this.speed)
        this.pos.add(this.speed)

        for (var i = 0; i < ghosts.length; i++) {
            if (dist(this.pos.x, this.pos.y, ghosts[i].pos.x, ghosts[i].pos.y) < len) {
                if (ghostsMode == "frightened") {
                    points += 50
                    switch (i) {
                        case 0:
                            ghosts[i].pos = createVector(14 * len, 17.5 * len)
                            break;
                        case 1:
                            ghosts[i].pos = createVector(12 * len, 17.5 * len)
                            break;
                        case 2:
                            ghosts[i].pos = createVector(14 * len, 17.5 * len)
                            break;
                        case 3:
                            ghosts[i].pos = createVector(16 * len, 17.5 * len)
                            break;
                    }
                    ghosts[i].speed = createVector()
                } else {
                    if (lives > 0) {
                        reset()
                        lives--
                    } else {
                        setup()
                    }
                }
            }
        }
    }
}

class Ghost {
    constructor(ghost) {
        this.ghost = ghost
        if (this.ghost == 0)
            this.speed = createVector(1, 0)
        else
            this.speed = createVector()

        this.target = createVector()
        switch (this.ghost) {
            case 0:
                this.pos = createVector(14 * len, 14.5 * len)
                this.color = color(255, 0, 0)
                break;
            case 1:
                this.pos = createVector(12 * len, 17.5 * len)
                this.color = color(100, 255, 255)
                break;
            case 2:
                this.pos = createVector(14 * len, 17.5 * len)
                this.color = color(255, 200, 200)
                break;
            case 3:
                this.pos = createVector(16 * len, 17.5 * len)
                this.color = color(255, 180, 0)
                break;
        }
    }

    show() {
        fill(ghostsMode == "frightened" ? color(0, 0, 200) : this.color)

        noStroke()
        ellipse(this.pos.x, this.pos.y, len * 1.5)
        beginShape()
        vertex(this.pos.x - len / 4 * 3, this.pos.y)
        vertex(this.pos.x - len / 4 * 3, this.pos.y + len / 5 * 4)
        vertex(this.pos.x - 12, this.pos.y + 15)
        vertex(this.pos.x - 8, this.pos.y + 11)
        vertex(this.pos.x - 4, this.pos.y + 15)
        vertex(this.pos.x - 1, this.pos.y + 10)
        vertex(this.pos.x + 1, this.pos.y + 10)
        vertex(this.pos.x + 4, this.pos.y + 15)
        vertex(this.pos.x + 8, this.pos.y + 11)
        vertex(this.pos.x + 12, this.pos.y + 15)
        vertex(this.pos.x + len / 4 * 3, this.pos.y + len / 5 * 4)
        vertex(this.pos.x + len / 4 * 3, this.pos.y)
        endShape()

        fill(255)
        ellipse(this.pos.x - (6 - this.speed.x * 2), this.pos.y + this.speed.y * 2, 7, 9)
        ellipse(this.pos.x + (6 + this.speed.x * 2), this.pos.y + this.speed.y * 2, 7, 9)
        fill(50, 50, 255)

        ellipse(this.pos.x - (6 - this.speed.x * 4), this.pos.y + this.speed.y * 4, 5)
        ellipse(this.pos.x + (6 + this.speed.x * 4), this.pos.y + this.speed.y * 4, 5)
    }

    selectTarget() {
        switch (this.ghost) {
            case 0:
                if (ghostsMode == "scatter") {
                    this.target = createVector(24.5 * len, 0.5 * len)
                } else if (ghostsMode == "chase") {
                    this.target = createVector(pacman.pos.x, pacman.pos.y)
                }
                break;
            case 1:
                if (ghostsMode == "scatter") {
                    this.target = createVector(2.5 * len, 0.5 * len)
                } else if (ghostsMode == "chase") {
                    this.target = createVector(pacman.pos.x + 4 * pacman.speed.x * len, pacman.pos.y + 4 * pacman.speed.y * len)
                }
                break;
            case 2:
                if (ghostsMode == "scatter") {
                    this.target = createVector(27.5 * len, 35.5 * len)
                } else if (ghostsMode == "chase") {
                    this.target = createVector(round(ghosts[0].pos.x) + round(pacman.pos.x - ghosts[0].pos.x) * 2, round(ghosts[0].pos.y) + round(pacman.pos.y - ghosts[0].pos.y) * 2)
                }
                break;
            case 3:
                if (ghostsMode == "scatter") {
                    this.target = createVector(0.5 * len, 35.5 * len)
                } else if (ghostsMode == "chase") {
                    if (dist(this.pos.x, this.pos.y, pacman.pos.x, pacman.pos.y) < len * 8) {
                        this.target = createVector(0.5 * len, 35.5 * len)
                    } else {
                        this.target = ghosts[0].target
                    }
                }
                break;
        }
    }

    update() {
        this.selectTarget()

        if (
            this.pos.x > 11 * len &&
            this.pos.x < 17 * len &&
            this.pos.y > 17 * len &&
            this.pos.y < 20 * len &&
            floor(timer % 4) == this.ghost &&
            ghostsMode != "frightened"
        ) {
            this.pos = createVector(14 * len, 14.5 * len)
            this.speed = createVector(1, 0)
        }

        if (this.pos.x > width - 2 && this.speed.x == 1)
            this.pos.x = 0
        else if (this.pos.x < 0 && this.speed.x == -1)
            this.pos.x = width - 2

        if (this.pos.x % len == len / 2 && this.pos.y % len == len / 2) {
            if (ghostsMode == "frightened") {
                var dir = []
                if (this.pos.x < width - len && this.pos.x > len) {
                    if (this.speed.x != -1 && !cells[(this.pos.x - len / 2) / len + 1][(this.pos.y - len / 2) / len].wall)
                        dir.push(createVector(1, 0))
                    if (this.speed.x != 1 && !cells[(this.pos.x - len / 2) / len - 1][(this.pos.y - len / 2) / len].wall)
                        dir.push(createVector(-1, 0))
                    if (this.speed.y != -1 && !cells[(this.pos.x - len / 2) / len][(this.pos.y - len / 2) / len + 1].wall)
                        dir.push(createVector(0, 1))
                    if (this.speed.y != 1 && !cells[(this.pos.x - len / 2) / len][(this.pos.y - len / 2) / len - 1].wall)
                        dir.push(createVector(0, -1))

                    this.speed = random(dir)
                }
            } else {
                if (this.pos.x < width - len && this.pos.x > len) {
                    var d = 10000
                    var speed
                    if (!cells[(this.pos.x - len / 2) / len + 1][(this.pos.y - len / 2) / len].wall) {
                        if (dist(this.pos.x + len, this.pos.y, this.target.x, this.target.y) < d) {
                            if (this.speed.x != -1) {
                                speed = createVector(1, 0)
                                d = dist(this.pos.x + len, this.pos.y, this.target.x, this.target.y)
                            }
                        }
                    }

                    if (!cells[(this.pos.x - len / 2) / len - 1][(this.pos.y - len / 2) / len].wall) {
                        if (dist(this.pos.x - len, this.pos.y, this.target.x, this.target.y) < d) {
                            if (this.speed.x != 1) {
                                speed = createVector(-1, 0)
                                d = dist(this.pos.x - len, this.pos.y, this.target.x, this.target.y)
                            }
                        }
                    }
                    
                    if (!cells[(this.pos.x - len / 2) / len][(this.pos.y - len / 2) / len + 1].wall) {
                        if (dist(this.pos.x, this.pos.y + len, this.target.x, this.target.y) < d) {
                            if (this.speed.y != -1) {
                                speed = createVector(0, 1)
                                d = dist(this.pos.x, this.pos.y + len, this.target.x, this.target.y)
                            }
                        }
                    }
                    if (!cells[(this.pos.x - len / 2) / len][(this.pos.y - len / 2) / len - 1].wall) {
                        if (dist(this.pos.x, this.pos.y - len, this.target.x, this.target.y) < d) {
                            if (this.speed.y != 1) {
                                speed = createVector(0, -1)
                                d = dist(this.pos.x, this.pos.y - len, this.target.x, this.target.y)
                            }
                        }
                    }
                    this.speed = speed
                }
            }
        }

        this.pos.add(this.speed)

        if (ghostsMode != "frightened")
            this.pos.add(this.speed)
    }
}

class Cell {
    constructor(x, y) {
        this.pos = createVector(x * len, y * len)
        this.wall = false
        this.coin = true
        this.energizer = false
    }

    show() {
        noStroke()
        fill(0)
        rect(this.pos.x, this.pos.y, len, len)

        if (this.coin) {
            fill(255, 255, 0)
            ellipse(this.pos.x + len / 2, this.pos.y + len / 2, len / 3)
        }

        if (this.energizer) {
            fill(255, 255, 100)
            ellipse(this.pos.x + len / 2, this.pos.y + len / 2, len / 3 * 2)
        }
    }
}