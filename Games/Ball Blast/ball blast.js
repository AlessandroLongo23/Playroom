function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   cont = 200
   level = 0

   enemies = []
   fire = []
}

function draw() {
   background(150, 150, 255)
   ground()
   player()
   shoot()

   var sum = 0
   for (i = 0; i < enemies.length; i++) {
      sum += enemies[i].power
   }
   if (sum < level && level < 20) {
      var r = random([20, 30, 40, 50])
      // x, y, r, speedx, speedy, power
      var ball = new Ball(random([r + 1, width - r - 1]), 100, r, 3, -3, round(random(20, 100)))
      enemies.push(ball)
      cont = 0
   }

   for (i = 0; i < fire.length; i++) {
      fire[i].move()
      fire[i].show()
      for (j = 0; j < enemies.length; j++) {
         if (dist(fire[i].x, fire[i].y, enemies[j].x, enemies[j].y) < fire[i].r + enemies[j].r) {
            enemies[j].power--
            if (enemies[j].power <= 0) {
               if (enemies[j].r > 20) {
                  var ball = new Ball(enemies[j].x, enemies[j].y, enemies[j].r - 10, 3, -abs(enemies[j].speedy), round(random(20, 100)))
                  enemies.push(ball)
                  var ball = new Ball(enemies[j].x, enemies[j].y, enemies[j].r - 10, -3, -abs(enemies[j].speedy), round(random(20, 100)))
                  enemies.push(ball)
               }
               enemies.splice(j, 1)
            }
         }
      }
   }

   for (j = 0; j < enemies.length; j++) {
      enemies[j].show()
      enemies[j].move()
      if (abs(mouseX - enemies[j].x) < enemies[j].r + 20 && enemies[j].y > height - 150) {
         lose()
      }
   }

   cont++
   if (level < 100) {
      level += 100 / 1000
   }
   if (level >= 100 && sum == 0) {
      win()
   }

   bar(sum)
}

function bar(sum) {
   var progress = map(level, 0, 500, 0, width / 2)
   push()
   noFill()
   stroke(255)
   rect(width / 4, 50, width / 2, 30)

   fill(255, 0, 0)
   rect(width / 4, 50, progress, 30)
   pop()
}

function ground() {
   push()
   fill(0, 255, 0)
   rect(0, height - 50, width, 50)
   pop()
}

function player() {
   push()
   fill(255, 0, 200)
   beginShape()
   vertex(constrain(mouseX, 35, width - 35) - 15, height - 130)
   vertex(constrain(mouseX, 35, width - 35) + 15, height - 130)
   vertex(constrain(mouseX, 35, width - 35) + 25, height - 65)
   vertex(constrain(mouseX, 35, width - 35) - 25, height - 65)
   endShape(CLOSE)

   fill(150)
   ellipse(constrain(mouseX, 35, width - 35) - 20, height - 65, 30)
   ellipse(constrain(mouseX, 35, width - 35) + 20, height - 65, 30)
   pop()
}

function shoot() {
   if (mouseIsPressed) {
      if (cont % 10 == 0) {
         let bullet = new Bullet(mouseX, height - 130, 10)
         fire.push(bullet)
      }
   }

   for (i = 0; i < fire.length; i++) {
      if (fire[i].y < 0) {
         fire.splice(i, 1)
      }
   }
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

class Ball {
   constructor(x, y, r, speedx, speedy, power) {
      this.x = x
      this.y = y
      this.r = r
      this.speedx = speedx
      this.speedy = speedy
      this.acc = 0.1
      this.power = power
   }

   move() {
      this.x += this.speedx
      this.y += this.speedy
      this.speedy += this.acc
      this.color = map(this.power, 100, 500, 200, 0)

      if (this.y > height - 50 - this.r && this.speedy > 0) {
         this.speedy *= -0.99
      }

      if (this.x > width - this.r || this.x < this.r) {
         this.speedx *= -1
      }
   }

   show() {
      push()
      colorMode(HSB)
      fill(this.color, 255, 255)
      ellipse(this.x, this.y, 2 * this.r)
      fill(0)
      textSize(this.r)
      textAlign(CENTER)
      text(this.power, this.x, this.y + this.r / 3)
      pop()
   }
}

class Bullet {
   constructor(x, y, r) {
      this.x = x
      this.y = y
      this.r = r
   }

   move() {
      this.y -= 10
   }

   show() {
      push()
      fill(255)
      ellipse(this.x, this.y, 2 * this.r)
      pop()
   }

   destroy(x, y, r) {
      let d = dist(this.x, this.y, x, y)
      return (d < this.r + r)
   }
}
