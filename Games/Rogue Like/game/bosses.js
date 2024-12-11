class Cactus_king {
  constructor(id) {
    this.id = id
    this.name = "Cactus_king"

    this.max_health = 500
    this.max_speed = 0
    this.max_range = 120

    this.health = this.max_health
    this.speed = this.max_speed
    this.range = this.max_range
    this.action = null

    this.pos = createVector(width / 2, height / 2)
    this.timer = 0
    this.color = color(97, 173, 50)

    this.stunned = 0
    this.poisoned = 0
    this.burned = 0

    this.w = 70
    this.h = 70
  }

  update() {
    if (this.alive()) {
      check_collision(this, player, true)
      for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++)
        check_collision(this, floors[current_floor].rooms[current_room].enemies[i], true)

      if (dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < this.range) {
        if (
          this.timer % 360 == 0 ||
          this.timer % 360 == 60 ||
          this.timer % 360 == 120
        ) {
          get_damage(3)
        }
      } else {
        if (this.timer % 360 == 0 || this.timer % 360 == 60 || this.timer % 360 == 120) {
          var rand = random()
          if (rand < 0.5) 
            this.action = "spikes"
          else if (rand >= 0.5 && rand < 0.7)
            this.action = "undead"
          else if (rand >= 0.7 && rand < 0.9)
            this.action = "zombie"
          else
            this.action = "undead and zombie"
        } else if (this.timer % 360 == 180 || this.timer % 360 == 240 || this.timer % 360 == 300) {
          if (random() < 0.1)
            this.action = "auto cure"
          else
            this.action = "rest"
        }

        if (this.timer % 60 == 0) {
          switch (this.action) {
            case "undead":
              var teta = random(TWO_PI)
              var offset = createVector(100 * cos(teta), 100 * sin(teta))
              floors[current_floor].rooms[current_room].enemies.push(new Undead(id_enemy, createVector(this.pos.x + offset.x, this.pos.y + offset.y)))
              break;
            case "zombie":
              var teta = random(TWO_PI)
              var offset = createVector(100 * cos(teta), 100 * sin(teta))
              floors[current_floor].rooms[current_room].enemies.push(new Zombie(id_enemy, createVector(this.pos.x + offset.x, this.pos.y + offset.y)))
              break;
            case "undead and zombie":
              var teta = random(TWO_PI)
              var offset = createVector(100 * cos(teta), 100 * sin(teta))
              floors[current_floor].rooms[current_room].enemies.push(new Undead(id_enemy, createVector(this.pos.x + offset.x, this.pos.y + offset.y)))
              var teta = random(TWO_PI)
              var offset = createVector(100 * cos(teta), 100 * sin(teta))
              floors[current_floor].rooms[current_room].enemies.push(new Zombie(id_enemy, createVector(this.pos.x + offset.x, this.pos.y + offset.y)))
              break;
            case "auto cure":
              this.health += this.max_health / 10
              if (this.health > this.max_health)
                this.health = this.max_health
              break;
          }
        }

        if (this.timer % 20 == 0 && this.action == "spikes") {
          var random_angle = random(PI / 4)
          for (var angle = 0; angle < TWO_PI; angle += PI / 4)
            bullets.push(new Bullet(this.id, "enemy", this.pos, angle + random_angle, 3.5, 2, 3, [color(100, 100, 100), color(0, 0, 0)]))
        }
      }

      this.timer++
    } else {
      if (floors[current_floor].rooms[current_room].enemies.length == 0)
        floors[current_floor].rooms[current_room].cage = false
    }
  }

  alive() {
    return this.health > 0
  }

  show() {
    if (this.alive()) {
      push()

      fill(50)
      stroke(0)
      rect(150, 15, 300, 45)
      fill(0, 200, 0)
      rect(150, 15, map(this.health, 0, this.max_health, 0, 300), 45)

      rectMode(CENTER, CENTER)
      translate(this.pos.x, this.pos.y)
      fill(this.color)
      stroke(0)
      rect(0, 0, this.w, this.h)
      pop()
    }
  }
}

class Treant {
  constructor(id) {
    this.id = id
    this.name = "Treant"

    this.max_health = 500
    this.max_speed = 2
    this.max_range = 120

    this.health = this.max_health
    this.speed = this.max_speed
    this.range = this.max_range
    this.action = null
    this.counter = 3
    this.grid = matrix(9, 9)
    this.link_w = 30

    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.timer = 0
    this.color = color(60, 150, 30)

    this.stunned = 0
    this.poisoned = 0
    this.burned = 0
    this.w = 70

    this.h = 70
  }

  update() {
    if (this.alive()) {
      check_collision(this, player, true)
      for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++)
        check_collision(this, floors[current_floor].rooms[current_room].enemies[i], true)

      for (var i = 0; i < floors[current_floor].rooms[current_room].obstacles.length; i++)
        check_collision(floors[current_floor].rooms[current_room].obstacles[i], this, true)

      if (this.timer <= 0 && this.counter > 0) {
        this.grid = matrix(9, 9)
        var rand = random()
        if (rand < 0.4) {
          this.action = "hunt"
          this.timer = 240
        } else if (rand >= 0.4 && rand < 0.6) {
          this.action = "roots"
          this.timer = 180
        } else if (rand >= 0.6 && rand < 0.8) {
          this.action = "link"
          this.timer = 180
        } else {
          this.action = "spawn undead"
          this.timer = 60
        }

        this.counter--
      } else if (this.action != "rest" && this.timer <= 0 && this.counter == 0) {
        this.action = "rest"
        this.timer = 180
      }

      if (this.action == "hunt" && this.timer > 0) {
        if (dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < this.range) {
          get_damage(3)
          this.timer = 0
        } else {
          var to_player = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x)
          this.dir = createVector(cos(to_player), sin(to_player))
          this.pos.add(this.dir.mult(this.speed))
        }
      }

      if (this.action == "roots") {
        if (this.timer == 180) {
          for (var i = 0; i < 9; i++)
            for (var j = 0; j < 9; j++)
              this.grid[i][j] = random() < 0.2;
        } else {
          for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
              if (this.grid[i][j]) {
                image(treant_roots, 75 + i * 50, 75 + j * 50, 50, 50)
                if (
                  player.pos.x > 75 + i * 50 && player.pos.x < 75 + (i + 1) * 50 &&
                  player.pos.y > 75 + j * 50 && player.pos.y < 75 + (j + 1) * 50
                ) {
                  get_damage(2 / 60)
                }
              }
            }
          }
        }
      }

      if (this.action == "link") {
        if (this.timer == 180) {
          this.link_offset_angle = random(0, PI / 3)
        } else {
          for (var angle = 0; angle < TWO_PI; angle += PI / 3) {
            var to_player = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x)
            var teta = to_player - (this.link_offset_angle + angle)
            var d = dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y)
            if (abs(d * sin(teta)) < this.link_w / 2) {
              get_damage(3 / 60)
            }
          }
        }
      }

      if (this.action == "spawn undead" && this.timer == 60) {
        for (var i = 0; i < 2; i++) {
          var teta = random(TWO_PI)
          var offset = createVector(100 * cos(teta), 100 * sin(teta))
          floors[current_floor].rooms[current_room].enemies.push(new Zombie(id_enemy, createVector(this.pos.x + offset.x, this.pos.y + offset.y)))
        }
      }

      if (this.action == "rest" && this.timer % 60 == 0) {
        if (random() < 0.1) {
          this.health += this.max_health / 10
          if (this.health > this.max_health)
            this.health = this.max_health
        }
      }

      if (this.action == "rest" && this.timer < 0)
        this.counter = 3

      this.timer--
    } else {
      if (floors[current_floor].rooms[current_room].enemies.length == 0) {
        floors[current_floor].rooms[current_room].cage = false
      }
    }
  }

  alive() {
    return this.health > 0
  }

  show() {
    if (this.alive()) {
      push()
      
      fill(50)
      stroke(0)
      rect(150, 15, 300, 45)
      fill(0, 200, 0)
      rect(150, 15, map(this.health, 0, this.max_health, 0, 300), 45)
      
      rectMode(CENTER, CENTER)
      translate(this.pos.x, this.pos.y)
      fill(this.color)
      stroke(0)
      rect(0, 0, this.w, this.h)
      pop()
    }
  }
}
