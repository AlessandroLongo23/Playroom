var moltiplicatore
var points

function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   rectMode(CENTER)

   obstacles = []

   level = 1
   load_level()

   altezza = 0
   speedh = 3
   cont = 0
   contliv = 1
   tot_points = 0
   conth = 0
}

function draw() {
   background(0, 118, 0)

   for (var i = 0; i < obstacles.length; i++) {
      obstacles[i].update()
      obstacles[i].show()
   }

   hole.show()

   ball.update()
   ball.show()

   info()

   power_bar()

   if (level > 5)
      end_game()

   conth++
}

class Ball {
   constructor(pos) {
      this.pos = pos
      this.rad = 15
      this.vel = createVector()
      this.col = color(255)
   }

   update() {
      this.vel.x = this.vel.x - (1 / 40 * this.vel.x)
      this.vel.y = this.vel.y - (1 / 40 * this.vel.y)

      this.pos.add(this.vel)

      if (this.pos.x - this.rad / 2 < 0 || this.pos.x + this.rad / 2 > width)
         this.vel.x *= -1

      if (this.pos.y - this.rad / 2 < 0 || this.pos.y + this.rad / 2 > height)
         this.vel.y *= -1

      this.check_hole()
   }

   check_hole() {
      if (dist(this.pos.x, this.pos.y, hole.pos.x, hole.pos.y) < hole.rad) {
         points = round(100 / cont)

         this.vel = createVector()
         this.pos = hole.pos.copy()

         push()
         stroke(0)
         strokeWeight(3)
         rect(width / 2, height / 2 - 15, 300, 300, 10)

         rect(width / 2 + 75, height / 2 - 15, 100, 60, 5)
         pop()

         push()
         textSize(50)
         textAlign(CENTER)
         fill(0)
         text("points:", width / 2 - 65, height / 2 + 5)

         push()
         textSize(75)
         text("Vittoria!", width / 2, height / 2 - 75)
         pop()

         text(points, width / 2 + 75, height / 2 + 5)

         textSize(25)
         text("pemi INVIO per", width / 2, height / 2 + 65)
         text("il prossimo livello", width / 2, height / 2 + 95)
         pop()

         contliv++
      }
   }

   show() {
      this.trajectory()

      push()
      var offsetx = map(this.pos.x, 0, width, 0, this.rad / 2)
      var offsety = map(this.pos.y, 0, height, 0, this.rad / 2)
      fill(0, 100, 0)
      noStroke()
      ellipse(this.pos.x + offsetx, this.pos.y + offsety, this.rad, this.rad)
      pop()

      fill(this.col)
      ellipse(this.pos.x, this.pos.y, this.rad, this.rad)
   }

   trajectory() {
      if (this.vel.mag() < 0.1 && this.pos.y != hole.pos.y) {
         if (conth == 0)
            speedh = 3

         line(this.pos.x, this.pos.y, mouseX, mouseY)
      }
   }

   calc_vel() {
      var speed = map(hpot, 0, 300, 40, 5)

      var teta = atan2(mouseY - this.pos.y, mouseX - this.pos.x)

      this.vel.x = speed * cos(teta)
      this.vel.y = speed * sin(teta)
   }
}

class Hole {
   constructor(pos) {
      this.pos = pos
      this.rad = 30
   }

   show() {
      fill(0)
      stroke(255)
      ellipse(this.pos.x, this.pos.y, this.rad)
   }
}

class Wall {
   constructor(pos, w, h) {
      this.pos = pos
      this.w = w
      this.h = h

      this.col = color(150)
   }

   update() {
      var off = 10

      if (
         ball.pos.x > this.pos.x + this.w / 2 - off &&
         ball.pos.x < this.pos.x + this.w / 2 + off &&
         ball.pos.y > this.pos.y - this.h / 2 &&
         ball.pos.y < this.pos.y + this.h / 2
      ) {
         ball.vel.x *= -1
      }

      if (
         ball.pos.x > this.pos.x - this.w / 2 - off &&
         ball.pos.x < this.pos.x - this.w / 2 + off &&
         ball.pos.y > this.pos.y - this.h / 2 &&
         ball.pos.y < this.pos.y + this.h / 2
      ) {
         ball.vel.x *= -1
      }

      if (
         ball.pos.x > this.pos.x - this.w / 2 &&
         ball.pos.x < this.pos.x + this.w / 2 &&
         ball.pos.y > this.pos.y + this.h / 2 - off &&
         ball.pos.y < this.pos.y + this.h / 2 + off
      ) {
         ball.vel.y *= -1
      }

      if (
         ball.pos.x > this.pos.x - this.w / 2 &&
         ball.pos.x < this.pos.x + this.w / 2 &&
         ball.pos.y > this.pos.y - this.h / 2 - off &&
         ball.pos.y < this.pos.y - this.h / 2 + off
      ) {
         ball.vel.y *= -1
      }
   }

   show() {
      fill(this.col)
      rect(this.pos.x, this.pos.y, this.w, this.h, 5)
   }
}

class Pond {
   constructor(pos, w, h) {
      this.pos = pos
      this.w = w
      this.h = h
      this.col = color(100, 100, 255)
   }

   update() {
      var off = 5

      if (
         ball.pos.x > this.pos.x - this.w / 2 &&
         ball.pos.x < this.pos.x + this.w / 2 &&
         ball.pos.y > this.pos.y - this.h / 2 &&
         ball.pos.y < this.pos.y + this.h / 2
      ) {
         this.wet()
      }
   }

   show() {
      stroke(255)
      fill(this.col)
      rect(this.pos.x, this.pos.y, this.w, this.h, 5)
   }

   wet() {
      push()
      stroke(0)
      fill(255)
      rect(width / 2, height - 100, 250, 100, 10)
      pop()

      push()
      textSize(40)
      textAlign(CENTER)
      fill(0)
      text("Game Over", width / 2, height - 100)
      textSize(20)
      text("premi TAB per riprovare", width / 2, height - 65)
      pop()

      ball.vel = createVector()
      ball.col = color(150, 150, 255)

      push()
      stroke(0)
      noFill()
      rect(width - 50, height - 320, 30, 300)
      pop()
   }
}

class Portal {
   constructor(enter, exit) {
      this.enter = enter
      this.exit = exit
      this.rad = 2 * ball.rad
   }

   update() {
      if (dist(ball.pos.x, ball.pos.y, this.enter.x, this.enter.y) < this.rad)
         ball.pos = this.exit.copy()
   }

   show() {
      push()
      fill(255, 100, 0)
      stroke(255, 0, 0)
      ellipse(this.enter.x, this.enter.y, 2 * this.rad, 2 * this.rad)

      fill(0, 0, 255)
      stroke(0, 0, 100)
      ellipse(this.exit.x, this.exit.y, 2 * this.rad, 2 * this.rad)
      pop()
   }
}

function power_bar() {
   altezza += speedh
   if (altezza < 0 || altezza > 300)
      speedh *= -1

   push()
   rectMode(CORNER)
   noStroke()
   set_Gradient(width - 50, height - 20 - 300, 30, 300);

   noFill()
   stroke(255)
   rect(width - 50, height - 320, 30, 300)

   fill(0)
   rect(width - 50, height - 300 - 20, 30, altezza)
   pop()
}

function keyPressed() {
   if (keyCode == 32) {
      if (ball.vel.mag() < 0.1) {
         hpot = altezza
         ball.calc_vel()
         cont++
         conth = 0
      }
   }

   if (ball.vel.mag() > 0.1)
      speedh = 0

   if (keyCode == 9)
      setup()

   if (keyCode == 13 && contliv > level) {
      level++
      contliv = level
      tot_points += points

      load_level()
   }
}

function set_Gradient(x, y, w, h) {
   for (var i = y; i <= y + h; i++) {
      var inter = map(i, y, y + h, 0, 1)
      stroke(lerpColor(color(255, 0, 0), color(0, 255, 0), inter))
      line(x, i, x + w, i)
   }
}

function info() {
   push()
   textSize(20)
   strokeWeight(3)
   stroke(0)
   fill(255)

   text("Tiri = " + cont, 20, height - 50)
   text("Livello " + level, width - 150, 50)
   text("Punti = " + tot_points, 20, height - 100)
   pop()
}

function load_level() {
   ball = new Ball(createVector(width / 2, height - 50))
   hole = new Hole(createVector(width / 2, 100))

   switch (level) {
      case 2:
         obstacles = [
            new Wall(
               createVector(0, 2 / 3 * height - height / 12),
               2 / 3 * width, height / 6
            ),
            new Wall(
               createVector(200, 1 / 3 * height - height / 12),
               2 / 3 * height, height / 6
            )
         ]
         break
      case 3:
         obstacles = [
            new Pond(
               createVector(width / 4, height / 8 * 3),
               width / 2, height / 4
            )
         ]
         break
      case 4:
         obstacles = [
            new Wall(
               createVector(width / 3, 150),
               width / 3, 50
            ),
            new Pond(
               createVector(0, 0),
               width / 4, width / 4
            ),
            new Pond(
               createVector(width * 3 / 4, 0),
               width / 4, width / 4
            )
         ]
         break
      case 5:
         obstacles = [
            new Portal(
               createVector(50, 550),
               createVector(width - 50, 300)
            ),
            new Wall(
               createVector(0, height / 2),
               width, 25
            )
         ]
         break
   }

   altezza = 0
   speedh = 3
   cont = 0
}

function end_game() {
   push()
   background(255)
   textSize(75)
   textAlign(CENTER)
   fill(0)
   text("Cogratulazioni!", width / 2, height / 2 - 100)
   textSize(50)
   text("Hai completato il gioco", width / 2, height / 2)
   textSize(40)
   text("Il tuo punteggio è: " + tot_points + "/" + 100 * (level - 1), width / 2, height / 2 + 75)
   pop()
}
