function preload() {
   pl = loadImage("sprites/ship.png")
   enemy = loadImage("sprites/alien.png")
}

function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   enx = 10
   eny = 5

   bullets = []
   enemies = []
   for (var i = 0; i < enx; i++) {
      for (var j = 0; j < eny; j++) {
         enemies.push(new Enemy(createVector((i + 1) * (width / (enx + 1)), height / 3 + j * (height / 2 / (eny + 1)))))
      }
   }

   frames = 0
}

function draw() {
   background(0)

   player()
   win()

   for (var i = 0; i < enemies.length; i++) {
      enemies[i].update()
      enemies[i].show()

      for (var j = 0; j < bullets.length; j++) {
         if (
            bullets[j].pos.x + bullets[j].radius > enemies[i].pos.x + enemies[i].offset.x - enemies[i].side / 2 &&
            bullets[j].pos.x - bullets[j].radius < enemies[i].pos.x + enemies[i].offset.x + enemies[i].side / 2 &&
            bullets[j].pos.y + bullets[j].radius > enemies[i].pos.y + enemies[i].offset.y - enemies[i].side / 2 &&
            bullets[j].pos.y - bullets[j].radius < enemies[i].pos.y + enemies[i].offset.y + enemies[i].side / 2
         ) {
            enemies.splice(i, 1)
            bullets.splice(j, 1)
         }
      }
   }

   for (var i = 0; i < bullets.length; i++) {
      bullets[i].update()
      bullets[i].show()

      if (bullets[i].pos.y < 0) {
         bullets.splice(i, 1)
      }
   }

   frames++
}

function win() {
   if (enemies.length == 0) {
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
}

function player() {
   push()
   noStroke()
   fill(255)
   image(pl, mouseX - 20, height - 45, 60, 45)
   pop()

   shoot()
}

function shoot() {
   if (mouseIsPressed && frames % 30 == 0) {
      bullets.push(new Bullet(createVector(mouseX, height - 55)))
   }
}

class Enemy {
   constructor(pos) {
      this.pos = pos
      this.offset = createVector()
      this.direction = createVector(5, 0)
      this.side = 50
   }

   show() {
      push()
      noStroke()
      fill(255)
      image(enemy, this.pos.x + this.offset.x - 20, this.pos.y + this.offset.y, this.side, this.side)
      pop()
   }

   update() {
      if (this.offset.x < -30) {
         this.direction.x = 5
         if (frames % 30 == 0) {
            this.offset.y += 5
         }
      } else if (this.offset.x > 30) {
         this.direction.x = -5
         if (frames % 30 == 0) {
            this.offset.y += 5
         }
      }

      if (frames % 30 == 0) {
         this.offset.add(this.direction)
      }
   }
}

class Bullet {
   constructor(pos) {
      this.pos = pos
      this.radius = 7.5
      this.speed = 10
   }

   show() {
      push()
      fill(255)
      noStroke()
      ellipse(this.pos.x, this.pos.y, this.radius)
      pop()
   }

   update() {
      this.pos.y -= this.speed
   }
}
