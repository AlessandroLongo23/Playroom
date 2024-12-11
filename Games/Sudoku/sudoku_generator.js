// la variabile "sorted" tiene traccia se ho scambiato, sistemandola, la cella che era al posto sbagliato
var sorted, row_values, col_values

function generate_grid() {
  // creo la matrice 9x9
  cells = matrix(9, 9)
  // in ogni posizione della griglia creo un oggetto cella
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      cells[i][j] = new Cell(i, j)
    }
  }
  // creo una variabile per segnare la lunghezza delle celle (in px)
  len = floor(width / 9)
}

function generate_sudoku(liv) {
  // setto il cronometro a 0
  time = 0
  // svuoto la griglia...
  clear_grid()
  // ...la carico con numeri casuali...
  fill_grid()
  // ...e poi la correggo
  fix_grid()
  // infine cancello dei numeri in base al livello
  cancelNumbers(liv)
}

function cancelNumbers(liv) {
  // inizializzo un counter per i numeri da eliminare
  var counter
  switch (liv) {
    case 1:
      counter = floor(random(40, 46))
      break;
    case 2:
      counter = floor(random(46, 52))
      break;
    case 3:
      counter = floor(random(52, 58))
      break;
    case 4:
      counter = floor(random(58, 64))
      break;
  }
  // finchè il counter non arriva a zero
  while (counter > 0) {
    // prendo una cella a caso
    x = random([0, 1, 2, 3, 4, 5, 6, 7, 8])
    y = random([0, 1, 2, 3, 4, 5, 6, 7, 8])
    // e se non è già stata cancellata
    if (cells[x][y].num != 0) {
      // la cancello
      cells[x][y].num = 0
      cells[x][y].fixed = false
      // e decremento il counter
      counter--
    }
  }
}

function clear_grid() {
  // per ogni cella
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      // setto il valore a 0
      cells[i][j].num = 0
      cells[i][j].p_num = []
      // e setto la variabile sorted a false (devono essere tutte sistemate)
      cells[i][j].correct = false
      cells[i][j].row_sorted = false
      cells[i][j].col_sorted = false
      cells[i][j].fixed = true
      cells[i][j].highlighted = false
    }
  }
}

function clean_numbers() {
  // per ogni cella
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      // se il numero non è fisso
      if (!cells[i][j].fixed) {
        // setto il numero a 0
        cells[i][j].num = 0
        cells[i][j].p_num = []
      }
    }
  }
}

function fill_grid() {
  // per ogni quadrante
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      // creo un array con i numeri da 1 a 9 mischiati
      var shuffled_nums = shuffle(numbers)
      // e in ogni cella del quadrante
      for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
          cells[i * 3 + x][j * 3 + y].num = shuffled_nums[x * 3 + y]
        }
      }
    }
  }
}

function fix_grid() {
  // per 9 volte
  for (n = 0; n < 8; n++) {
    // correggo l'n-esima riga
    fix_row(n)
    // correggo l'n-esima colonna
    fix_col(n)
  }
}

function fix_row(n) {
  // creo un'array con i valori della riga
  row_values = []
  // scorro le celle della n-esima riga
  for (var i = 0; i < 9; i++) {
    // se il valore della cella non è presente all'interno della riga
    if (!row_values.includes(cells[i][n].num)) {
      // lo aggiungo all'array
      row_values.push(cells[i][n].num)
      // è sistemato
      cells[i][n].row_sorted = true
    }
    // altrimenti è sbagliato e va scambiato
    else {
      // c'è un problema
      sorted = false
      // se non è ancora stato sistemato in una colonna
      if (!cells[i][n].col_sorted) {
        // lo scambio con tutti quelli nel suo quadrante
        box_swap("row", i, n)
      }
      // se invece è già stato sistemato in una colonna
      else {
        // lo scambio solo con quelli adiacenti nel suo quadrante
        adj_swap("row", i, n)
      }
    }
  }
}

function fix_col(n) {
  // creo un'array con i valori della colonna
  col_values = []
  // scorro le celle della n-esima colonna
  for (var j = 0; j < 9; j++) {
    // se il valore della cella non è presente all'interno della riga
    if (!col_values.includes(cells[n][j].num)) {
      // lo aggiungo all'array
      col_values.push(cells[n][j].num)
      // è sistemato
      cells[n][j].col_sorted = true
    }
    // altrimenti è sbagliato e va scambiato
    else {
      // c'è un problema
      sorted = false
      // se non è ancora stato sistemato in una riga
      if (!cells[n][j].row_sorted) {
        // lo scambio con tutti quelli nel suo quadrante
        box_swap("col", n, j)
      }
      // se invece è già stato sistemato in una riga
      else {
        // lo scambio solo con quelli adiacenti nel suo quadrante
        adj_swap("col", n, j)
      }
    }
  }
}

function box_swap(dir, i, j, duplicate = false) {
  // se sto sistemando una riga
  if (dir == "row") {
    // per ogni cella nel quadrante: A = (i, j); B = (x, y)
    for (var y = j - (j % 3); y <= j - (j % 3) + 2; y++) {
      for (var x = i - (i % 3); x <= i - (i % 3) + 2; x++) {
        if (
          !sorted && y > j &&
          !cells[x][y].row_sorted && !cells[x][y].col_sorted &&
          !row_values.includes(cells[x][y].num)
        ) {
          // le posso scambiare
          var temp = cells[i][j].num
          cells[i][j].num = cells[x][y].num
          cells[x][y].num = temp
          // la cella è sistemata su una riga
          cells[i][j].row_sorted = true
          // aggiungo il nuovo valore all'array
          row_values.push(cells[i][j].num)
          // ho risolto il problema
          sorted = true
        }
      }
    }
  }
  else {
    for (var x = i - (i % 3); x <= i - (i % 3) + 2; x++) {
      for (var y = j - (j % 3); y <= j - (j % 3) + 2; y++) {
        if (
          !sorted && x > i &&
          !cells[x][y].row_sorted && !cells[x][y].col_sorted &&
          !col_values.includes(cells[x][y].num)
        ) {
          var temp = cells[i][j].num
          cells[i][j].num = cells[x][y].num
          cells[x][y].num = temp
          cells[i][j].col_sorted = true
          col_values.push(cells[i][j].num)
          sorted = true
        }
      }
    }
  }
  // se questo metodo non funziona
  if (!sorted) {
    // se sto lavorando con la cella "A"
    if (!duplicate) {
      // cerco e sistemo il duplicato di "A"
      fix_duplicate(dir, i, j)
      // ho risolto il problema
      if (dir == "row") {
        cells[i][j].row_check = true
      } else {
        cells[i][j].col_check = true
      }
    }
    // se invece sto già lavorando con il duplicato
    else {
      // passo al secondo algoritmo: preferred adjacent swap
      pas_method(dir, i, j)
    }
  }
}

function adj_swap(dir, i, j, duplicate = false) {
  // se sto lavorando su una riga
  if (dir == "row") {
    // per ogni cella del quadrante sulla stessa colonna di "A"
    for (var y = j; y <= j - (j % 3) + 2; y++) {
      if (
        !sorted && y != j &&
        !cells[i][y].row_sorted &&
        !row_values.includes(cells[i][y].num)
      ) {
        // le posso scambiare
        var temp = cells[i][j].num
        cells[i][j].num = cells[i][y].num
        cells[i][y].num = temp
        // la cella è sistemata su una riga
        cells[i][j].row_sorted = true
        // aggiungo il nuovo valore all'array
        row_values.push(cells[i][j].num)
        // ho risolto il problema
        sorted = true
      }
    }
  }
  // se invece sto lavorando su una colonna
  else {
    // per ogni cella del quadrante sulla stessa riga di "A"
    for (var x = i; x <= i - (i % 3) + 2; x++) {
      if (
        !sorted && x != i &&
        !cells[x][j].col_sorted &&
        !col_values.includes(cells[x][j].num)
      ) {
        // le posso scambiare
        var temp = cells[i][j].num
        cells[i][j].num = cells[x][j].num
        cells[x][j].num = temp
        // la cella è sistemata su una riga
        cells[i][j].col_sorted = true
        // aggiungo il nuovo valore all'array
        col_values.push(cells[i][j].num)
        // ho risolto il problema
        sorted = true
      }
    }
  }
  // se questo metodo non funziona
  if (!sorted) {
    // se sto lavorando con la cella originale
    if (!duplicate) {
      // cerco il clone
      fix_duplicate(dir, i, j)
      // ho risolto il problema
      if (dir == "row") {
        cells[i][j].row_check = true
      } else {
        cells[i][j].col_check = true
      }
    }
    // se invece sto già lavorando con il duplicato
    else {
      // passo al secondo algoritmo
      pas_method(dir, i, j)
    }
  }
}

function fix_duplicate(dir, i, j) {
  // se sto cercando il duplicato su una riga
  if (dir == "row") {
    // per ogni cella nella stessa riga
    for (var x = 0; x < i; x++) {
      // se il numero è uguale
      if (cells[x][j].num == cells[i][j].num) {
        // ho trovato il duplicato: se non è ancora stato sistemato su una colonna
        if (!cells[x][j].col_sorted) {
          // lo scambio con le celle dello stesso quadrante
          box_swap(dir, x, j, true)
        }
        // se invece è già stato sistemato in su una colonna
        else {
          // lo scambio solo con le celle al di sotto
          adj_swap(dir, x, j, true)
        }
        // problema risolto
        cells[i][j].row_sorted = true
      }
    }
  }
  // se invece sto cercando il duplicato su una colonna
  else {
    // per ogni cella nella stessa colonna
    for (var y = 0; y < j; y++) {
      // se il numero è uguale ma la cella è diversa
      if (cells[i][y].num == cells[i][j].num) {
        // ho trovato il duplicato: se non è ancora stato sistemato su una riga
        if (!cells[i][y].row_sorted) {
          // lo scambio con le celle dello stesso quadrante
          box_swap(dir, i, y, true)
        }
        // se invece è già stato sistemato in su una riga
        else {
          // lo scambio solo con le celle a destra
          adj_swap(dir, i, y, true)
        }
        // problema risolto
        cells[i][j].col_sorted = true
      }
    }
  }
}

function pas_method(dir, i, j) {
  // inizializzo il counter a 18
  var counter = 18
  // se sto lavorando su una riga
  if (dir == "row") {
    // creo il nuovo array per i valori della riga
    var new_row_values = []
    // finchè non si risolve il problema (dopo 18 tentativi esco dal ciclo)
    while (!sorted && counter > 0) {
      // scambio il duplicato appena trovato con la cella appena al di sotto
      var temp = cells[i][j].num
      cells[i][j].num = cells[i][j + 1].num
      cells[i][j + 1].num = temp
      // controllo se la riga è corretta: assumo che lo sia
      var correct = true
      // svuoto l'array con i nuovi valori
      new_row_values = []
      // scorro le celle della n-esima riga
      for (var x = 0; x <= row_values.length; x++) {
        // se il valore della cella non è presente all'interno della riga
        if (!new_row_values.includes(cells[x][j].num)) {
          // lo aggiungo all'array
          new_row_values.push(cells[x][j].num)
        }
        // altrimenti è sbagliato
        else {
          // la riga è errata
          correct = false
        }
      }
      // se la riga supera il controllo
      if (correct) {
        // il problema è stato risolto: esco dal ciclo
        sorted = true
      }
      // se invece la riga è ancora sbagliata
      else {
        var new_i
        // trovo il duplicato: per ogni cella nella riga
        for (var x = 0; x <= row_values.length; x++) {
          // se il numero è uguale ma l'indice è diverso
          if (cells[x][j].num == cells[i][j].num && i != x) {
            // ho trovato il duplicato: riassegno gli indici
            new_i = x
          }
        }
        i = new_i
      }
      // decremento il contatore
      counter--
    }
    // se ho risolto il problema
    if (sorted) {
      // e aggiorno i valori nell'array
      row_values = new_row_values
      // ripristino l'indice
      i = row_values.length - 1
      // ora è sistemata in una riga
      cells[i][j].row_sorted = true
    }
  }
  // se invece sto lavorando su una colonna
  else {
    // creo il nuovo array per i valori della colonna
    var new_col_values = []
    // finchè non si risolve il problema (dopo 18 tentativi esco dal ciclo)
    while (!sorted && counter > 0) {
      // scambio il duplicato appena trovato con la cella sulla destra
      var temp = cells[i][j].num
      cells[i][j].num = cells[i + 1][j].num
      cells[i + 1][j].num = temp
      // controllo se la riga è corretta: assumo che lo sia
      var correct = true
      // creo un'array con i valori della riga
      new_col_values = []
      // scorro le celle della n-esima riga fino a dove sono arrivato con il controllo
      for (var y = 0; y <= col_values.length; y++) {
        // se il valore della cella non è presente all'interno della riga
        if (!new_col_values.includes(cells[i][y].num)) {
          // lo aggiungo all'array
          new_col_values.push(cells[i][y].num)
        }
        // altrimenti è sbagliato
        else {
          // la riga è errata
          correct = false
        }
      }
      // se la riga supera il controllo
      if (correct) {
        // il problema è stato risolto
        sorted = true
      }
      // se la colonna è ancora sbagliata
      else {
        var new_j
        // trovo il duplicato: per ogni cella nella colonna
        for (var y = 0; y <= col_values.length; y++) {
          // se il numero è uguale ma l'indice è diverso
          if (cells[i][j].num == cells[i][y].num && j != y) {
            // ho trovato il duplicato: riassegno gli indici
            new_j = y
          }
        }
        j = new_j
      }
      // decremento il contatore
      counter--
    }
    // se ho risolto il problema
    if (sorted) {
      // e aggiorno i valori nell'array
      col_values = new_col_values
      // ripristino l'indice
      j = col_values.length - 1
      // ora è sistemata in una colonna
      cells[i][j].col_sorted = true
    }
  }
  if (!sorted) {
    if (dir == "row") {
      abs_method(dir, j)
    } else {
      abs_method(dir, i)
    }
  }
}

function abs_method(dir, n) {
  // se mi sono bloccato su una riga
  if (dir == "row") {
    // correggo la riga successiva
    fix_row(n + 1)
    // e poi ritorno su quella precedente
    fix_row(n)
  }
  // se invece mi sono bloccato su una colonna
  else {
    // correggo la colonna successiva
    fix_col(n + 1)
    // e poi ritorno su quella precedente
    fix_col(n)
  }
}
