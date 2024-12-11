var posx, posy, cont, r
var vel, g, speed
var obstacles = []

function setup() {
  createCanvas(600, 600);
  posx = 50
  posy = height / 2
  g = -0.1
  vel = 0
  speed = 3
  cont = 150
  points = 0
  r = 25
}

function draw() {
  background(100, 100, 255)
  
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].move()
    obstacles[i].show()
    obstacles[i].sorpassed()
    obstacles[i].hit(posy)
  }

  ball()

  if (cont == 150) {
    let tube = new Tube(width, random(20, height - 220))
    obstacles.push(tube)
    cont = 0
  }

  cont++
  push()
  textSize(50)
  fill(255)
  text(points, width - 100, 50)
  pop()
}

function ball() {
  vel += g
  posy -= vel
  ellipse(posx, posy, 2 * r, 2 * r)

  if (posy + r > height)
    lose()
}


class Tube {
  constructor(x, h) {
    this.x = x
    this.h = h
  }

  move() {
    this.x -= speed
  }

  show() {
    push()
    fill(0, 255, 0)
    rect(this.x, 0, 75, this.h)
    rect(this.x, this.h + 200, 75, height - this.h - 200)
    rect(this.x - 5, this.h - 20, 85, 20)
    rect(this.x - 5, this.h + 200, 85, 20)
    pop()
  }

  sorpassed() {
    if (this.x < 53 && this.x > 50)
      points++
  }

  hit(posy) {
    if (50 > this.x - r && 50 < this.x + 75 + r && (posy < this.h + r || posy > this.h + 200 - r))
      lose()
  }
}


function keyPressed() {
  if (keyCode == 32)
    vel = 5
}

function lose() {
  push()
  rectMode(CENTER)
  rect(width / 2, height / 2, width / 2, 100)

  textAlign(CENTER)
  textSize(30)
  text("Game Over!", width / 2, height / 2 + 10)

  noLoop()
  pop()
}
