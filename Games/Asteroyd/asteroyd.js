function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   player = new Player()

   bullets = []
   enemies = []
}

function draw() {
   background(0, 0, 20)
   if (mouseIsPressed && player.timer % 30 == 0)
      bullets.push(new Bullet())

   for (var i = 0; i < bullets.length; i++) {
      bullets[i].show()
      if (
         bullets[i].pos.x < 0 ||
         bullets[i].pos.x > width ||
         bullets[i].pos.y < 0 ||
         bullets[i].pos.y > height
      ) {
         bullets.splice(i, 1)
         i--
      }
   }

   for (var i = 0; i < bullets.length; i++)
      bullets[i].update(i)

   for (var i = 0; i < enemies.length; i++) {
      enemies[i].update()
      enemies[i].show()
      if (
         enemies[i].pos.x < -enemies[i].rad ||
         enemies[i].pos.x > width + enemies[i].rad ||
         enemies[i].pos.y < -enemies[i].rad ||
         enemies[i].pos.y > height + enemies[i].rad
      ) {
         enemies.splice(i, 1)
         i--
      }
   }

   if (enemies.length < 6) {
      if (random() < 0.5)
         var pos = createVector(random(width), random([0, height]))
      else 
         var pos = createVector(random([0, width]), random(height))

      enemies.push(new Enemy(pos, random(20, 60), atan2(player.pos.y - pos.y, player.pos.x - pos.x)))
   }

   if (player.update())
      noLoop()

   player.show()
}

class Player {
   constructor() {
      this.pos = createVector(width / 2, height / 2)
      this.speed = createVector()
      this.acc = createVector()
      this.dir = 0
      this.timer = 0
   }

   show() {
      push()
      translate(this.pos.x, this.pos.y)
      rotate(this.dir)
      triangle(20, 0, -10, 10, -10, -10)
      pop()
   }

   update() {
      this.dir = atan2(mouseY - this.pos.y, mouseX - this.pos.x)
      this.timer++

      this.acc = createVector()
      if (keyIsDown(87))
         this.acc.y -= 0.2
      if (keyIsDown(83))
         this.acc.y += 0.2
      if (keyIsDown(65))
         this.acc.x -= 0.2
      if (keyIsDown(68))
         this.acc.x += 0.2

      this.speed.add(this.acc)
      this.speed.x *= 0.99
      this.speed.y *= 0.99
      this.pos.add(this.speed)
      this.pos.x = constrain(this.pos.x, 0, width)
      this.pos.y = constrain(this.pos.y, 0, height)

      var gameOver = false;
      for (var i = 0; i < enemies.length; i++)
         if (dist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < enemies[i].rad * 1.5)
            gameOver = true;

      return gameOver
   }
}

class Bullet {
   constructor() {
      this.pos = createVector(player.pos.x, player.pos.y)
      this.dir = player.dir
      this.speed = 5
   }

   show() {
      stroke(255)
      line(this.pos.x, this.pos.y, this.pos.x - 10 * cos(this.dir), this.pos.y - 10 * sin(this.dir))
   }

   update(index) {
      this.pos.x += this.speed * cos(this.dir)
      this.pos.y += this.speed * sin(this.dir)

      var newEnemies = []
      for (var i = 0; i < enemies.length; i++) {
         if (dist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < enemies[i].rad) {
            if (enemies[i].rad > 40) {
               newEnemies.push(new Enemy(createVector(enemies[i].pos.x, enemies[i].pos.y), enemies[i].rad / 2 + random(-5, 5), enemies[i].dir + 1))
               newEnemies.push(new Enemy(createVector(enemies[i].pos.x, enemies[i].pos.y), enemies[i].rad / 2 + random(-5, 5), enemies[i].dir - 1))
            }
            enemies.splice(i, 1)
            bullets.splice(index, 1)
         }
      }

      for (var i = 0; i < newEnemies.length; i++)
         enemies.push(newEnemies[i])
   }
}

class Enemy {
   constructor(pos, rad, dir) {
      this.pos = pos
      this.rad = rad
      this.speed = map(this.rad, 20, 60, 2, 0.5)
      this.off = random(10)
      this.dir = dir
      this.angle = 0
      this.mom = random(-TWO_PI / 180, TWO_PI / 180)
   }

   show() {
      fill(0, 0, 20)
      stroke(255)
      push()
      translate(this.pos.x, this.pos.y)
      rotate(this.angle)
      beginShape()
      for (var angle = 0; angle < TWO_PI; angle += PI / 45)
         vertex((this.rad + noise(angle + this.off) * 30) * cos(angle), (this.rad + noise(angle + this.off) * 30) * sin(angle))

      endShape(CLOSE)
      pop()
   }

   update() {
      this.pos.x += this.speed * cos(this.dir)
      this.pos.y += this.speed * sin(this.dir)
      this.angle += this.mom
   }
}
