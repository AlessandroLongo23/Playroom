// velocità = 1.5 + ((num - 1) / 2)
// vita = num * 20 + 30
// danno = num * 8
// danno_preso = num.danno_nemico * (10 - num.difesa)

characters = ["Mage", "Mech", "Hunter", "Knight", "Tank", "Assassin", "Wall_Breaker"]

function get_damage(damage) {
  if (player.armor > 0)
    player.armor--
  else
    player.health -= damage * (10 - player.defense)
}

function update_player() {
  if (player.health <= 0)
    reload_player()

  move_player()
  if (
    player.pos.x > 70 + player.w / 2 &&
    player.pos.x < width - 70 - player.w / 2 &&
    player.pos.y > 70 + player.h / 2 &&
    player.pos.y < height - 70 - player.h / 2 &&
    !floors[current_floor].rooms[current_room].cage &&
    (
      floors[current_floor].rooms[current_room].enemies.length != 0 ||
      (
        floors[current_floor].rooms[current_room].index == floors[current_floor].ladder_room_index &&
        floors[current_floor].rooms[floors[current_floor].ladder_room_index].boss.health > 0
      )
    )
  ) {
    floors[current_floor].rooms[current_room].cage = true
    player.timer = 0
  }

  if (mouseIsPressed)
    player_attack()

  skill()
  player.timer++
  if (player.level >= 4)
    player.talent++

  if (player.talent_timer > 0)
    player.talent_timer--
}

function skill() {
  if (player.skill_timer > 0) {
    player.skill_timer--
    switch (player.name) {
      case "Mech":
        var d = width * sqrt(2)
        var target = null
        for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
          var enemy = floors[current_floor].rooms[current_room].enemies[i]
          if (dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) < d) {
            d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
            target = enemy
          }
        }
        if (target) {
          if (player.skill_timer % player.turret_fire_rate == 0) {
            player.turret_angle = atan2(target.pos.y - player.turret_pos.y, target.pos.x - player.turret_pos.x)
            bullets.push(new Bullet(0, "player", player.turret_pos, player.turret_angle, player.bullet_speed, player.turret_damage, player.turret_bullet_rad, [color(99, 250, 85), color(16, 97, 9)]))
          }
        } else {
          player.turret_active = false
        }
        break;
      case "Assassin":
        player.speed = 10
        player.defense = 10
        for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
          enemy = floors[current_floor].rooms[current_room].enemies[i]
          var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
          var sub_angle = enemy_angle - player.dash_angle
          var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
          if (
            d * cos(sub_angle) < player.dash_speed &&
            d * cos(sub_angle) > 0 &&
            abs(d * sin(sub_angle)) < player.dash_width
          ) {
            enemy.health -= player.dash_damage
          }
        }
        break;
      case "Tank":
        player.defense = 10
        break;
      case "Wall_Breaker":
        player.damage = player.boost_damage
        player.attack_rate = player.boost_time_rate
        break;
    }
  }
  else {
    switch (character_selection % 7) {
      case 1:
        player.turret_active = false
        break;
      case 4:
        player.speed = 3.5
        player.defense = 3
        break;
      case 5:
        player.defense = 3
        break;
      case 6:
        player.damage = 40
        player.attack_rate = 60
        break;
    }
  }
}

function move_player() {
  if (character_selection == 4 && player.skill_timer > 0) {
    player.pos.add(createVector(player.dash_speed * cos(player.dash_angle), player.dash_speed * sin(player.dash_angle)))
  } else {
    get_direction()
    if (mag(player.dir.x, player.dir.y) != 0) {
      player.dir.div(player.dir.mag())
    }
    player.pos.add(player.dir.mult(player.speed))
  }

  for (var i = 0; i < floors[current_floor].rooms[current_room].obstacles.length; i++)
    check_collision(floors[current_floor].rooms[current_room].obstacles[i], player, true)

  change_room()
}

function player_attack() {
  if (
    player.pos.x > 70 + player.w / 2 && player.pos.x < width - 70 - player.w / 2 &&
    player.pos.y > 70 + player.h / 2 && player.pos.y < height - 70 - player.h / 2 &&
    player.timer % player.attack_rate == 0
  ) {
    if (player.type == "ranged") {
      var shoot = false
      if (player.name == "Hunter" && player.level >= 1 && random() < 0.2) {
        var bullet = new Bullet(0, "player", player.pos, weapon_direction(), player.bullet_speed, player.expl_bullet_dmg, player.expl_bullet_rad, player.bullet_color, false, false, true)
        bullets.push(bullet)
        shoot = true
      }

      if (player.name == "Mage" && player.level >= 3) {
        var bullet = new Bullet(0, "player", player.pos, weapon_direction(), player.bullet_speed, player.damage, player.bullet_rad, player.bullet_color, false, false, false, true)
        bullets.push(bullet)
        shoot = true
      }

      if (player.name == "Mech") {
        if (player.level >= 1 && player.timer < 120)
          player.attack_rate = 10
        else
          player.attack_rate = 20

        if (player.level == 3) {
          var bullet = new Bullet(0, "player", player.pos, weapon_direction(), player.bullet_speed, player.damage, player.bullet_rad, player.bullet_color, false, false, false, false, random())
          bullets.push(bullet)
          shoot = true
        }

        if (player.level >= 4 && player.talent_timer > 0) {
          var angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x)
          var teta = weapon_direction() + PI / 2
          var offset = createVector(10 * cos(teta), 10 * sin(teta))
          var bullet = new Bullet(0, "player", player.pos.add(offset), angle, player.bullet_speed, player.damage, player.bullet_rad, player.bullet_color, false, false, false, false, random())
          bullets.push(bullet)
          var bullet = new Bullet(0, "player", player.pos.sub(offset), angle, player.bullet_speed, player.damage, player.bullet_rad, player.bullet_color, false, false, false, false, random())
          bullets.push(bullet)
          shoot = true
        }
      }

      if (!shoot) {
        var bullet = new Bullet(0, "player", player.pos, weapon_direction(), player.bullet_speed, player.damage, player.bullet_rad, player.bullet_color)
        bullets.push(bullet)
      }
    } else {
      for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
        var enemy = floors[current_floor].rooms[current_room].enemies[i]
        switch (player.name) {
          case "Knight":
            var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
            if (
              dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) < player.attack_rad &&
              enemy_angle > weapon_direction() - player.attack_range / 2 &&
              enemy_angle < weapon_direction() + player.attack_range / 2
            ) {
              enemy.health -= player.damage
            }
            break;
          case "Assassin":
            if (player.level == 5 && player.talent_timer > 0) {
              player.poison_rate = 1
              player.critic_rate = 1
            } else {
              player.poison_rate = 0.1
              player.critic_rate = 0.1
            }

            var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
            var sub_angle = enemy_angle - weapon_direction()
            var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
            if (
              d * cos(sub_angle) < player.attack_depth &&
              d * cos(sub_angle) > 0 &&
              abs(d * sin(sub_angle)) < player.attack_width
            ) {
              if (player.level >= 1 && random() < player.critic_rate)
                enemy.health -= player.damage * 3 / 2
              else
                enemy.health -= player.damage

              if (player.level >= 3 && random() < player.poison_rate)
                enemy.poisoned = 300
            }
            break;
          case "Tank":
            var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
            var sub_angle = enemy_angle - weapon_direction()
            var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
            if (
              d * cos(sub_angle) < player.attack_depth &&
              d * cos(sub_angle) > 0 &&
              abs(d * sin(sub_angle)) < player.attack_width
            ) {
              enemy.health -= player.damage
              if (player.knockback) {
                enemy.knockbacked = 30
                enemy.knockback_speed = 1
              }

              if (player.level >= 3) {
                for (var j = 0; j < floors[current_floor].rooms[current_room].enemies.length; j++) {
                  var enemy_2 = floors[current_floor].rooms[current_room].enemies[j]
                  var d_2 = dist(player.pos.x, player.pos.y, enemy_2.pos.x, enemy_2.pos.y)
                  if (d_2 < player.attack_depth) {
                    enemy_2.knockbacked = 30
                    enemy_2.knockback_speed = 1
                  }
                }
              }
            }
            break;
          case "Wall_Breaker":
            var impact_point = createVector(
              player.pos.x + player.attack_dist * cos(weapon_direction()),
              player.pos.y + player.attack_dist * sin(weapon_direction())
            )
            if (dist(impact_point.x, impact_point.y, enemy.pos.x, enemy.pos.y) < player.attack_rad) {
              enemy.health -= player.damage
              if (player.level >= 3 && random() < 0.25)
                enemy.stunned = 120
            }
            break;
        }
      }

      if (
        floors[current_floor].rooms[current_room].index == floors[current_floor].ladder_room_index &&
        boss.health > 0
      ) {
        var enemy = boss
        switch (player.name) {
          case "Knight":
            var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
            if (
              dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) < player.attack_rad &&
              enemy_angle > weapon_direction() - player.attack_range / 2 &&
              enemy_angle < weapon_direction() + player.attack_range / 2
            ) {
              enemy.health -= player.damage
            }
            break;
          case "Assassin":
            if (player.level == 5 && player.talent_timer > 0) {
              player.poison_rate = 1
              player.critic_rate = 1
            } else {
              player.poison_rate = 0.1
              player.critic_rate = 0.1
            }

            var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
            var sub_angle = enemy_angle - weapon_direction()
            var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
            if (
              d * cos(sub_angle) < player.attack_depth &&
              d * cos(sub_angle) > 0 &&
              abs(d * sin(sub_angle)) < player.attack_width
            ) {
              if (player.level >= 1 && random() < player.critic_rate)
                enemy.health -= player.damage * 3 / 2
              else
                enemy.health -= player.damage

              if (player.level >= 3 && random() < player.poison_rate)
                enemy.poisoned = 300
            }
            break;
          case "Tank":
            var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
            var sub_angle = enemy_angle - weapon_direction()
            var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
            if (
              d * cos(sub_angle) < player.attack_depth &&
              d * cos(sub_angle) > 0 &&
              abs(d * sin(sub_angle)) < player.attack_width
            ) {
              enemy.health -= player.damage
              if (player.knockback) {
                enemy.knockbacked = 30
                enemy.knockback_speed = 1
              }
              if (player.level >= 3) {
                for (var j = 0; j < floors[current_floor].rooms[current_room].enemies.length; j++) {
                  var enemy_2 = floors[current_floor].rooms[current_room].enemies[j]
                  var d_2 = dist(player.pos.x, player.pos.y, enemy_2.pos.x, enemy_2.pos.y)
                  if (d_2 < player.attack_depth) {
                    enemy_2.knockbacked = 30
                    enemy_2.knockback_speed = 1
                  }
                }
              }
            }
            break;
          case "Wall_Breaker":
            var impact_point = createVector(
              player.pos.x + player.attack_dist * cos(weapon_direction()),
              player.pos.y + player.attack_dist * sin(weapon_direction())
            )
            if (dist(impact_point.x, impact_point.y, enemy.pos.x, enemy.pos.y) < player.attack_rad) {
              enemy.health -= player.damage
              if (player.level >= 3 && random() < 0.25)
                enemy.stunned = 120
            }
            break;
        }
      }
    }
  }
}

function get_direction() {
  if (keyIsDown(87)) {
    player.dir.y = -1
  } else if (keyIsDown(83)) {
    player.dir.y = 1
  } else {
    player.dir.y = 0
  }

  if (keyIsDown(68)) {
    player.dir.x = 1
  } else if (keyIsDown(65)) {
    player.dir.x = -1
  } else {
    player.dir.x = 0
  }
}

function weapon_direction() {
  return atan2(mouseY - player.pos.y, mouseX - player.pos.x)
}

function change_room() {
  var change = false
  if (player.pos.x < 0) {
    current_room = floors[current_floor].rooms[current_room].doors[3]
    player.pos.x = width - 1
    change = true
  }
  if (player.pos.x > width) {
    current_room = floors[current_floor].rooms[current_room].doors[1]
    player.pos.x = 1
    change = true
  }
  if (player.pos.y < 0) {
    current_room = floors[current_floor].rooms[current_room].doors[0]
    player.pos.y = height - 1
    change = true
  }
  if (player.pos.y > height) {
    current_room = floors[current_floor].rooms[current_room].doors[2]
    player.pos.y = 1
    change = true
  }
  if (change) {
    floors[current_floor].rooms[current_room].visited = true
    bullets = []
  }
}

function show_player() {
  push()
  rectMode(CENTER, CENTER)
  translate(player.pos.x, player.pos.y)
  noStroke()
  fill(player.color)
  rect(0, 0, player.w, player.h)

  if (player.name == "Assassin" && player.talent_timer > 0) {
    fill(255, 100)
    rect(0, 0, player.w, player.h)
  }

  rectMode(CORNER, CORNER)
  stroke(0)
  fill(255, 0, 0)
  rect(-player.w / 2, -player.h / 2 - 10, player.w, 5)
  fill(0, 255, 0)
  rect(-player.w / 2, -player.h / 2 - 10, map(player.health, 0, player.max_health, 0, player.w), 5)

  rectMode(CENTER, CENTER)
  switch (player.weapon) {
    case "scepter":
      fill(135, 41, 1)
      rect(player.w / 2 - 10, 5, 5, player.h - 10)
      break;
    case "assault rifle":
      fill(0)
      rotate(weapon_direction())
      rect(player.w / 2, 0, 25, 5)
      break;
    case "crossbow":
      rectMode(CENTER, CENTER)
      noStroke()
      fill(69, 47, 33)
      rotate(weapon_direction())
      rect(12.5, 0, 25, 4)
      stroke(69, 47, 33)
      noFill()
      strokeWeight(4)
      strokeCap(PROJECT)
      arc(20, 0, 10, 10, -PI / 2, PI / 2)
      break;
    case "sword":
      rotate(weapon_direction())
      stroke(0, 120)
      noFill()
      line(0, 0, player.attack_rad * cos(-player.attack_range / 2), player.attack_rad * sin(-player.attack_range / 2))
      line(0, 0, player.attack_rad * cos(player.attack_range / 2), player.attack_rad * sin(player.attack_range / 2))
      arc(0, 0, player.attack_rad * 2, player.attack_rad * 2, -player.attack_range / 2, player.attack_range / 2)
      ellipse(0, 0, player.swing_rad * 2)
      if (mouseIsPressed) {
        rotate(player.attack_range / 2 * (abs(sin(PI * player.timer / player.attack_rate)) / sin(PI * player.timer / player.attack_rate)) * pow(abs(sin(PI * player.timer / player.attack_rate)), 1 / 3))
      }
      fill(186, 186, 186)
      rect(player.attack_rad / 2, 0, player.attack_rad, 5)
      break;
    case "twin daggers":
      rotate(weapon_direction())
      stroke(0, 120)
      noFill()
      rect(player.attack_depth / 2, 0, player.attack_depth, player.attack_width)
      if (mouseIsPressed) {
        translate((player.attack_depth - 45) * (-sqrt(abs(sin(PI * player.timer / player.attack_rate))) + 1), 0)
      }
      fill(110, 110, 110)
      triangle(15, -4, 15, 4, 33, 0)
      break;
    case "iron fists":
      rotate(weapon_direction())
      stroke(0, 120)
      noFill()
      rect(player.attack_depth / 2, 0, player.attack_depth, player.attack_width)
      if (mouseIsPressed) {
        translate((player.attack_depth - 30) * (-sqrt(abs(sin(PI * player.timer / player.attack_rate))) + 1), 0)
      }
      fill(110, 110, 110)
      rect(15, 0, 10, 10)
      break;
    case "hammer":
      rotate(weapon_direction())
      stroke(0, 100)
      noFill()
      ellipse(player.attack_dist, 0, player.attack_rad * 2)
      stroke(0, 25)
      line(0, 0, width * cos(-PI / 8), width * sin(-PI / 8))
      line(0, 0, width * cos(PI / 8), width * sin(PI / 8))
      var lift_angle = PI / 2
      if (mouseIsPressed) {
        if (abs(weapon_direction()) < PI / 2) {
          rotate(-lift_angle * sqrt(abs(sin(PI * player.timer / player.attack_rate))))
        } else {
          rotate(lift_angle * sqrt(abs(sin(PI * player.timer / player.attack_rate))))
        }
      }
      fill(110, 38, 4)
      rect(25, 0, 40, 5)
      fill(181, 181, 181)
      rect(player.attack_dist, 0, 20, 30)
      break;
  }
  pop()
  if (character_selection == 1 && player.turret_active) {
    push()
    translate(player.turret_pos.x, player.turret_pos.y)
    rectMode(CENTER, CENTER)
    rotate(player.turret_angle)
    translate(-10 * (-sqrt(abs(sin(PI * player.skill_timer / player.turret_fire_rate))) + 1), 0)
    fill(200)
    stroke(0)
    rect(0, 0, 30, 15)
    pop()
  }
}

class Mage {
  constructor() {
    this.name = "Mage"
    this.type = "ranged"
    this.weapon = "scepter"
    this.lives = 5
    this.max_health = 90
    this.damage = 24
    this.defense = 3
    this.speed = 3
    this.attack_rate = 40

    this.health = this.max_health
    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(20, 115, 156)
    this.bullet_speed = 3
    this.bullet_rad = 10
    this.bullet_color = [color(100, 189, 227, 120), color(10, 89, 122, 120)]

    this.level = 0
    this.skill = 3
    this.stun_rate = 0.3
    this.talent = 0
    this.burn_rate = 0.25

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}

class Mech {
  constructor() {
    this.name = "Mech"
    this.type = "ranged"
    this.weapon = "assault rifle"
    this.lives = 5
    this.max_health = 50
    this.damage = 16
    this.defense = 5
    this.speed = 2.5
    this.attack_rate = 20

    this.health = this.max_health
    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(207, 204, 202)
    this.bullet_speed = 3.5
    this.bullet_rad = 4
    this.bullet_color = [color(99, 250, 85), color(16, 97, 9)]

    this.level = 0
    this.skill = 3
    this.skill_timer = 0
    this.turret_active = true
    this.turret_pos = createVector()
    this.turret_angle = 0
    this.turret_bullet_rad = 2
    this.turret_fire_rate = 15
    this.turret_damage = 4
    this.talent = 0
    this.talent_timer = 0
    this.scatter_rate = 0.2

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}

class Hunter {
  constructor() {
    this.name = "Hunter"
    this.type = "ranged"
    this.weapon = "crossbow"
    this.lives = 5
    this.max_health = 70
    this.damage = 32
    this.defense = 3
    this.speed = 3
    this.attack_rate = 50

    this.health = this.max_health
    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(2, 64, 23)
    this.bullet_speed = 4
    this.bullet_rad = 4
    this.bullet_color = [color(143, 81, 14), color(84, 45, 2)]

    this.level = 0
    this.skill = 3
    this.expl_bullet_rad = 50
    this.expl_bullet_dmg = 32
    this.talent = 0

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}

class Knight {
  constructor() {
    this.name = "Knight"
    this.type = "melee"
    this.weapon = "sword"
    this.lives = 5
    this.max_health = 110
    this.damage = 24
    this.defense = 3
    this.speed = 2.5
    this.attack_rate = 25
    this.attack_rad = 70
    this.attack_range = PI / 2
    this.health = this.max_health

    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(105, 199, 176)
    this.weapon_color = color(186, 186, 186)

    this.level = 0
    this.skill = 3
    this.knockback = false
    this.swing_rad = 70
    this.swing_dmg = 24
    this.talent = 0
    this.armor = 0

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}

class Assassin {
  constructor() {
    this.name = "Assassin"
    this.type = "melee"
    this.weapon = "twin daggers"
    this.lives = 5
    this.max_health = 90
    this.damage = 16
    this.defense = 3
    this.speed = 3.5
    this.attack_rate = 20
    this.attack_width = 30
    this.attack_depth = 70

    this.health = this.max_health
    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(42, 7, 87)

    this.level = 0
    this.skill = 3
    this.skill_timer = 0
    this.dash_angle = 0
    this.dash_width = 60
    this.dash_speed = 10
    this.dash_damage = 32
    this.talent = 0
    this.talent_timer = 0
    this.critic_rate = 0.1
    this.poison_rate = 0.1

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}

class Tank {
  constructor() {
    this.name = "Tank"
    this.type = "melee"
    this.weapon = "iron fists"
    this.lives = 5
    this.max_health = 130
    this.damage = 32
    this.defense = 3
    this.speed = 2
    this.attack_rate = 45
    this.attack_width = 30
    this.attack_depth = 70

    this.health = this.max_health
    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(235, 190, 28)

    this.level = 0
    this.skill = 3
    this.skill_timer = 0
    this.knockback = false
    this.talent = 0
    this.talent_timer = 0

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}

class Wall_Breaker {
  constructor() {
    this.name = "Wall_Breaker"
    this.type = "melee"
    this.weapon = "hammer"
    this.lives = 5
    this.max_health = 110
    this.damage = 40
    this.defense = 2
    this.speed = 2.5
    this.attack_rate = 60
    this.attack_dist = 50
    this.attack_rad = 30

    this.health = this.max_health
    this.pos = createVector(width / 2, height / 2)
    this.dir = createVector()
    this.color = color(217, 0, 0)

    this.level = 0
    this.skill = 3
    this.skill_timer = 0
    this.boost_time = 300
    this.boost_time_rate = 45
    this.boost_damage = 48
    this.talent = 0
    this.talent_timer = 0

    this.w = 30
    this.h = 30
    this.timer = 0
  }
}
