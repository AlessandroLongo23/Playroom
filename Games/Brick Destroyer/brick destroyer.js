var cols, rows, l
var i, j
var posx, posy, offx, r
var rectx, recty
var speedx, speedy
var delta, cont

function setup() {
  createCanvas(windowWidth, windowHeight - 1)
  colorMode(HSB)
  cols = 7
  rows = 4
  w = width / cols - 10
  h = height / rows / 4
  posx = width / 2
  posy = height - 75
  r = 5
  speedx = 0
  speedy = -5
  delta = 3
  shade = 255
  cont = 0

  blocks = matrix(cols, rows)
  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      rectx = width / cols * i + (width / cols - w) / 2
      recty = height / 2 / rows * j + (height / 2 / rows - h) / 2
      blocks[i][j] = new Block(rectx, recty, w, h, shade)
    }
  }
}

function draw() {
  background(0)

  for (i = 0; i < cols; i++) {
    for (j = 0; j < rows; j++) {
      rectx = width / cols * i + (width / cols - w) / 2
      recty = height / 2 / rows * j + (height / 2 / rows - h) / 2
      blocks[i][j].show()
      if (blocks[i][j].destroy(rectx, recty)) {
        blocks[i][j].vanish(0)
        cont++
      }
    }
  }

  player()
  ball()

  if (cont == cols * rows) {
    win()
  }
}

class Block {
  constructor(x, y, w, h, shade, strength) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.shade = shade
    this.strength = strength
    this.color = map(this.y, 0, height / 2, 0, 255)
  }

  show() {
    fill(this.color, 0, this.shade)
    rect(this.x, this.y, this.w, this.h)
  }

  vanish(shade) {
    this.shade = shade
  }

  destroy(rectx, recty) {
    if ((posx > this.x - delta - r && posx < this.x + delta - r || posx < this.x + w + delta + r && posx > this.x + w - delta + r) && posy > this.y - r && posy < this.y + h + r && this.shade == 255) {
      speedx *= -1
      return true
    }

    if ((posy > this.y - delta - r && posy < this.y + delta - r || posy < this.y + h + delta + r && posy > this.y + h - delta + r) && posx > this.x - r && posx < this.x + w + r && this.shade == 255) {
      speedy *= -1
      return true
    } else {
      return false
    }
  }
}

function player() {
  push()
  fill(255)
  stroke(0)
  rectMode(CENTER)
  rect(constrain(mouseX, 0 + width / 12, width - width / 12), height - 50, width / 6, 15)
  pop()
}

function ball() {
  push()
  fill(255)
  ellipse(posx, posy, 2 * r, 2 * r)
  pop()

  if (posx < 0 || posx > width) {
    speedx *= -1
  }

  if (posy < 0 || posy > height) {
    speedy *= -1
  }

  if (posx < mouseX + width / 12 && posx > mouseX - width / 12 && posy == height - 65) {
    offx = posx - mouseX
    speedx = map(offx, -width / 12, width / 12, -5, 5)
    speedy *= -1
  }

  if (posy > height - 2 * r) {
    lose()
  }

  posx += speedx
  posy += speedy
}

function lose() {

  //finestra game over
  push()
  rectMode(CENTER)
  fill(255)
  rect(width / 2, height / 2, width / 2, 100)

  //scritta game over
  textAlign(CENTER)
  textSize(30)
  stroke(0)
  fill(0)
  text("Game Over!", width / 2, height / 2 + 10)
  pop()

  //fermo il gioco
  noLoop()
}

function matrix(x, y) {
  var arr = new Array(x)
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(y)
  }
  return arr
}

function win() {

  //creo la finestra di vittoria
  push()
  rectMode(CENTER)
  stroke(0)
  strokeWeight(3)
  fill(255)
  rect(width / 2, height / 2 - 15, 350, 200, 10)

  //creo la scritta della vittoria
  textSize(75)
  textAlign(CENTER)
  fill(0)
  text("Vittoria!", width / 2, height / 2)
  pop()

  noLoop()
}
