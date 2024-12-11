function generate_World(num) {
  // creo l'array dei piani
  floors = []
  // per ogni piano
  for (var i = 0; i < num; i++) {
    // genero tutte le stanze
    floors[i] = new Floor(i, num + i + 1)
    // rimuovo i nemici dalla prima e da quella della scala
    floors[i].rooms[floors[i].ladder_room_index].enemies = []
  }
  // inizializzo il primo livello
  current_floor = 0
  current_room = 0
}

class Floor {
  constructor(index, num_room) {
    this.floor_index = index
    this.rooms = []
    this.remaining = num_room - 1
    this.tot_rooms = num_room
    // genero tutto il piano
    this.generate_floor()
    // aggiungo i muri alle stanze
    for (var i = 0; i < this.rooms.length; i++) {
      this.rooms[i].generate_walls()
    }
    // trovo l'indice della stanza più lontana da quella di partenza per mettere la scala
    this.ladder_room_index = this.find_room(0)
    this.rooms[this.ladder_room_index].ladder = true
    // trovo la stanza più lontana da quella di partenza e di arrivo per posizionare il tempio
    this.temple_room_index = this.find_temple_room(this.ladder_room_index)
    this.rooms[this.temple_room_index].temple = true
    // carico i boss a seconda dell'ambientazione e del piano
    switch (setting) {
      case "desert":
        switch (this.floor_index) {
          case 0:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 1:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 2:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 3:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 4:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
        }
        break;
      case "antartica":
        switch (this.floor_index) {
          case 0:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 1:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 2:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 3:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
          case 4:
            this.rooms[this.ladder_room_index].boss = new Cactus_king(id_enemy)
            break;
        }
        break;
      case "forest":
        switch (this.floor_index) {
          case 0:
            this.rooms[this.ladder_room_index].boss = new Treant(id_enemy)
            break;
          case 1:
            this.rooms[this.ladder_room_index].boss = new Treant(id_enemy)
            break;
          case 2:
            this.rooms[this.ladder_room_index].boss = new Treant(id_enemy)
            break;
          case 3:
            this.rooms[this.ladder_room_index].boss = new Treant(id_enemy)
            break;
          case 4:
            this.rooms[this.ladder_room_index].boss = new Treant(id_enemy)
            break;
        }
        break;
    }
    // aggiungo i nemici a tutte le stanze
    for (var i = 0; i < this.rooms.length; i++) {
      // tranne che alla prima e a quella del boss
      if (i != 0 && i != this.ladder_room_index) {
        this.rooms[i].generate_enemies(random([5, 6]))
      }
    }
  }

  generate_floor() {
    // creo la prima stanza: i due parametri sono l'array delle stanze e la posizione sulla griglia
    this.rooms.push(new Room(0, [null, null, null, null], createVector(0, 0)))
    while (this.remaining > 0) {
      // seleziono una delle stanze presenti e la salvo
      var current_room = this.select_room()
      // genero quindi una stanza adiacente a quella corrente
      this.generate_room(current_room)
      this.remaining--
    }
  }

  select_room() {
    // prendo randomicamente una stanza dall'array di quelle presenti
    var selection = random(this.rooms)
    // cerco una porta libera
    var allowed = false
    for (var i = 0; i < selection.doors.length; i++) {
      // controllo che la porta non sia bloccata da un muro
      var free_space = true
      for (var j = 0; j < this.rooms.length; j++) {
        // scelgo quale porta sta controllando e guardo in quella direzione
        switch (i) {
          case 0:
            if (this.rooms[j].pos.x == selection.pos.x && this.rooms[j].pos.y == selection.pos.y + 1) {
              free_space = false
            }
            break;
          case 1:
            if (this.rooms[j].pos.x == selection.pos.x + 1 && this.rooms[j].pos.y == selection.pos.y) {
              free_space = false
            }
            break;
          case 2:
            if (this.rooms[j].pos.x == selection.pos.x && this.rooms[j].pos.y == selection.pos.y - 1) {
              free_space = false
            }
            break;
          case 3:
            if (this.rooms[j].pos.x == selection.pos.x - 1 && this.rooms[j].pos.y == selection.pos.y) {
              free_space = false
            }
            break;
        }
      }
      if (!selection.doors[i] && free_space) {
        allowed = true
      }
    }
    // se non la trovo richiamo la funzione, altrimenti la "ritorno"
    if (!allowed) {
      return this.select_room()
    }
    return selection
  }

  generate_room(current_room) {
    // creo un'array per elencare le porte ancora libere nella stanza selezionata
    var free_doors = []
    for (var i = 0; i < current_room.doors.length; i++) {
      // controllo che la porta non sia bloccata da un muro
      var free_space = true
      for (var j = 0; j < this.rooms.length; j++) {
        // scelgo quale porta sta controllando e guardo in quella direzione
        switch (i) {
          case 0:
            if (this.rooms[j].pos.x == current_room.pos.x && this.rooms[j].pos.y == current_room.pos.y + 1) {
              free_space = false
            }
            break;
          case 1:
            if (this.rooms[j].pos.x == current_room.pos.x + 1 && this.rooms[j].pos.y == current_room.pos.y) {
              free_space = false
            }
            break;
          case 2:
            if (this.rooms[j].pos.x == current_room.pos.x && this.rooms[j].pos.y == current_room.pos.y - 1) {
              free_space = false
            }
            break;
          case 3:
            if (this.rooms[j].pos.x == current_room.pos.x - 1 && this.rooms[j].pos.y == current_room.pos.y) {
              free_space = false
            }
            break;
        }
      }
      if (!current_room.doors[i] && free_space) {
        free_doors.push(i)
      }
    }
    // e ne scelgo una per "attaccarci" una nuova stanza
    var new_door = random(free_doors)
    // creo l'array di porte della nuova stanza
    var new_room_doors = []
    // e le scorro per inserire i valori: null se è vuota, un numero se è adiacente ad un'altra stanza
    // (il numero corrisponderà all'indice della stanza adiacente nell'array iniziale)
    for (var i = 0; i < 4; i++) {
      new_room_doors[i] = null
    }
    // creo il collegamento della nuova porta con quella corrente e le do la posizione nella griglia
    current_room.doors[new_door] = this.tot_rooms - this.remaining
    switch (new_door) {
      case 0:
        new_room_doors[2] = current_room.index
        var position = createVector(current_room.pos.x, current_room.pos.y + 1)
        break;
      case 1:
        new_room_doors[3] = current_room.index
        var position = createVector(current_room.pos.x + 1, current_room.pos.y)
        break;
      case 2:
        new_room_doors[0] = current_room.index
        var position = createVector(current_room.pos.x, current_room.pos.y - 1)
        break;
      case 3:
        new_room_doors[1] = current_room.index
        var position = createVector(current_room.pos.x - 1, current_room.pos.y)
        break;
    }
    this.rooms.push(new Room(this.tot_rooms - this.remaining, new_room_doors, position))
  }

  find_room(start_index, end_index = false) {
    // creo un'array per le stanze e uno per salvare le distanze
    var rooms = []
    var distances = []
    // e per ognuna
    for (var i = 0; i < this.rooms.length; i++) {
      // inizializzo l'array con le connessioni della stanza
      var connections = []
      // controllo tutte le porte della stanza
      for (var j = 0; j < this.rooms[i].doors.length; j++) {
        // e le aggiungo solo se hanno un valore (!null)
        if (this.rooms[i].doors[j]) {
          connections.push(this.rooms[i].doors[j])
        }
      }
      // creo l'elemento stanza con un indice, le connessioni e una variabile che mi indica se ho già controllato la stanza
      var room = {
        index: this.rooms[i].index,
        connections: connections,
        visited: false
      }
      rooms.push(room)
    }
    // rendo la prima stanza (di indice start_index) visitata, con distanza 0
    distances.push([start_index])
    rooms[start_index].visited = true
    var d = 0
    distances.push([])
    var check = true
    // fino a che non visito tutte le stanze
    while (check) {
      // per ogni stanza con distanza "d"
      for (var i = 0; i < distances[d].length; i++) {
        // controllo tutte le stanze adiacenti ad essa
        for (var j = 0; j < rooms[distances[d][i]].connections.length; j++) {
          // se c'è il parametro end_index
          if (end_index != false) {
            // controllo che la stanza abbia indice end_index
            if (rooms[distances[d][i]].connections[j] == end_index) {
              // se l'ho trovato restituisco il valore della distanza
              return d + 1
            }
          }
          // e continuo a segnare le distanze
          // controllo se è già stata aggiunta
          if (!rooms[rooms[distances[d][i]].connections[j]].visited) {
            // aggiungo le sue adiacenti all'array, con distanza: d + 1
            rooms[rooms[distances[d][i]].connections[j]].visited = true
            distances[d + 1].push(rooms[distances[d][i]].connections[j])
          }
        }
      }
      check = false
      // controllo che non ci sono più stanze da visitare
      for (var i = 0; i < rooms.length; i++) {
        if (!rooms[i].visited) {
          check = true
        }
      }
      // se ci sono ancora stanze da controllare
      if (check) {
        // incremento la variabile "d"
        d++
        // e aggiungo un'array dentro quello delle distanze
        distances.push([])
      }
    }
    // se sono arrivato alla fine della funzione significa che devo restituire l'indice della stanza più lontana
    return random(distances[d + 1])
  }

  find_temple_room(ladder_room_index) {
    // inizializzo un'array in cui salvo tutte le distanze
    var distances = []
    // calcolo le distanze di tutte le stanze da quella iniziale e quella finale
    for (var i = 0; i < this.rooms.length; i++) {
      // il controllo viene fatto su tutte le stanze tranne quella iniziale e quella finale
      if (i != 0 && i != ladder_room_index) {
        // calcolo le distanze parziali: prima quella dalla stanza iniziale
        var dist_start = this.find_room(0, i)
        var dist_end = this.find_room(ladder_room_index, i)
        // aggiungo all'array le stanze e le rispettive distanze
        distances[i] = dist_start + dist_end
      } else {
        distances[i] = 0
      }
    }
    // controllo la stanza con la distanza totale più alta
    var max_distance = max(distances)
    // ne cerco l'indice
    for (var i = 0; i < distances.length; i++) {
      if (distances[i] == max_distance) {
        // e lo restituisco
        return i
      }
    }
  }
}

class Room {
  constructor(index, doors, pos) {
    this.index = index
    this.doors = doors
    this.ladder = false
    this.boss = false
    this.temple = false
    this.temple_active = false
    this.pos = pos
    if (index == 0) {
      this.visited = true
    } else {
      this.visited = false
    }
    this.cage = false
    // genero la griglia per posizionare gli ostacoli
    this.generate_grid(9)
    // aggiungo gli ostacoli
    this.obstacles = []
    this.generate_obstacles()
    // e gli oggetti sullo sfondo
    this.stuff = []
    if (setting == "desert") {
      this.generate_stuff()
    }
    // aggiungo l'array dei nemici: questi vengono caricati tutti dopo il completamento del piano
    this.enemies = []
    // variabili per le textures
    this.background_x = random(100)
    this.background_y = random(100)
  }

  update() {
    // disegno la stanza
    this.show()
    // per ogni nemico:
    for (var i = this.enemies.length - 1; i >= 0; i--) {
      // li mostro
      show_enemy(this.enemies[i])
      // li aggiorno se la stanza è in modalità cage
      if (this.cage) {
        update_enemy(this.enemies[i])
      }
      // controllo se deve morire
      if (enemy_death(this.enemies[i])) {
        this.enemies.splice(i, 1)
      }
    }
    // e se c'è un boss
    if (this.ladder) {
      // lo mostro
      this.boss.show()
      // e se sono nella stanza
      if (this.cage) {
        // lo aggiorno
        this.boss.update()
      }
    }
    // e chiudo le porte costringendo il player dentro la stanza
    if (this.cage) {
      player.pos.x = constrain(player.pos.x, 75 + player.w / 2, 525 - player.w / 2)
      player.pos.y = constrain(player.pos.y, 75 + player.h / 2, 525 - player.h / 2)
    }
  }

  show() {
    push()
    // disegno lo sfondo delle ambientazioni
    switch (setting) {
      case "desert":
        image(desert_background, 0, 0, 600, 600, this.background_x, this.background_y, 500, 500)
        break;
      case "antartica":
        image(antartica_background, 0, 0, 600, 600, this.background_x, this.background_y, 500, 500)
        break;
      case "forest":
        image(grassland_background, 0, 0, 600, 600, this.background_x, this.background_y, 500, 500)
        break;
    }
    noStroke()
    rectMode(CENTER, CENTER)
    // disegno le porte solo se la stanza è in modalità "cage"
    if (this.cage) {
      fill(setting_color[2])
      rect(width / 2, 75 / 2, 50, 75)
      rect(width / 2, 600 - 75 / 2, 50, 75)
      rect(75 / 2, height / 2, 75, 50)
      rect(600 - 75 / 2, height / 2, 75, 50)
    }
    // disegno i muri della stanza
    for (var i = 0; i < this.obstacles.length; i++) {
      var obs = this.obstacles[i]
      if (this.obstacles[i].w != 50) {
        fill(setting_color[1])
        rect(obs.pos.x, obs.pos.y, obs.w, obs.h)
      }
    }
    // disegno gli ostacoli
    for (var i = 0; i < this.obstacles.length; i++) {
      var obs = this.obstacles[i]
      if (this.obstacles[i].w == 50) {
        image(obs.sprite.img, obs.pos.x + obs.sprite.trns.x, obs.pos.y + obs.sprite.trns.y, obs.sprite.w, obs.sprite.h)
      }
      // mostro la cella di appartenenza
      // noFill()
      // stroke(0)
      // rect(obs.pos.x, obs.pos.y, obs.w, obs.h)
    }
    // disengo le cose
    for (var i = 0; i < this.stuff.length; i++) {
      var obj = this.stuff[i]
      image(obj.sprite.img, obj.pos.x + obj.sprite.trns.x, obj.pos.y + obj.sprite.trns.y, obj.sprite.w, obj.sprite.h)
      // mostro la cella di appartenenza
      // noFill()
      // stroke(0)
      // rect(obj.pos.x, obj.pos.y, obj.w, obj.h)
    }
    // se è la stanza con la scala disegno la scala
    if (this.ladder) {
      push()
      noFill()
      stroke(0)
      rect(width / 2, height / 2, 50, 50)
      pop()
    }
    // se è la stanza del tempio disegno il tempio
    if (this.temple) {
      // se è attivo
      if (this.temple_active) {
        image(temple_on, width / 2 - 75, height / 2 - 118, 150, 150)
      } else {
        image(temple_off, width / 2 - 75, height / 2 - 118, 150, 150)
      }
      // push()
      // noFill()
      // stroke(0)
      // rect(width / 2, height / 2, 50, 50)
      // pop()
    }
    pop()
  }

  generate_walls() {
    // muro superiore
    if (this.doors[0]) {
      this.obstacles.push({
        pos: createVector(275 / 2, 75 / 2),
        w: 275,
        h: 75
      })
      this.obstacles.push({
        pos: createVector(325 + 275 / 2, 75 / 2),
        w: 275,
        h: 75
      })
    } else {
      this.obstacles.push({
        pos: createVector(width / 2, 75 / 2),
        w: width,
        h: 75
      })
    }
    // muro di dx
    if (this.doors[1] ) {
      this.obstacles.push({
        pos: createVector(525 + 75 / 2, 275 / 2),
        w: 75,
        h: 275
      })
      this.obstacles.push({
        pos: createVector(525 + 75 / 2, 325 + 275 / 2),
        w: 75,
        h: 275
      })
    } else {
      this.obstacles.push({
        pos: createVector(525 + 75 / 2, height / 2),
        w: 75,
        h: height
      })
    }
    // muro inferiore
    if (this.doors[2] ) {
      this.obstacles.push({
        pos: createVector(275 / 2, 525 + 75 / 2),
        w: 275,
        h: 75
      })
      this.obstacles.push({
        pos: createVector(325 + 275 / 2, 525 + 75 / 2),
        w: 275,
        h: 75
      })
    } else {
      this.obstacles.push({
        pos: createVector(width / 2, 525 + 75 / 2),
        w: width,
        h: 75
      })
    }
    // muro di sx
    if (this.doors[3] ) {
      this.obstacles.push({
        pos: createVector(75 / 2, 275 / 2),
        w: 75,
        h: 275
      })
      this.obstacles.push({
        pos: createVector(75 / 2, 325 + 275 / 2),
        w: 75,
        h: 275
      })
    } else {
      this.obstacles.push({
        pos: createVector(75 / 2, height / 2),
        w: 75,
        h: height
      })
    }
  }

  generate_grid(n) {
    // genero la griglia
    this.grid = matrix(n, n)
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        this.grid[i][j] = true
      }
    }
  }

  generate_obstacles() {
    // per tutti gli ostacoli nella stanza
    for (var i = 0; i < random([3, 4, 5]); i++) {
      // seleziono l'ostacolo
      var obs
      switch (setting_selection % 3) {
        case 0:
          obs = random(desert_obstacles)
          break;
        case 1:
          obs = random(antartica_obstacles)
          break;
        case 2:
          obs = random(grassland_obstacles)
          break;
      }
      // carico l'oggetto con le variabili
      var cell = this.pick_cell()
      this.obstacles.push({
        sprite: obs,
        pos: createVector(75 + cell.x * 50 + 25, 75 + cell.y * 50 + 25),
        w: 50,
        h: 50
      })
    }
  }

  generate_stuff() {
    // per tutti gli oggetti nella stanza
    for (var i = 0; i < random([2, 3, 4]); i++) {
      // seleziono lo sprite
      var obj
      switch (setting_selection % 3) {
        case 0:
          obj = random(desert_stuff)
          break;
        case 1:
          obj = random(antartica_stuff)
          break;
        case 2:
          obj = random(grassland_stuff)
          break;
      }
      // carico l'oggetto con le variabili
      var cell = this.pick_cell()
      this.stuff.push({
        sprite: obj,
        pos: createVector(75 + cell.x * 50 + 25, 75 + cell.y * 50 + 25),
        w: 50,
        h: 50
      })
    }
  }

  generate_enemies(num) {
    for (var i = 0; i < num; i++) {
      var cell = this.pick_cell("enemy")
      var enemy_pos = createVector(75 + cell.x * 50 + 25, 75 + cell.y * 50 + 25)
      var new_enemy = pond_random(enemies, enemies_spawn_rate)
      switch (new_enemy) {
        case "Zombie":
          this.enemies.push(new Zombie(id_enemy, enemy_pos))
          break;
        case "Undead":
          this.enemies.push(new Undead(id_enemy, enemy_pos))
          break;
        case "Witch":
          this.enemies.push(new Witch(id_enemy, enemy_pos))
          break;
        case "Orc":
          this.enemies.push(new Orc(id_enemy, enemy_pos))
          break;
        case "Kamikaze":
          this.enemies.push(new Kamikaze(id_enemy, enemy_pos))
          break;
      }
      // inremento il codice nemico
      id_enemy++
    }
  }

  pick_cell(scope = null) {
    // scelgo randomicamente una cella e controllo se è piena
    var x = floor(random(9))
    var y = floor(random(9))
    // se la cella è piena o è di fronte alle porte
    if (!this.grid[x][y] || (x == 4 && y == 0) || (x == 4 && y == 8) || (x == 0 && y == 4) || (x == 8 && y == 4) || (x == 4 && y == 4)) {
      // riprovo di nuovo
      return this.pick_cell()
    }
    // se invece sto scegliendo la cella per un nemico
    else if (scope == "enemy") {
      // controllo se la cella è libera e non si trova al centro
      if (this.grid[x][y] && !(x == 4 && y == 4)) {
        // se la cella è nei paraggi di una porta aperta
        if (
          (this.doors[0] && (x >= 3 && x <= 5 && y >= 0 && y <= 1)) ||
          (this.doors[1] && (x >= 7 && x <= 8 && y >= 3 && y <= 5)) ||
          (this.doors[2] && (x >= 3 && x <= 5 && y >= 7 && y <= 8)) ||
          (this.doors[3] && (x >= 0 && x <= 1 && y >= 3 && y <= 5))
        ) {
          // non posso metterci un nemico, quindi riprovo
          return this.pick_cell("enemy")
        }
        // altrimenti la posso scegliere
        else {
          // quindi ne restituisco le coordinate
          this.grid[x][y] = false
          return createVector(x, y)
        }
      }
    }
    // se invece è vuota
    else {
      // la scelgo e ne restituisco le coordinate
      this.grid[x][y] = false
      return createVector(x, y)
    }
  }
}
