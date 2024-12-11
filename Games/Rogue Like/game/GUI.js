settings = ["Desert", "Antartica", "Grassland"]
var character_selection = 0
var setting_selection = 0
var setting_colors, setting

function menù() {
  push()
  switch (setting_selection % settings.length) {
    case 0:
      image(desert_menù, 0, 0, 600, 600)
      break;
    case 1:
      image(antartica_menù, 0, 0, 600, 600)
      break;
    case 2:
      image(grassland_menù, 0, 0, 600, 600)
      break;
  }
  // ambientazione centrale, dx e sx
  draw_setting(225, 390, 150, 90, (setting_selection + settings.length) % settings.length)
  draw_setting(420, 405, 100, 60, (setting_selection + settings.length + 1) % settings.length)
  draw_setting(75, 405, 100, 60, (setting_selection + settings.length - 1) % settings.length)
  // riquadro personaggio
  stroke(0)
  fill(180)
  rect(75, 60, 210, 210, 10)
  noStroke()
  fill(190)
  rect(90, 65, 180, 60, 10)
  draw_character(character_selection % characters.length, 180, 165, 120, 120)
  // nome del personaggio
  stroke(0)
  fill(180)
  rect(100, 25, 160, 50, 10)
  noStroke()
  fill(190)
  rect(120, 30, 120, 20, 10)
  fill(0)
  textAlign(CENTER, CENTER)
  textSize(25)
  switch (character_selection % 7) {
    case 0:
      text("Mage", 180, 52)
      break;
    case 1:
      text("Mech", 180, 52)
      break;
    case 2:
      text("Hunter", 180, 52)
      break;
    case 3:
      text("Knight", 180, 52)
      break;
    case 4:
      text("Assassin", 180, 52)
      break;
    case 5:
      text("Tank", 180, 52)
      break;
    case 6:
      text("Wall Breaker", 180, 52)
      break;
  }
  stroke(0)
  // pulsanti di selezione
  triangle(300, 150, 300, 180, 330, 165)
  triangle(60, 150, 60, 180, 30, 165)
  // elenco le statistiche
  switch (character_selection % characters.length) {
    case 0:
      var stats = [3, 3, 3, 4]
      break;
    case 1:
      var stats = [1, 5, 2, 3]
      break;
    case 2:
      var stats = [2, 3, 4, 4]
      break;
    case 3:
      var stats = [4, 3, 3, 3]
      break;
    case 4:
      var stats = [3, 3, 2, 5]
      break;
    case 5:
      var stats = [5, 3, 4, 2]
      break;
    case 6:
      var stats = [4, 2, 5, 3]
      break;
  }
  // e le disegno
  for (var i = 0; i < 4; i++) {
    fill(180)
    ellipse(390, 75 + i * 60, 30, 30)
    rect(420, 60 + i * 60, 150, 30)
    // do il colore
    switch (i) {
      case 0:
        fill(0, 255, 0)
        break;
      case 1:
        fill(255, 255, 0)
        break;
      case 2:
        fill(255, 0, 0)
        break;
      case 3:
        fill(0, 0, 255)
        break;
    }
    // riempio i quadrati in base al personaggio
    for (var j = 0; j < stats[i]; j++) {
      rect(420 + j * 30, 60 + i * 60, 30, 30)
    }
  }
  // arma e tipo
  fill(180)
  rect(75, 300, 165, 30)
  rect(75, 300, 30, 30)
  rect(75, 330, 165, 30)
  rect(75, 330, 30, 30)
  // abilità
  rect(360, 300, 210, 30)
  rect(360, 300, 30, 30)
  rect(360, 330, 210, 30)
  rect(360, 330, 30, 30)
  // start
  rect(150, 510, 300, 60, 10)
  noStroke()
  fill(190)
  rect(175, 520, 250, 20, 10)
  fill(0)
  textAlign(CENTER, CENTER)
  textSize(30)
  text("START", 300, 543)
  pop()
}

function mousePressed() {
  if (visualization == "Menù") {
    // selezione dei personaggio: successivo
    if (mouseX > 300 && mouseX < 330 && mouseY < 180 && mouseY > 150) {
      character_selection++
    }
    // selezione dei personaggio: precedente
    if (mouseX > 30 && mouseX < 60 && mouseY < 180 && mouseY > 150) {
      character_selection--
      if (character_selection < 0) {
        character_selection = characters.length - 1
      }
    }
    // selezione dell'ambientazione: successivo
    if (mouseX > 420 && mouseX < 535 && mouseY < 465 && mouseY > 405) {
      setting_selection++
    }
    // selezione dell'ambientazione: precedente
    if (mouseX > 75 && mouseX < 180 && mouseY < 465 && mouseY > 405) {
      setting_selection--
      if (setting_selection < 0) {
        setting_selection = settings.length - 1
      }
    }
    // tasto di start
    if (mouseX > 150 && mouseX < 450 && mouseY < 570 && mouseY > 510) {
      // passo alla visualizzazione del gioco
      visualization = "Game"
      // carico il personaggio
      switch (character_selection % 7) {
        case 0:
          player = new Mage()
          break;
        case 1:
          player = new Mech()
          break;
        case 2:
          player = new Hunter()
          break;
        case 3:
          player = new Knight()
          break;
        case 4:
          player = new Assassin()
          break;
        case 5:
          player = new Tank()
          break;
        case 6:
          player = new Wall_Breaker()
          break;
      }
      // inizializzo l'array di proiettili
      bullets = []
      // carico le ambientazioni
      switch (setting_selection % settings.length) {
        case 0:
          setting = "desert"
          break;
        case 1:
          setting = "antartica"
          break;
        case 2:
          setting = "forest"
          break;
      }
      // e i colori per ognuna (finchè non avremo gli sprites)
      switch (setting) {
        case "desert":
          setting_color = [color(240, 215, 148), color(242, 180, 118), color(226, 128, 106)]
          break;
        case "antartica":
          setting_color = [color(192, 249, 255), color(134, 212, 255), color(2, 153, 235)]
          break;
        case "forest":
          setting_color = [color(176, 255, 126), color(115, 201, 59), color(63, 144, 10)]
          break;
      }
      // genero il mondo
      generate_World(5)
    }
  }
  // se invece si è nel menù di pausa
  else if (visualization == "Pause") {
    // e si preme il tasto "quit"
    if (mouseX > 150 && mouseX < 450 && mouseY < 375 + 75 / 2 && mouseY > 375 - 75 / 2) {
      visualization = "Menù"
    }
  }
}

function draw_character(character, x, y, w, h) {
  var character_color
  push()
  switch (character) {
    case 0:
      character_color = color(20, 115, 156)
      break;
    case 1:
      character_color = color(207, 204, 202)
      break;
    case 2:
      character_color = color(2, 64, 23)
      break;
    case 3:
      character_color = color(105, 199, 176)
      break;
    case 4:
      character_color = color(42, 7, 87)
      break;
    case 5:
      character_color = color(235, 190, 28)
      break;
    case 6:
      character_color = color(217, 0, 0)
      break;
  }
  // disegno il corpo
  rectMode(CENTER, CENTER)
  translate(x, y)
  stroke(0)
  fill(character_color)
  rect(0, 0, w, h)

  // disegno l'arma
  rectMode(CENTER, CENTER)
  switch (character) {
    case 0:
      fill(135, 41, 1)
      rect(w / 2 - 40, 20, 20, h - 40)
      break;
    case 1:
      fill(0)
      rotate(atan2(mouseY - y, mouseX - x))
      rect(w / 2, 0, 100, 20)
      break;
    case 2:
      rectMode(CENTER, CENTER)
      noStroke()
      fill(84, 52, 31)
      rotate(atan2(mouseY - y, mouseX - x))
      rect(50, 0, 100, 16)
      stroke(84, 52, 31)
      noFill()
      strokeWeight(16)
      strokeCap(PROJECT)
      arc(80, 0, 40, 40, -PI / 2, PI / 2)
      break;
    case 3:
      rotate(atan2(mouseY - y, mouseX - x))
      fill(186, 186, 186)
      rect(140, 0, 280, 20)
      break;
    case 4:
      rotate(atan2(mouseY - y, mouseX - x))
      fill(110, 110, 110)
      triangle(60, -16, 60, 16, 132, 0)
      break;
    case 5:
      rotate(atan2(mouseY - y, mouseX - x))
      fill(110, 110, 110)
      rect(60, 0, 40, 40)
      break;
    case 6:
      rotate(atan2(mouseY - y, mouseX - x))
      // disegno il bastone
      fill(110, 38, 4)
      rect(100, 0, 160, 20)
      // disegno il martello
      fill(181, 181, 181)
      rect(200, 0, 80, 120)
      break;
  }
  pop()
}

function draw_setting(x, y, w, h, index) {
  push()
  // disegno il rettangolo
  stroke(0)
  rect(x, y, w, h)
  noStroke()
  fill(0)
  textAlign(CENTER, CENTER)
  textSize(map(w, 0, 150, 0, 30))
  switch (index) {
    case 0:
      image(desert_min, x + 1, y + 1, w - 1, h - 1)
      break;
    case 1:
      image(antartica_min, x + 1, y + 1, w - 1, h - 1)
      break;
    case 2:
      image(grassland_min, x + 1, y + 1, w - 1, h - 1)
      break;
  }
  pop()
}

function show_map(current_floor) {
  min_x = 0
  max_x = 0
  min_y = 0
  max_y = 0
  // per ogni stanza controllo se va oltre i minimi e i massimi e li sovrascrive
  for (var i = 0; i < floors[current_floor].rooms.length; i++) {
    if (floors[current_floor].rooms[i].pos.x < min_x) {
      min_x = floors[current_floor].rooms[i].pos.x
    }
    if (floors[current_floor].rooms[i].pos.x > max_x) {
      max_x = floors[current_floor].rooms[i].pos.x
    }
    if (floors[current_floor].rooms[i].pos.y < min_y) {
      min_y = floors[current_floor].rooms[i].pos.y
    }
    if (floors[current_floor].rooms[i].pos.y > max_y) {
      max_y = floors[current_floor].rooms[i].pos.y
    }
  }
  // trovo la media
  med_x = (min_x + max_x) / 2
  med_y = (min_y + max_y) / 2
  // e inizializzo la grandezza delle stanze nella mappa
  len = 50
  // disegno lo sfondo della mappa
  push()
  rectMode(CENTER, CENTER)
  translate(width / 2, height / 2)
  fill(setting_color[1])
  rect(0, 0, width, height)
  // per ogni stanza
  fill(setting_color[0])
  stroke(0)
  for (var i = 0; i < floors[current_floor].rooms.length; i++) {
    // disegno il rettangolo
    rect(
      (floors[current_floor].rooms[i].pos.x - med_x) * len * 2,
      -(floors[current_floor].rooms[i].pos.y - med_y) * len * 2, len, len
    )

    // scrivo il numero
    // push()
    // textAlign(CENTER, CENTER)
    // textSize(20)
    // noStroke()
    // fill(0)
    // text(i,
    //   (floors[current_floor].rooms[i].pos.x - med_x) * len * 2,
    //   -(floors[current_floor].rooms[i].pos.y - med_y) * len * 2
    // )
    // pop()

    // e le sue connessioni con le altre stanze
    if (floors[current_floor].rooms[i].doors[0]) {
      rect(
        (floors[current_floor].rooms[i].pos.x - med_x) * len * 2,
        -(floors[current_floor].rooms[i].pos.y - med_y) * len * 2 - len,
        len / 4, len
      )
    }
    if (floors[current_floor].rooms[i].doors[1]) {
      rect(
        (floors[current_floor].rooms[i].pos.x - med_x) * len * 2 + len,
        -(floors[current_floor].rooms[i].pos.y - med_y) * len * 2,
        len, len / 4
      )
    }
    if (floors[current_floor].rooms[i].doors[2]) {
      rect(
        (floors[current_floor].rooms[i].pos.x - med_x) * len * 2,
        -(floors[current_floor].rooms[i].pos.y - med_y) * len * 2 + len,
        len / 4, len
      )
    }
    if (floors[current_floor].rooms[i].doors[3]) {
      rect(
        (floors[current_floor].rooms[i].pos.x - med_x) * len * 2 - len,
        -(floors[current_floor].rooms[i].pos.y - med_y) * len * 2,
        len, len / 4
      )
    }
  }
  // inserisco il puntatore della posizione del giocatore nella mappa
  fill(50, 255, 50)
  ellipse(
    (floors[current_floor].rooms[current_room].pos.x - med_x) * len * 2 + map(player.pos.x, 0, width, -len / 2 + 7, len / 2 - 7),
    -(floors[current_floor].rooms[current_room].pos.y - med_y) * len * 2 + map(player.pos.y, 0, height, -len / 2 + 7, len / 2 - 7), 14
  )

  // copro le stanze che ancora non ho visitato
  fill(setting_color[2])
  noStroke()
  for (var x = min_x - 3; x <= max_x + 3; x++) {
    for (var y = min_y - 3; y <= max_y + 3; y++) {
      var room = false
      var room_index
      // controllo che in (x, y) non ci sia una stanza
      for (var i = 0; i < floors[current_floor].rooms.length; i++) {
        if (floors[current_floor].rooms[i].pos.x == x && floors[current_floor].rooms[i].pos.y == y) {
          room = true
          room_index = i
        }
      }
      // calcolo la posizione della cella
      var cell_pos = createVector((x - med_x) * 100, (y - med_y) * 100)
      // se la stanza c'è
      if (room) {
        // controllo se è stata visitata
        if (!floors[current_floor].rooms[room_index].visited) {
          // e la oscuro
          rect(cell_pos.x, -cell_pos.y, 100, 100)
        }
      }
      // altrimenti non c'è bisogno del controllo
      else {
        rect(cell_pos.x, -cell_pos.y, 100, 100)
      }
    }
  }

  pop()
}

function pause_button(x, y) {
  push()
  // velo lo sfondo con un background semitrasparente
  noStroke()
  fill(150, 150)
  rect(0, 0, 600, 600)
  // disegno il bottone
  stroke(0)
  fill(180)
  rectMode(CENTER, CENTER)
  translate(x, y)
  rect(0, 0, 100, 100, 20)
  fill(150)
  rect(-20, 0, 20, 60, 5)
  rect(20, 0, 20, 60, 5)
  pop()
}

function menu_button(x, y) {
  push()
  // disegno il bottone
  stroke(0)
  fill(180)
  rectMode(CENTER, CENTER)
  translate(x, y)
  rect(0, 0, 300, 75, 10)
  textAlign(CENTER, CENTER)
  textSize(40)
  noStroke()
  fill(0)
  text("Quit", 0, 3)
  pop()
}

function info() {
  push()
  // disegno il mirino
  noCursor()
  noFill()
  stroke(0)
  strokeWeight(2)
  ellipse(mouseX, mouseY, 20, 20)
  line(mouseX - 10, mouseY, mouseX + 10, mouseY)
  line(mouseX, mouseY - 10, mouseX, mouseY + 10)
  line(mouseX - 5, mouseY - 2, mouseX - 5, mouseY + 2)
  line(mouseX + 5, mouseY - 2, mouseX + 5, mouseY + 2)
  line(mouseX - 2, mouseY - 5, mouseX + 2, mouseY - 5)
  line(mouseX - 2, mouseY + 5, mouseX + 2, mouseY + 5)
  // disegno le vite
  for (var i = 0; i < 5; i++) {
    if (player.lives > i) {
      image(filled_heart, 15 + i * 50, 15, 45, 45)
    } else {
      image(empty_heart, 15 + i * 50, 15, 45, 45)
    }
  }
  // indico al giocatore i comandi di movimento
  textSize(20)
  textAlign(CENTER, CENTER)
  // indico al giocatore come si attacca
  fill(0)
  stroke(0)
  strokeWeight(1)
  text("Hold", 75 / 2, height - 75 / 2)
  text("to shoot", 155, height - 75 / 2)
  // disengo il mouse
  fill(200)
  ellipse(90, height - 75 / 2, 24, 30)
  line(90 - 12, height - 75 / 2, 90 + 12, height - 75 / 2)
  fill(150)
  beginShape()
  vertex(90, height - 75 / 2)
  vertex(90, height - 75 / 2 - 15)
  bezierVertex(90, height - 75 / 2 - 15, 90 - 12, height - 75 / 2 - 15, 90 - 12, height - 75 / 2)
  endShape(CLOSE)
  // indico al giocatore quando può usare la skill
  textSize(18)
  fill(0)
  if (player.skill >= 3) {
    text('Press "Q" for the special ability', width - 135, height - 75 / 2)
  }
  // indico al giocatore quando può salire di livello
  if (
    dist(player.pos.x, player.pos.y, 300, 300) < 90 &&
    floors[current_floor].rooms[current_room].temple &&
    !floors[current_floor].rooms[current_room].temple_active &&
    !floors[current_floor].rooms[current_room].cage
  ) {
    text('Press "F" to level up your character', 300, 200)
  }
  // indico al giocatore quando può passare al piano successivo
  if (
    player.pos.x > width / 2 - 15 && player.pos.x < width / 2 + 15 &&
    player.pos.y > height / 2 - 15 && player.pos.y < height / 2 + 15 &&
    floors[current_floor].rooms[current_room].ladder &&
    !floors[current_floor].rooms[current_room].cage
  ) {
    text('Press "F" to go up to the next floor', 300, 200)
  }
  pop()
}
