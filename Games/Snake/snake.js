var s
var scl = 40
var food

function setup() {
  createCanvas(601, 601)
  frameRate(8)
  s = new snake()
  pickLocation()
}

function draw() {
  background(0, 100, 0)

  push()
  stroke(0, 5)
  grid(width / scl, height / scl, scl, scl)
  pop()

  if (s.eat(food)) {
    pickLocation()
  }
  s.update()

  fill(255, 0, 0)
  rect(food.x, food.y, scl, scl)

  s.show()
  s.death()
}

function pickLocation() {
  var cols = floor(width / scl)
  var rows = floor(height / scl)
  var posx = floor(random(cols))
  var posy = floor(random(rows))

  var allowed = 1
  for (var i = 0; i < s.tail.length; i++) {
    if (posx * scl == s.tail[i].x && posy * scl == s.tail[i].y) {
      allowed = 0
    }
  }
  if (allowed == 1) {
    food = createVector(posx, posy)
    food.mult(scl)
  } else {
    pickLocation()
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    if (s.yspeed != 1) {
      s.dir(0, -1)
    }
  } else if (keyCode == DOWN_ARROW) {
    if (s.yspeed != -1) {
      s.dir(0, 1)
    }
  } else if (keyCode == RIGHT_ARROW) {
    if (s.xspeed != -1) {
      s.dir(1, 0)
    }
  } else if (keyCode == LEFT_ARROW) {
    if (s.xspeed != 1) {
      s.dir(-1, 0)
    }
  }
}

// cheats
// function mousePressed() {
//   s.total++
// }

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

function snake() {
  this.x = (width - 1) / 2 - scl / 2
  this.y = (height - 1) / 2 - scl / 2
  this.xspeed = 0
  this.yspeed = 0
  this.total = 0
  this.tail = []

  this.update = function() {
    if (this.total == this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1]
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y)
    this.x += this.xspeed * scl
    this.y += this.yspeed * scl
  }

  this.show = function() {
    fill(255)
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl)
    }
    fill(200)
    rect(this.x, this.y, scl, scl)

    push()
    fill(0)
    textSize(30)
    textAlign(CENTER)
    text(this.total + 1, width - 50, 50)
    pop()
  }

  this.dir = function(x, y) {
    this.xspeed = x
    this.yspeed = y
  }

  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y)
    if (d == 0) {
      this.total++
      return true
    } else {
      return false
    }
  }

  this.death = function() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i]
      var d = dist(this.x, this.y, pos.x, pos.y)
      if (d < 1) {
        lose()
      }
    }

    if (this.x > width - scl || this.x < 0 || this.y > height - scl || this.y < 0) {
      lose()
    }
  }
}
