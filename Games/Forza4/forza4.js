var pieces, turn
var num, length
var punt1, punt2

function setup() {
  createCanvas(500, 600)
  colorMode(HSB)
  num = 10
  length = width / num
  pieces = matrix(num, num)

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      var p = new Piece(i, j, 255, 0)
      pieces[i][j] = p
    }
  }

  turn = 0
}

function draw() {
  background(0)
  punt1 = 0
  punt2 = 0

  stroke(255)
  grid(num, num, length, length)

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      pieces[i][j].show()
    }
  }

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      push()
      strokeWeight(length / 20)
      stroke(0)
      strokeCap(ROUND)
      if (i <= num - 4) {
        horizontal(i, j)
        if (j >= 3) {
          diagonal(i, j, -1)
        }
        if (j <= num - 4) {
          diagonal(i, j, 1)
        }
      }
      if (j <= num - 4) {
        vertical(i, j)
      }
      pop()
    }
  }

  punt()
}

function diagonal(i, j, dir) {
  if (pieces[i][j].b == 255 && pieces[i][j].h == 200 &&
    pieces[i + 1][j + 1 * dir].b == 255 && pieces[i + 1][j + 1 * dir].h == 200 &&
    pieces[i + 2][j + 2 * dir].b == 255 && pieces[i + 2][j + 2 * dir].h == 200 &&
    pieces[i + 3][j + 3 * dir].b == 255 && pieces[i + 3][j + 3 * dir].h == 200) {

    punt1++
    line(i * length + length / 2, j * length + length / 2, (i + 3) * length + length / 2, (j + 3 * dir) * length + length / 2)
    push()
    strokeWeight(length / 8)
    point(i * length + length / 2, j * length + length / 2)
    point((i + 3) * length + length / 2, (j + 3 * dir) * length + length / 2)
    pop()
  } else if (pieces[i][j].b == 255 && pieces[i][j].h == 0 &&
    pieces[i + 1][j + 1 * dir].b == 255 && pieces[i + 1][j + 1 * dir].h == 0 &&
    pieces[i + 2][j + 2 * dir].b == 255 && pieces[i + 2][j + 2 * dir].h == 0 &&
    pieces[i + 3][j + 3 * dir].b == 255 && pieces[i + 3][j + 3 * dir].h == 0) {

    punt2++
    line(i * length + length / 2, j * length + length / 2, (i + 3) * length + length / 2, (j + 3 * dir) * length + length / 2)
    push()
    strokeWeight(length / 8)
    point(i * length + length / 2, j * length + length / 2)
    point((i + 3) * length + length / 2, (j + 3 * dir) * length + length / 2)
    pop()
  }
}

function horizontal(i, j) {
  if (pieces[i][j].b == 255 && pieces[i][j].h == 200 &&
    pieces[i + 1][j].b == 255 && pieces[i + 1][j].h == 200 &&
    pieces[i + 2][j].b == 255 && pieces[i + 2][j].h == 200 &&
    pieces[i + 3][j].b == 255 && pieces[i + 3][j].h == 200) {

    punt1++
    line(i * length + length / 2, j * length + length / 2, (i + 3) * length + length / 2, j * length + length / 2)
    push()
    strokeWeight(length / 8)
    point(i * length + length / 2, j * length + length / 2)
    point((i + 3) * length + length / 2, j * length + length / 2)
    pop()
  } else if (pieces[i][j].b == 255 && pieces[i][j].h == 0 &&
    pieces[i + 1][j].b == 255 && pieces[i + 1][j].h == 0 &&
    pieces[i + 2][j].b == 255 && pieces[i + 2][j].h == 0 &&
    pieces[i + 3][j].b == 255 && pieces[i + 3][j].h == 0) {

    punt2++
    line(i * length + length / 2, j * length + length / 2, (i + 3) * length + length / 2, j * length + length / 2)
    push()
    strokeWeight(length / 8)
    point(i * length + length / 2, j * length + length / 2)
    point((i + 3) * length + length / 2, j * length + length / 2)
    pop()
  }
}

function vertical(i, j) {
  if (pieces[i][j].b == 255 && pieces[i][j].h == 200 &&
    pieces[i][j + 1].b == 255 && pieces[i][j + 1].h == 200 &&
    pieces[i][j + 2].b == 255 && pieces[i][j + 2].h == 200 &&
    pieces[i][j + 3].b == 255 && pieces[i][j + 3].h == 200) {

    punt1++
    line(i * length + length / 2, j * length + length / 2, i * length + length / 2, (j + 3) * length + length / 2)
    push()
    strokeWeight(length / 8)
    point(i * length + length / 2, j * length + length / 2)
    point(i * length + length / 2, (j + 3) * length + length / 2)
    pop()
  } else if (pieces[i][j].b == 255 && pieces[i][j].h == 0 &&
    pieces[i][j + 1].b == 255 && pieces[i][j + 1].h == 0 &&
    pieces[i][j + 2].b == 255 && pieces[i][j + 2].h == 0 &&
    pieces[i][j + 3].b == 255 && pieces[i][j + 3].h == 0) {

    punt2++
    line(i * length + length / 2, j * length + length / 2, i * length + length / 2, (j + 3) * length + length / 2)
    push()
    strokeWeight(length / 8)
    point(i * length + length / 2, j * length + length / 2)
    point(i * length + length / 2, (j + 3) * length + length / 2)
    pop()
  }
}

function punt() {
  fill(51)
  rect(0, height - 100, width, 100)

  textSize(40)
  textAlign(CENTER)
  noStroke()
  fill(0)
  text("BLUE : " + punt1, 100, height - 40)
  text("RED : " + punt2, width - 100, height - 40)
}

function mousePressed() {
  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      if (mouseX > i * length && mouseX < i * length + length && mouseY > j * length && mouseY < j * length + length) {
        if (pieces[i][j].b == 0) {
          if (j < num - 1) {
            while (pieces[i][j + 1].b == 0) {
              j++
              if (j == num - 1) {
                break
              }
            }
          }
          pieces[i][j].b = 255
          if (turn == 0) {
            pieces[i][j].h = 0
            turn = 1
          } else {
            pieces[i][j].h = 200
            turn = 0
          }
        }
      }
    }
  }
}

class Piece {
  constructor(i, j, h, b) {
    this.x = i * length;
    this.y = j * length
    this.h = h;
    this.b = b;
  }

  show() {
    stroke(255)
    fill(this.h, 255, this.b)
    rect(this.x, this.y, length, length)
  }
}
