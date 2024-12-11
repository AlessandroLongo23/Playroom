var numx, numy
var len
var mirrors = []
var dir, turn

function setup() {
  createCanvas(900, 450)
  numx = 18
  numy = 9
  len = width / numx
  dir = 0
  turn = 0
}

function draw() {
  background(200)
  stroke(0)
  grid(numx, numy, len, len)

  if (mouseButton == CENTER)
    dir = 1 - dir;

  for (var i = 0; i < numx; i++)
    if (mouseX >= i * len && mouseX < (i + 1) * len)
      var posx = i * len

  for (var j = 0; j < numy; j++)
    if (mouseY >= j * len && mouseY < (j + 1) * len)
      var posy = j * len

  allowed = true;
  for (var i = 0; i < mirrors.length; i++)
    if (posx == mirrors[i].pos.x && posy == mirrors[i].pos.y)
      allowed = false;

  if (allowed) {
    var m = new Mirror(posx, posy, dir, turn % 2, 1)
    mirrors.push(m)
  }

  for (var i = 0; i < mirrors.length; i++)
    mirrors[i].show()

  if (allowed == 0)
    denied(posx, posy)
  else
    mirrors.pop(m)

  var r = new Ray(-len / 2, height / 2 - len / 2)
  r.show()
}

function denied(posx, posy) {
  push()
  stroke(255, 0, 0)
  strokeWeight(3)
  noFill()
  ellipse(posx + len / 2, posy + len / 2, len / 4 * 3)
  line(posx + len / 4, posy + len / 4, posx + len * 3 / 4, posy + len * 3 / 4)
  pop()
}

function mouseWheel() {
  dir = 1 - dir;
}

class Ray {
  constructor(x, y) {
    this.pos = createVector(x, y)
  }

  show() {
    push()
    fill(255, 0, 0)
    noStroke()
    ellipse(0, height / 2, len / 3)
    pop()

    push()
    fill(0, 255, 0)
    noStroke()
    ellipse(width, height * 5 / 18, len / 3)
    pop()

    push()
    fill(0, 0, 255)
    noStroke()
    ellipse(width, height * 13 / 18, len / 3)
    pop()

    var dir = createVector(1, 0)
    var over = 0
    var start = createVector(this.pos.x, this.pos.y)
    var finish = createVector(start.x, start.y)
    while (over == 0) {
      var step = 1
      if (dir.x == 1)
        finish.x += len
      else if (dir.x == -1)
        finish.x -= len
      else if (dir.y == 1)
        finish.y += len
      else if (dir.y == -1)
        finish.y -= len

      while (step == 1) {
        for (var i = 0; i < mirrors.length; i++) {
          if (finish.x == mirrors[i].pos.x + len / 2 && finish.y == mirrors[i].pos.y) {
            if (dir.x == 1) {
              dir.x = 0
              dir.y = mirrors[i].dir == 0 ? 1 : -1;
            } else if (dir.x == -1) {
              dir.x = 0
              dir.y = mirrors[i].dir == 0 ? -1 : 1;
            } else if (dir.y == 1) {
              dir.x = mirrors[i].dir == 0 ? 1 : -1;
              dir.y = 0
            } else if (dir.y == -1) {
              dir.x = mirrors[i].dir == 0 ? -1 : 1;
              dir.y = 0
            }

            step = 0
            push()
            stroke(255, 0, 0)
            strokeWeight(2)
            line(start.x, start.y + len / 2, finish.x, finish.y + len / 2)
            pop()
            start.x = finish.x
            start.y = finish.y
          }
        }
        if (finish.x > width || finish.x < 0 || finish.y > height || finish.y < 0) {
          step = 0
          over = 1
          push()
          stroke(255, 0, 0)
          strokeWeight(2)
          line(start.x, start.y + len / 2, finish.x, finish.y + len / 2)
          pop()
        }

        if (step == 1) {
          if (dir.x == 1)
            finish.x += len
          else if (dir.x == -1)
            finish.x -= len
          else if (dir.y == 1) 
            finish.y += len
          else if (dir.y == -1)
            finish.y -= len
        }
      }
    }
    win(finish)
  }
}

function win(finish){
  if (finish.x - len / 2 == width && finish.y + len / 2 == height * 5 / 18) {
    push()
    rectMode(CENTER)
    stroke(0)
    strokeWeight(3)
    fill(255)
    rect(width / 2, height / 2 - 15, 350, 200, 10)

    textSize(50)
    textAlign(CENTER)
    noStroke()
    fill(0)
    text("Player 1 Wins!", width / 2, height / 2)
    pop()

    noLoop()
  } else if (finish.x - len / 2 == width && finish.y + len / 2 == height * 13 / 18) {
    push()
    rectMode(CENTER)
    stroke(0)
    strokeWeight(3)
    fill(255)
    rect(width / 2, height / 2 - 15, 350, 200, 10)

    textSize(50)
    textAlign(CENTER)
    noStroke()
    fill(0)
    text("Player 2 Wins!", width / 2, height / 2)
    pop()

    noLoop()
  }
}

function keyPressed() {
  if (key == 's')
    dir = 1 - dir;

  if (key == 'p') {
    for (var i = 0; i < numx; i++)
      if (mouseX >= i * len && mouseX < (i + 1) * len) 
        var posx = i * len

    for (var j = 0; j < numy; j++)
      if (mouseY >= j * len && mouseY < (j + 1) * len)
        var posy = j * len

    var allowed = true;
    for (var i = 0; i < mirrors.length; i++) {
      if (posx == mirrors[i].pos.x && posy == mirrors[i].pos.y) {
        allowed = false;
        var index = i
      }
    }

    if (allowed) {
      var m = new Mirror(posx, posy, dir, turn % 2, 0)
      mirrors.push(m)
      turn++
    } else {
      if (turn % 2 == mirrors[index].team) {
        mirrors.splice(index, 1)
        turn++
      }
    }
  }
}

function mousePressed() {
  for (var i = 0; i < numx; i++)
    if (mouseX >= i * len && mouseX < (i + 1) * len)
      var posx = i * len

  for (var j = 0; j < numy; j++)
    if (mouseY >= j * len && mouseY < (j + 1) * len)
      var posy = j * len

  var allowed = true;
  for (var i = 0; i < mirrors.length; i++) {
    if (posx == mirrors[i].pos.x && posy == mirrors[i].pos.y) {
      allowed = false;
      var index = i
    }
  }

  if (allowed) {
    var m = new Mirror(posx, posy, dir, turn % 2, 0)
    mirrors.push(m)
    turn++
  } else {
    if (turn % 2 == mirrors[index].team) {
      mirrors.splice(index, 1)
      turn++
    }
  }
}

class Mirror {
  constructor(posx, posy, dir, team, last) {
    this.pos = createVector(posx, posy)
    this.dir = dir
    this.team = team
    this.last = last
  }

  show() {
    push()
    strokeWeight(3)
    var shade = this.last == 1 ? 150 : 255;
    stroke(this.team == 0 ? color(0, 0, 255, shade) : color(0, 255, 0, shade));

    if (this.dir == 0)
      line(this.pos.x, this.pos.y, this.pos.x + len, this.pos.y + len)
    else
      line(this.pos.x + len, this.pos.y, this.pos.x, this.pos.y + len)
    
    pop()
  }
}
