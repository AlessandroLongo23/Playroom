var current_floor, current_room, visualization

function setup() {
   createCanvas(600, 600)

   visualization = "Menù"
}

function draw() {
   if (visualization == "Menù") {
      cursor(ARROW)
      menù()
   } else if (visualization == "Game") {
      floors[current_floor].rooms[current_room].update()
      update_player()
      for (var i = 0; i < bullets.length; i++)
         bullets[i].update()

      bullets_hit()
      show_player()
      input_key()
      info()
   } else if (visualization == "Pause") {
      cursor(ARROW)
      floors[current_floor].rooms[current_room].show()
      show_player()
      pause_button(width / 2, height / 2 - 75)
      menu_button(width / 2, height / 2 + 75)
   }
}

function keyPressed() {
   if (keyCode == 27) {
      if (visualization == "Game") {
         visualization = "Pause"
      } else if (visualization == "Pause") {
         visualization = "Game"
      }
   }
}

class Bullet {
   constructor(id_enemy, side, pos, angle, speed, damage, rad, color, follow = false, exploding = false, pierce = false, ghost = false, scatter = 1) {
      this.id_enemy = id_enemy
      this.side = side
      this.pos = createVector(pos.x, pos.y)
      this.dir = createVector(cos(angle), sin(angle))
      this.speed = speed
      this.damage = damage
      this.rad = rad
      this.color = color
      this.timer = 0

      this.exploding = exploding
      this.follow = follow
      if (this.pierce)
         this.hit_enemies = []
      
      this.ghost = ghost
      this.scatter = scatter < player.scatter_rate
   }

   update() {
      if (this.follow == "player") {
         var angle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x)
         this.dir = createVector(cos(angle), sin(angle))
      } else if (this.follow == "witch") {
         var target
         for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++)
            if (this.id_enemy == floors[current_floor].rooms[current_room].enemies[i].id)
               target = floors[current_floor].rooms[current_room].enemies[i]
         
         var angle = atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x)
         this.dir = createVector(cos(angle), sin(angle))
      }

      this.pos.add(createVector(this.speed * this.dir.x, this.speed * this.dir.y))
      this.show()
      this.timer++
   }

   show() {
      fill(this.color[0])
      stroke(this.color[1])
      ellipse(this.pos.x, this.pos.y, this.rad * 2)
   }
}

function bullets_hit() {
   for (var b = bullets.length - 1; b >= 0; b--) {
      var remove = false
      if (bullets[b].side == "player") {
         for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
            var enemy = floors[current_floor].rooms[current_room].enemies[i]
            if (abs(bullets[b].pos.x - enemy.pos.x) < enemy.w / 2 && abs(bullets[b].pos.y - enemy.pos.y) < enemy.h / 2) {
               if (bullets[b].pierce) {
                  remove = false
                  var hit = true
                  for (var j = 0; j < bullets[b].hit_enemies.length; j++)
                     if (enemy.id == bullets[b].hit_enemies[j])
                        hit = false

                  if (hit) {
                     enemy.health -= bullets[b].damage
                     bullets[b].hit_enemies.push(enemy.id)
                  }
               } else {
                  enemy.health -= bullets[b].damage
                  remove = true
               }
            }
         }

         if (
            floors[current_floor].rooms[current_room].index == floors[current_floor].ladder_room_index &&
            floors[current_floor].rooms[current_room].boss.health > 0
         ) {
            var enemy = floors[current_floor].rooms[floors[current_floor].ladder_room_index].boss
            if (abs(bullets[b].pos.x - enemy.pos.x) < enemy.w / 2 && abs(bullets[b].pos.y - enemy.pos.y) < enemy.h / 2) {
               if (bullets[b].pierce) {
                  remove = false
                  var hit = true
                  for (var j = 0; j < bullets[b].hit_enemies.length; j++)
                     if (enemy.id == bullets[b].hit_enemies[j])
                        hit = false

                  if (hit) {
                     enemy.health -= bullets[b].damage
                     bullets[b].hit_enemies.push(enemy.id)
                  }
               } else {
                  enemy.health -= bullets[b].damage
                  remove = true
               }
            }
         }
      } else {
         if (abs(bullets[b].pos.x - player.pos.x) < player.w / 2 && abs(bullets[b].pos.y - player.pos.y) < player.h / 2) {
            get_damage(bullets[b].damage)
            remove = true
         }
      }

      if (!bullets[b].ghost) {
         for (var i = 0; i < floors[current_floor].rooms[current_room].obstacles.length; i++) {
            var obs = {
               pos: createVector(
                  floors[current_floor].rooms[current_room].obstacles[i].pos.x,
                  floors[current_floor].rooms[current_room].obstacles[i].pos.y
               ),
               w: floors[current_floor].rooms[current_room].obstacles[i].w,
               h: floors[current_floor].rooms[current_room].obstacles[i].h
            }

            if (abs(bullets[b].pos.x - obs.pos.x) < obs.w / 2 && abs(bullets[b].pos.y - obs.pos.y) < obs.h / 2) {
               remove = true
               if (character_selection % 7 == 1 && player.level >= 3 && bullets[b].scatter) {
                  var position = bullets[b].pos.sub(bullets[b].dir.mult(bullets[b].speed * 2))
                  var angle = random(PI / 4)
                  for (var j = 0; j < 8; j++)
                     bullets.push(new Bullet(0, "player", position, j * PI / 4 + angle, 2.5, 8, 2, [color(99, 250, 85), color(16, 97, 9)]))
               }
            }
         }
      }

      if (bullets[b].follow != false && bullets[b].timer > 240)
         remove = true

      if (character_selection % 7 == 3 && player.level >= 3 && mouseIsPressed) {
         var bullet_angle = atan2(bullets[b].pos.y - player.pos.y, bullets[b].pos.x - player.pos.x)
         var sword_angle = player.attack_range / 2 * (abs(sin(PI * player.timer / player.attack_rate)) / sin(PI * player.timer / player.attack_rate)) * pow(abs(sin(PI * player.timer / player.attack_rate)), 1 / 3)
         var dir_angle = weapon_direction()
         var hitbox_angle = PI / 4
         var d = dist(player.pos.x, player.pos.y, bullets[b].pos.x, bullets[b].pos.y)
         if (
            bullets[b].side == "enemy" &&
            d < player.attack_rad &&
            bullet_angle > dir_angle + sword_angle - hitbox_angle / 2 &&
            bullet_angle < dir_angle + sword_angle + hitbox_angle / 2
         ) {
            if (random() < 0.3) {
               bullets[b].dir.mult(-1)
               bullets[b].side = "player"
               bullets[b].damage *= 2
               bullets[b].follow = "witch"
            }
         }
         rect(player.attack_rad / 2, 0, player.attack_rad, 5)
      }

      if (remove) {
         if (bullets[b].exploding) {
            for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
               var enemy = floors[current_floor].rooms[current_room].enemies[i]
               if (dist(enemy.pos.x, enemy.pos.y, bullets[b].pos.x, bullets[b].pos.y) < player.expl_bullet_rad)
                  enemy.health -= bullets[b].damage
            }
         }
         bullets.splice(b, 1)
      }
   }
}

function check_collision(a, b, fixed = false) {
   if (abs(a.pos.x - b.pos.x) < a.w / 2 + b.w / 2 && abs(a.pos.y - b.pos.y) < a.h / 2 + b.h / 2) {
      if ((b.pos.x - a.pos.x) / a.w > 0 && (b.pos.x - a.pos.x) / a.w > abs((b.pos.y - a.pos.y) / a.h)) {
         if (fixed) {
            b.pos.x = a.pos.x + a.w / 2 + b.w / 2
         } else {
            var delta_x = a.w / 2 + b.w / 2 - (b.pos.x - a.pos.x)
            a.pos.x -= delta_x / 2
            b.pos.x += delta_x / 2
         }
      } else if ((b.pos.x - a.pos.x) / a.w < 0 && (b.pos.x - a.pos.x) / a.w < -abs((b.pos.y - a.pos.y) / a.h)) {
         if (fixed) {
            b.pos.x = a.pos.x - a.w / 2 - b.w / 2
         } else {
            var delta_x = a.w / 2 + b.w / 2 - (a.pos.x - b.pos.x)
            a.pos.x += delta_x / 2
            b.pos.x -= delta_x / 2
         }
      } else if ((b.pos.y - a.pos.y) / a.h > 0 && (b.pos.y - a.pos.y) / a.h > abs((b.pos.x - a.pos.x) / a.w)) {
         if (fixed) {
            b.pos.y = a.pos.y + a.h / 2 + b.h / 2
         } else {
            var delta_y = a.h / 2 + b.h / 2 - abs(b.pos.y - a.pos.y)
            a.pos.y -= delta_y / 2
            b.pos.y += delta_y / 2
         }
      } else if ((b.pos.y - a.pos.y) / a.h < 0 && (b.pos.y - a.pos.y) / a.h < -abs((b.pos.x - a.pos.x) / a.w)) {
         if (fixed) {
            b.pos.y = a.pos.y - a.h / 2 - b.h / 2
         } else {
            var delta_y = a.h / 2 + b.h / 2 - abs(a.pos.y - b.pos.y)
            a.pos.y += delta_y / 2
            b.pos.y -= delta_y / 2
         }
      }
   }
}

function input_key() {
   if (keyIsDown(77))
      show_map(current_floor)

   if (keyIsDown(70)) {
      if (
         player.pos.x > width / 2 - 15 && player.pos.x < width / 2 + 15 &&
         player.pos.y > height / 2 - 15 && player.pos.y < height / 2 + 15 &&
         floors[current_floor].rooms[current_room].ladder &&
         !floors[current_floor].rooms[current_room].cage
      ) {
         current_floor++
         current_room = 0
         player.health = player.max_health
      } else if (
         dist(player.pos.x, player.pos.y, width / 2, height / 2) < 30 &&
         floors[current_floor].rooms[current_room].temple &&
         !floors[current_floor].rooms[current_room].temple_active &&
         !floors[current_floor].rooms[current_room].cage
      ) {
         floors[current_floor].rooms[current_room].temple_active = true
         player.level++
         player.health = player.max_health

         switch (player.level) {
            case 1:
               switch (player.name) {
                  case "Mage":
                     // al mago viene aumentato il raggio dei proiettili: 10px --> 20px
                     player.bullet_rad = 20
                     break;
                  case "Mech":
                     // al mech viene aumentato il rateo di fuoco nei primi due secondi di cage in ogni stanza: 20f/b --> 10f/b
                     break;
                  case "Hunter":
                     // al cacciatore viene aggiunto il dardo penetrante: 20% di probabilità di attraversare i nemici
                     break;
                  case "Knight":
                     // al cavaliere viene incrementato l'angolo di swing: 90° --> 135°
                     player.attack_range = PI * 3 / 4
                     break;
                  case "Assassin":
                     // all'assassino viene aggiunta la possibilità di infliggere un attacco critico
                     break;
                  case "Tank":
                     // il tank guadagna l'abilità di knockback ad ogni attacco: 10px
                     player.knockback = true
                     break;
                  case "Wall_Breaker":
                     // il wall breaker riceve un aumento dell'area di impatto del martello: 30 --> 50
                     player.attack_rad = 50
                     break;
               }
               break;
            case 2:
               switch (player.name) {
                  case "Mage":
                     // adesso il mago stunna sempre e il tempo di stun è cumulabile
                     break;
                  case "Mech":
                     // alla torretta del mech aumenta il dire rate: 15f/b --> 10f/b
                     player.turret_fire_rate = 10
                     break;
                  case "Hunter":
                     // aumenta il raggio dell'esplosione e il danno del dardo esplosivo del cacciatore
                     player.expl_bullet_rad = 75
                     player.expl_bullet_dmg = 40
                     break;
                  case "Knight":
                     // il cavaliere fa knockback con l'abilità e il raggio di swing e il danno sono maggiori
                     this.knockback = true
                     this.swing_dmg = 32
                     this.swing_rad = 120
                     break;
                  case "Assassin":
                     // l'assassino copre un'area maggiore con il dash e fa più danno
                     player.dash_width = 90
                     player.dash_damage = 40
                     break;
                  case "Tank":
                     // il tank al livello 2 rigenera la vita del 50% se è al di sotto del 25%
                     break;
                  case "Wall_Breaker":
                     // il tempo di boost è più lungo: 5s --> 10s e il rateo d'attacco aumenta: 45f/a --> 30f/a
                     player.boost_time = 600
                     player.boost_time_rate = 30
                     break;
               }
               break;
            case 3:
               switch (player.name) {
                  case "Mage":
                     // i proiettili del mago passano attraverso i muri
                     break;
                  case "Mech":
                     // quando i proiettili impattono una superfice esplodono in 8 proiettili minori
                     break;
                  case "Hunter":
                     // il fire rate del cacciatore incrementa: 50f/p --> 40f/p
                     player.attack_rate = 40
                     break;
                  case "Knight":
                     // il cavaliere ha una probabilità di riflettere i proiettili dei nemici che colpisce con la spada
                     break;
                  case "Assassin":
                     // gli attacchi dell'assassino hanno il 10% di probabilità di essere velenosi
                     break;
                  case "Tank":
                     // se colpisce un nemico, il tank fa knockback anche a quelli vicini che non colpisce, ma non danno
                     break;
                  case "Wall_Breaker":
                     // il wall breaker ha una probabilità del 25% di stunnare i nemici con il martello
                     break;
               }
               break;
            case 4:
               // al livello 4 attivo la seconda abilità a tutti i personaggi
               player.talent = true
               break;
            case 5:
               switch (player.name) {
                  case "Mage":
                     // quando crea la scia di fuoco brucia sempre i nemici
                     player.burn_rate = 1
                     break;
                  case "Mech":
                     // quando sta usando il talento i proiettili esplodono sempre all'impatto con gli ostacoli
                     player.scatter_rate = 1
                     break;
                  case "Hunter":
                     //
                     break;
                  case "Knight":
                     //
                     break;
                  case "Assassin":
                     // quando è invisibile tutti gli attacchi dell'assassino sono velenosi e critici
                     break;
                  case "Tank":
                     //
                     break;
                  case "Wall_Breaker":
                     // il Wall_Breaker fa knockback quando usa il talento
                     break;
               }
               break;
         }
      }
   }
   // uso la prima abilità con "q"
   if (keyIsDown(81)) {
      // se si è in modalità cage e il giocatore ha l'abilità pronta
      if (player.skill >= 3 && floors[current_floor].rooms[current_room].cage) {
         // la usa e si resetta
         player.skill = 0
         // controllo che personaggio ha attivo l'abilità
         switch (player.name) {
            case "Mage":
               // il mago evoca tre fulmini che colpiscono nemici casuali:
               for (var i = 0; i < 3; i++) {
                  // scelgo un nemico e gli faccio danno
                  var target = random(floors[current_floor].rooms[current_room].enemies)
                  target.health -= 32
                  // e a seconda del livello del mago
                  if (player.level == 0 || player.level == 1) {
                     // stunna per 120 frames (2 secondi) con una probabilità del 30%
                     if (random() < 0.3) {
                        target.stunned = 120
                     }
                  } else {
                     // stunna il 100% delle volte per 120 frames cumulabili (2 secondi)
                     target.stunned += 120
                  }
               }
               break;
            case "Mech":
               // il mech ha una torretta che spara ai nemici per un tempo massimo di 10 secondi
               player.skill_timer = 600
               // aziono la torretta
               player.turret_active = true
               player.turret_pos = createVector(player.pos.x, player.pos.y)
               break;
            case "Hunter":
               // il cacciatore spara un dardo che esplode all'impatto
               bullets.push(new Bullet(0, "player", player.pos, weapon_direction(), player.bullet_speed * 1.5, player.damage, player.bullet_rad, player.bullet_color, false, true))
               break;
            case "Knight":
               // il cavaliere effettua un giro su se stesso colpendo tutti i nemici nel raggio d'attacco
               for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
                  var enemy = floors[current_floor].rooms[current_room].enemies[i]
                  // per ogni nemico nella stanza controllo se è abbastanza vicino al cavaliere
                  if (dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y) < player.swing_rad) {
                     enemy.health -= player.swing_dmg
                     // e se il cavaliere è almeno di livello 2
                     if (player.level >= 2) {
                        enemy.knockbacked = 60
                        enemy.knockback_speed = 2
                     }
                  }
               }
               break;
            case "Assassin":
               // l'assassino dasha per 30 frames attraverso 300 px (10 px/s)
               player.skill_timer = 30
               // salvo la sua direzione per mantenerla durante tutto il dash
               player.dash_angle = weapon_direction()
               break;
            case "Tank":
               // il tank diventa invincibile per 6 secondi (360 frames)
               player.skill_timer = 360
               // e se è al livello 2
               if (player.level >= 2) {
                  // e se la vita è più bassa del 25% ne riguadagna metà
                  if (player.health < player.max_health / 4) {
                     player.health += player.max_health / 2
                  }
               }
               break;
            case "Wall_Breaker":
               // il wall breaker aumenta la sua velocità e danni per tot secondi
               player.skill_timer = player.boost_time
               break;
         }
      }
   }
   // e la seconda con "e"
   if (keyIsDown(69)) {
      // se il giocatore è al livello 4 o superiore e ha il talento pronto
      if (player.level >= 4 && player.talent >= 1800) {
         // riazzero il timer del talento
         player.talent = 0
         // e attivo il talento
         switch (player.name) {
            case "Mage":
               // il mago crea un cono di fuoco che investe i nemici davanti a lui
               for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
                  // per ogni nemico "enemy"
                  var enemy = floors[current_floor].rooms[current_room].enemies[i]
                  // calcolo la distanza del nemico e gli angoli in gioco
                  var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
                  var angle = atan2(player.pos.y - enemy.pos.y, player.pos.x - enemy.pos.x) - weapon_direction()
                  // se il nemico si trova nel cono di fuoco
                  if (abs(d * cos(angle)) > 0.1 * sq(d * sin(angle))) {
                     enemy.health -= 56
                     // e c'è una probabilità del 25% che il nemico venga bruciato
                     if (random() < player.burn_rate) {
                        enemy.burned = 120
                     }
                  }
               }
               break;
            case "Mech":
               // il mech spara proiettili doppi per 3 secondi
               player.talent_timer = 180
               break;
            case "Hunter":
               // il cacciatore spara tre frecce
               for (var i = -1; i <= 1; i++) {
                  bullet = new Bullet(0, "player", player.pos, weapon_direction() + (i * PI / 12), player.bullet_speed, 56, player.bullet_rad, player.bullet_color, false, false, true)
                  bullets.push(bullet)
               }
               break;
            case "Knight":
               // il cavaliere è protetto da tre attacchi
               player.armor = 3
               break;
            case "Assassin":
               // l'assassino diventa invisibile per 4 secondi
               player.talent_timer = 240
               break;
            case "Tank":
               for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
                  var enemy = floors[current_floor].rooms[current_room].enemies[i]
                  var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
                  var sub_angle = enemy_angle - weapon_direction()
                  var d = dist(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y)
                  if (
                     d * cos(sub_angle) < player.attack_depth &&
                     d * cos(sub_angle) > 0 &&
                     abs(d * sin(sub_angle)) < player.attack_width
                  ) {
                     enemy.health -= 64
                     enemy.knockbacked = 64
                     enemy.knockback_speed = 10
                  }
               }
               break;
            case "Wall_Breaker":
               for (var i = 0; i < floors[current_floor].rooms[current_room].enemies.length; i++) {
                  var enemy = floors[current_floor].rooms[current_room].enemies[i]
                  var enemy_angle = atan2(enemy.pos.y - player.pos.y, enemy.pos.x - player.pos.x)
                  if (
                     enemy_angle > weapon_direction() - PI / 8 &&
                     enemy_angle < weapon_direction() + PI / 8
                  ) {
                     enemy.health -= 56
                     enemy.stunned = 180
                     if (player.level == 5) {
                        enemy.knockbacked = 50
                        enemy.knockback_speed = 3
                     }
                  }
               }
               break;
         }
      }
   }
}

function reload_player() {
   floors[current_floor].rooms[current_room].cage = false
   var free_spots = []
   for (var i = 0; i < floors[current_floor].rooms[current_room].doors.length; i++) {
      if (floors[current_floor].rooms[current_room].doors[i]) {
         if (floors[current_floor].rooms[floors[current_floor].rooms[current_room].doors[i]].visited) {
            switch (i) {
               case 0:
                  var spot = createVector(width / 2, 75 / 2)
                  break;
               case 1:
                  var spot = createVector(width - 75 / 2, height / 2)
                  break;
               case 2:
                  var spot = createVector(width / 2, height - 75 / 2)
                  break;
               case 3:
                  var spot = createVector(75 / 2, height / 2)
                  break;
            }
            free_spots.push(spot)
         }
      }
   }

   player.pos = random(free_spots)
   player.health = player.max_health
   player.lives--
   if (player.lives == 0)
      visualization = "Menù"
}

// function change_character() {
//   if (!floors[current_floor].rooms[current_room].cage) {
//     if (keyIsDown(49)) {
//       player = new Mage()
//       character_selection = characters[0]
//     } else if (keyIsDown(50)) {
//       player = new Mech()
//       character_selection = characters[1]
//     } else if (keyIsDown(51)) {
//       player = new Hunter()
//       character_selection = characters[2]
//     } else if (keyIsDown(52)) {
//       player = new Knight()
//       character_selection = characters[3]
//     } else if (keyIsDown(53)) {
//       player = new Tank()
//       character_selection = characters[4]
//     } else if (keyIsDown(54)) {
//       player = new Assassin()
//       character_selection = characters[5]
//     } else if (keyIsDown(55)) {
//       player = new Wall_Breaker()
//       character_selection = characters[6]
//     }
//   }
// }
