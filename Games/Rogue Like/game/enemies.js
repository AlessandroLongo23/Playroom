// creo il codice nemico a partire da 1, unico per ognuno: l'id 0 è quello del giocatore
var id_enemy = 1

function show_enemy(enemy) {
  push()
  // disegno il corpo
  rectMode(CENTER, CENTER)
  translate(enemy.pos.x, enemy.pos.y)
  noStroke()
  fill(enemy.color)
  rect(0, 0, enemy.w, enemy.h)
  // mostro la barra della vita
  rectMode(CORNER, CORNER)
  stroke(0)
  fill(255, 0, 0)
  rect(-enemy.w / 2, -enemy.h / 2 - 10, enemy.w, 5)
  // e la riempio
  fill(0, 255, 0)
  rect(-enemy.w / 2, -enemy.h / 2 - 10, map(enemy.health, 0, enemy.max_health, 0, enemy.w), 5)
  pop()
}

function update_enemy(enemy) {
  // se il nemico non è nel raggio d'attacco, non è spinto via dal giocatore...
  // ...e non è l'assassino con il talento attivo
  if (
    dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) > enemy.range / 2 &&
    enemy.knockbacked == 0 && !(player.name == "Assassin" && player.talent_timer > 0)
  ) {
    // calcolo la direzione in cui deve andare il nemico (verso il personaggio)
    var to_player = atan2(player.pos.y - enemy.pos.y, player.pos.x - enemy.pos.x)
    enemy.dir = createVector(cos(to_player), sin(to_player))
    // e lo sposto
    enemy.pos.add(enemy.dir.mult(enemy.speed))
  }
  // il nemico attacca se il giocatore è nel suo raggio d'attacco
  if (
    dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) < enemy.range &&
    enemy.knockbacked == 0 && !(player.name == "Assassin" && player.talent_timer > 0)
  ) {
    // attacco il nemico
    enemy_attack(enemy)
  }
  // controllo lo stato del nemico
  enemy_status(enemy)
  // controllo le collisioni con ogni ostacolo...
  for (var i = 0; i < floors[current_floor].rooms[current_room].obstacles.length; i++) {
    check_collision(floors[current_floor].rooms[current_room].obstacles[i], enemy, true)
  }
  // ...con il personaggio...
  if (player.skill_timer > 0 && character_selection % 7 == 4) {
    // se è attiva l'abilità primaria dell'assassino non devono collidere
  } else {
    check_collision(player, enemy)
  }
  // ...e con gli altri nemici
  for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
    if (floors[current_floor].rooms[current_room].enemies[i] != enemy) {
      check_collision(floors[current_floor].rooms[current_room].enemies[i], enemy)
    }
  }
  // aggiorno il timer
  enemy.timer++
}

function enemy_death(enemy) {
  if (enemy.health <= 0) {
    // controllo se il nemico era l'ultimo della stanza, in tal caso ricarico di un punto l'abilità primaria del giocatore
    if (floors[current_floor].rooms[current_room].enemies.length == 1) {
      player.skill++
      // se non c'è un boss nella stanza
      if (!
        (
          floors[current_floor].rooms[current_room].index == floors[current_floor].ladder_room_index &&
          floors[current_floor].rooms[current_room].boss.alive()
        )
      ) {
        // libero anche le porte della stanza
        floors[current_floor].rooms[current_room].cage = false
      }
    }
    return true
  } else {
    return false
  }
}

function enemy_attack(enemy) {
  if (dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) < enemy.range && enemy.timer % enemy.attack_rate == 0) {
    // se il nemico fa danno a contatto
    if (enemy.type == "melee") {
      get_damage(enemy.damage)
      if (enemy.name == "Kamikaze") {
        enemy.health = 0
      }
    } else {
      var angle = atan2(player.pos.y - enemy.pos.y, player.pos.x - enemy.pos.x)
      if (enemy.name == "Witch") {
        bullets.push(new Bullet(enemy.id, "enemy", enemy.pos, angle, enemy.bullet_speed, enemy.damage, enemy.bullet_rad, enemy.bullet_color, "player"))
      } else {
        bullets.push(new Bullet(enemy.id, "enemy", enemy.pos, angle, enemy.bullet_speed, enemy.damage, enemy.bullet_rad, enemy.bullet_color))
      }
    }
  }
}

function enemy_status(enemy) {
  // se il nemico è avvelenato (6 danni al secondo)
  if (enemy.poisoned > 0) {
    // decremento il timer, riduco la velocità, il rateo d'attacco e la vita
    enemy.poisoned--
    enemy.speed = enemy.max_speed / 2
    enemy.attack_rate = enemy.attack_rate * 2
    enemy.health -= 0.1
  }
  // altrimenti setto le sue variabili al massimo
  else {
    enemy.speed = enemy.max_speed
    enemy.attack_rate = enemy.attack_rate
  }
  // se il nemico è stunnato
  if (enemy.stunned > 0) {
    // decremento il timer e setto a 0 la velocità e il rateo d'attacco
    enemy.stunned--
    enemy.speed = 0
    enemy.attack_rate = 0
  }
  // altrimenti setto le sue variabili al massimo
  else {
    enemy.speed = enemy.max_speed
    enemy.attack_rate = enemy.attack_rate
  }
  // se il nemico è bruciato (18 danni al secondo)
  if (enemy.burned > 0) {
    // decremento il timer e faccio danno al nemico
    enemy.burned--
    enemy.health -= 0.3
  }
  // se il nemico è stato spinto via
  if (enemy.knockbacked > 0) {
    enemy.knockbacked--
    // lo sposto nella direzione opposta al giocatore
    var angle = atan2(player.pos.y - enemy.pos.y, player.pos.x - enemy.pos.x) - PI
    enemy.pos.add(createVector(enemy.knockback_speed * cos(angle), enemy.knockback_speed * sin(angle)))
  }
}

var enemies = ["Zombie", "Undead", "Witch", "Orc", "Kamikaze"]

var enemies_spawn_rate = [0.3, 0.3, 0.2, 0.1, 0.1]

class Zombie {
  constructor(id, pos) {
    this.id = id
    this.name = "Zombie"
    this.type = "melee"
    // carico le statistiche del nemico
    this.max_health = 64
    this.max_damage = 3
    this.max_speed = 2
    this.max_range = (player.w / 2 + player.w / 2 * sqrt(2))
    this.max_attack_rate = 60
    // e poi inizializzo i parametri
    this.health = this.max_health
    this.damage = this.max_damage
    this.speed = this.max_speed
    this.range = this.max_range
    this.attack_rate = this.max_attack_rate
    // e altre variabili
    this.pos = pos
    this.dir = createVector()
    this.timer = 0
    this.color = color(9, 110, 42)
    // inizializzo i timer degli status
    this.stunned = 0
    this.poisoned = 0
    this.burned = 0
    this.knockbacked = 0
    this.knockback_speed = 0
    // do le dimensioni al nemico
    this.w = 30
    this.h = 30
  }
}

class Undead {
  constructor(id, pos) {
    this.id = id
    this.name = "Undead"
    this.type = "ranged"
    // carico le statistiche del nemico
    this.max_health = 28
    this.max_damage = 4
    this.max_speed = 0
    this.max_range = width * sqrt(2)
    this.max_attack_rate = 90
    // e inizializzo i parametri
    this.health = this.max_health
    this.damage = this.max_damage
    this.speed = this.max_speed
    this.range = this.max_range
    this.attack_rate = this.max_attack_rate
    // do i parametri dei proiettili
    this.bullet_speed = 4
    this.bullet_rad = 3
    this.bullet_color = [color(96, 99, 97), color(40, 41, 40)]
    // inizializzo i timer degli status
    this.stunned = 0
    this.poisoned = 0
    this.burned = 0
    this.knockbacked = 0
    this.knockback_speed = 0
    // e altre variabili
    this.pos = pos
    this.health = this.max_health
    this.dir = createVector()
    this.timer = 0
    this.color = color(96, 99, 97)
    // do le dimensioni al nemico
    this.w = 30
    this.h = 30
  }
}

class Witch {
  constructor(id, pos) {
    this.id = id
    this.name = "Witch"
    this.type = "ranged"
    // carico le statistiche del nemico
    this.max_health = 45
    this.max_damage = 3
    this.max_speed = 2
    this.max_range = 200
    this.max_attack_rate = 120
    // inizializzo i parametri
    this.health = this.max_health
    this.damage = this.max_damage
    this.speed = this.max_speed
    this.range = this.max_range
    this.attack_rate = this.max_attack_rate
    // do i parametri dei proiettili
    this.bullet_speed = 2
    this.bullet_rad = 15
    this.bullet_color = [color(156, 17, 131, 120), color(79, 0, 65, 120)]
    // inizializzo i timer degli status
    this.stunned = 0
    this.poisoned = 0
    this.burned = 0
    this.knockbacked = 0
    this.knockback_speed = 0
    // e poi inizializzo i parametri
    this.pos = pos
    this.dir = createVector()
    this.timer = 0
    this.color = color(92, 0, 87)
    // do le dimensioni al nemico
    this.w = 30
    this.h = 30
  }
}

class Orc {
  constructor(id, pos) {
    this.id = id
    this.name = "Orc"
    this.type = "melee"
    // carico le statistiche del nemico
    this.max_health = 85
    this.max_damage = 5
    this.max_speed = 1.5
    this.max_range = (player.w / 2 + player.w / 2 * sqrt(2))
    this.max_attack_rate = 100
    // inizializzo i parametri
    this.health = this.max_health
    this.damage = this.max_damage
    this.speed = this.max_speed
    this.range = this.max_range
    this.attack_rate = this.max_attack_rate
    // inizializzo i timer degli status
    this.stunned = 0
    this.poisoned = 0
    this.burned = 0
    this.knockbacked = 0
    this.knockback_speed = 0
    // e altre variabilli
    this.pos = pos
    this.health = this.max_health
    this.dir = createVector()
    this.timer = 0
    this.color = color(140, 91, 45)
    // do le dimensioni al nemico
    this.w = 30
    this.h = 30
  }
}

class Kamikaze {
  constructor(id, pos) {
    this.id = id
    this.name = "Kamikaze"
    this.type = "melee"
    // carico le statistiche del nemico
    this.max_health = 13
    this.max_damage = 5
    this.max_speed = 3
    this.max_range = 50
    this.max_attack_rate = 1
    // inizializzo i parametri
    this.health = this.max_health
    this.damage = this.max_damage
    this.speed = this.max_speed
    this.range = this.max_range
    this.attack_rate = this.max_attack_rate
    // inizializzo i timer degli status
    this.stunned = 0
    this.poisoned = 0
    this.burned = 0
    this.knockbacked = 0
    this.knockback_speed = 0
    // e altre variabilli
    this.pos = pos
    this.health = this.max_health
    this.dir = createVector()
    this.timer = 0
    this.color = color(156, 27, 20)
    // do le dimensioni al nemico
    this.w = 30
    this.h = 30
  }
}
