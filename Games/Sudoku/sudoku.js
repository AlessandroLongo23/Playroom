// creo un'array con i valori da 1 a 9
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function setup() {
    // creo la tela con dimensioni: 9n+2
    createCanvas(452, 452)
        // assegno i colori
    light_color = medium_colors[0]
    norm_color = medium_colors[1]
    dark_color = medium_colors[2]
    numbers_color = medium_colors[3]
        // sistemo la canvas nel DOM
    canvas = document.getElementById('defaultCanvas0')
    container = document.getElementById('game_window')
    container.appendChild(canvas)
        // genero la griglia
    generate_grid()
        // e poi il sudoku (a livello medio)
    generate_sudoku(2)
}

function draw() {
    // se l'aiuto nella pagina html è selezionato
    if (document.getElementById("error").checked) {
        // faccio i controlli alla griglia
        grid_checks()
    }
    // altrimenti
    else {
        clear_errors()
    }
    // se l'aiuto nella pagina html è selezionato
    if (document.getElementById("highlight").checked) {
        // evidenzio le celle
        highlight_numbers()
    }
    // poi disegno la griglia
    show_grid()
        // faccio scorrere il cronometro
    if (getFrameRate() != 0) {
        time += 1 / getFrameRate()
    }
}

class Cell {
    constructor(i, j) {
        this.i = i
        this.j = j
        this.num = 0
        this.p_num = []
        this.correct = false
        this.row_sorted = false
        this.col_sorted = false
        this.fixed = true
        this.highlighted = false
    }

    show() {
        // disegno la cella
        strokeWeight(1)
        stroke(0)
            // se la cella è corretta
        if (this.correct) {
            // evidenzio i numeri uguali a quello selezionato
            if (this.highlighted) {
                fill(norm_color)
            } else {
                fill(light_color)
            }
            // il colore della casella è lo stesso dello sfondo
        } else {
            // altrimenti è rosso
            fill(255, 150, 150)
        }
        rect(this.i * len, this.j * len, len, len)
            // scrivo il numero dentro la cella
        textAlign(CENTER, CENTER)
        textSize(len / 2)
        fill(0)
            // se il numero non è 0
        if (this.num != 0) {
            // se il numero è fisso
            if (this.fixed) {
                // il numero è della tonalità scura della schermata
                fill(numbers_color)
                stroke(numbers_color)
            }
            // altrimenti
            else {
                // il numero è nero
                fill(0)
                stroke(0)
            }
            // scrivo il numero solo se è diverso da 0
            text(this.num, this.i * len + len / 2, this.j * len + len / 2 + 4)
        }
        // se invece la casella è vuota (this.num == 0)
        else {
            // per tutti i numeri "probabili"
            for (var i = 0; i < this.p_num.length; i++) {
                fill(50)
                stroke(0)
                strokeWeight(1.5)
                textSize(len / 4)
                    // a seconda del cifra è posizionato in un punto diverso della cella
                push()
                translate(this.i * len + len / 2, this.j * len + len / 2 + 2)
                switch (this.p_num[i]) {
                    case 1:
                        text(1, -len / 3, len / 3)
                        break;
                    case 2:
                        text(2, 0, len / 3)
                        break;
                    case 3:
                        text(3, len / 3, len / 3)
                        break;
                    case 4:
                        text(4, -len / 3, 0)
                        break;
                    case 5:
                        text(5, 0, 0)
                        break;
                    case 6:
                        text(6, len / 3, 0)
                        break;
                    case 7:
                        text(7, -len / 3, -len / 3)
                        break;
                    case 8:
                        text(8, 0, -len / 3)
                        break;
                    case 9:
                        text(9, len / 3, -len / 3)
                        break;
                }
                pop()
            }
        }
    }
}

function grid_checks() {
    // assumo che tutte le celle siano corrette
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            cells[i][j].correct = true
        }
    }
    // controllo tutte le righe
    row_check()
        // controllo tutte le colonne
    col_check()
        // controllo tutti i quadranti
    square_check()
}

function row_check() {
    // per ogni riga
    for (var j = 0; j < 9; j++) {
        // assumo che sia corretta
        var correct = true
            // creo un'array in cui raccolgo i valori della riga
        var values = []
            // per ogni cella
        for (var i = 0; i < 9; i++) {
            // se il numero (diverso da 0) è già nell'array dei valori
            if (values.includes(cells[i][j].num) && cells[i][j].num != 0) {
                // la riga non è corretta
                correct = false
            }
            // aggiungo il numero all'array
            values.push(cells[i][j].num)
        }
        // se la riga non ha superato il controllo
        if (!correct) {
            // per tutte le celle della riga
            for (var i = 0; i < 9; i++) {
                // le segno come errate
                cells[i][j].correct = false
            }
        }
    }
}

function col_check() {
    // per ogni colonna
    for (var i = 0; i < 9; i++) {
        // assumo che sia corretta
        var correct = true
            // creo un'array in cui raccolgo i valori della colonna
        var values = []
            // per ogni cella
        for (var j = 0; j < 9; j++) {
            // se il numero (diverso da 0) è già nell'array dei valori
            if (values.includes(cells[i][j].num) && cells[i][j].num != 0) {
                // la riga non è corretta
                correct = false
            }
            // aggiungo il numero all'array
            values.push(cells[i][j].num)
        }
        // se la riga non ha superato il controllo
        if (!correct) {
            // per tutte le celle della riga
            for (var j = 0; j < 9; j++) {
                // le segno come errate
                cells[i][j].correct = false
            }
        }
    }
}

function square_check() {
    // per ogni quadrante
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            // assumo che sia corretto
            var correct = true
                // creo un'array in cui salvare i valori del quadrante
            var values = []
                // scorro le celle
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    // se il valore (diverso da 0) è già presente all'interno del quadrante
                    if (values.includes(cells[i * 3 + x][j * 3 + y].num) && cells[i * 3 + x][j * 3 + y].num != 0) {
                        // il quadrante è errato
                        correct = false
                    }
                    // aggiungo il numero all'array dei valori
                    values.push(cells[i * 3 + x][j * 3 + y].num)
                }
            }
            // se il quadrante non ha superato il controllo
            if (!correct) {
                // per tutte le celle del quadrante
                for (var x = 0; x < 3; x++) {
                    for (var y = 0; y < 3; y++) {
                        // le segno errate
                        cells[i * 3 + x][j * 3 + y].correct = false
                    }
                }
            }
        }
    }
}

function clear_errors() {
    // per ogni cella
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            // la setto come corretta
            cells[i][j].correct = true
        }
    }
}

function keyPressed() {
    // se premo un numero
    for (var num = 0; num <= 9; num++) {
        // se inserisco i numeri "certi" (sulla tastiera)
        if (keyCode == 48 + num) {
            // per in ogni cella
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    // se il mouse è all'interno di essa e non c'è un numero fisso
                    if (
                        mouseX > i * len && mouseX < i * len + len &&
                        mouseY > j * len && mouseY < j * len + len &&
                        !cells[i][j].fixed
                    ) {
                        // inserisco nella cella il numero digitato da tastiera
                        cells[i][j].num = num
                    }
                }
            }
        } if (keyCode == 96 + num) {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (
                        mouseX > i * len && mouseX < i * len + len &&
                        mouseY > j * len && mouseY < j * len + len &&
                        !cells[i][j].fixed
                    ) {
                        if (!cells[i][j].p_num.includes(num))
                            cells[i][j].p_num.push(num)
                        else
                            cells[i][j].p_num.splice(cells[i][j].p_num.indexOf(num), 1)
                    }
                }
            }
        }
    }

    if (keyCode == 82)
        generate_sudoku()
}

function show_grid() {
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            cells[i][j].show()

    strokeWeight(3)
    stroke(0)
    for (var x = 0; x <= width; x += width / 3)
        line(x, 0, x, height)
    for (var y = 0; y <= height; y += height / 3)
        line(0, y, width, y)
}

function highlight_numbers() {
    var num;

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (
                mouseX > i * len && mouseX < i * len + len &&
                mouseY > j * len && mouseY < j * len + len
            ) {
                num = cells[i][j].num
            }
        }
    }

    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            cells[i][j].highlighted = (cells[i][j].num == num && cells[i][j].num != 0);
}