function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   textAlign(CENTER, CENTER)
   pos = createVector(width / 2, height / 2)

   speed = 10
   vel = createVector(speed, 0)

   yrect_1 = 150
   yrect_2 = 150

   punt1 = 0
   punt2 = 0
}

function draw() {
   background(100, 0, 255);

   players()
   movement()
   stroke(255)
   line(width / 2, 0, width / 2, height)
   ball()
   points()
}

function players() {
   push()
   fill(255)

   rect(width - 100, yrect_2, 10, 100)

   rect(90, yrect_1, 10, 100)
   pop()
}

function ball() {
   fill(255)
   ellipse(pos.x, pos.y, 10, 10)

   pos.add(vel)

   if (pos.x < 0) {
      pos.x = width / 2
      pos.y = height / 2
      vel.x = 10
      vel.y = 0
      punt2++
      if (punt2 == 10)
         win()
   }

   if (pos.x > width) {
      pos.x = width / 2
      pos.y = height / 2
      vel.x = -10
      vel.y = 0
      punt1++
      if (punt1 == 10)
         win()
   }

   if (pos.y < 0 || pos.y > height)
      vel.y *= -1

   if (pos.y > yrect_1 && pos.y < yrect_1 + 100 && pos.x > 90 && pos.x < 100) {
      vel.x *= -1
      vel.y += map(pos.y - yrect_1, 100, 0, 4, -4)
      vel.normalize().mult(speed)
   }

   if (pos.y > yrect_2 && pos.y < yrect_2 + 100 && pos.x > width - 100 && pos.x < width - 90) {
      vel.x *= -1
      vel.y += map(pos.y - yrect_2, 100, 0, 4, -4)
      vel.normalize().mult(speed)
   }
}

function movement() {
   if (keyIsDown(87) && yrect_1 > 0)
      yrect_1 -= 6

   if (keyIsDown(83) && yrect_1 < height - 100)
      yrect_1 += 6

   if (keyIsDown(38) && yrect_1 > 0)
      yrect_2 -= 6

   if (keyIsDown(40) && yrect_1 < height - 100)
      yrect_2 += 6
}

function points() {
   textSize(255)
   fill(255, 30)
   strokeWeight(2)
   text(punt1, width / 4, height / 2)
   text(punt2, width / 4 * 3, height / 2)
}

function win() {
   push()
   rectMode(CENTER)
   stroke(0)
   strokeWeight(5)
   rect(width / 2, height / 2, 800, 400, 20)
   pop()
   fill(0)
   textSize(80)

   if (punt1 == 10) {
      text("Vittoria P1!", width / 2, height / 2 - 30)
      text(punt1 + "   -   " + punt2, width / 2, height / 2 + 80)
   }
   
   if (punt2 == 10) {
      text("Vittoria P2!", width / 2, height / 2 - 30)
      text(punt1 + "   -   " + punt2, width / 2, height / 2 + 80)
   }
   
   noLoop()
}
