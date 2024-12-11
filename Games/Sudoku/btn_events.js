// creo le variabili che conterranno i colori per l'interfaccia
var easy_colors, medium_colors, hard_colors, master_colors
// creo le variabili per i bottoni
var easy_btn = document.getElementById("easy")
var medium_btn = document.getElementById("medium")
var hard_btn = document.getElementById("hard")
var master_btn = document.getElementById("master")
var reset_btn = document.getElementById("reset")

function preload() {
  easy_colors = [color(208, 243, 255), color(80, 208, 255), color(0, 134, 183), color(0, 78, 107)]
  medium_colors = [color(208, 255, 220), color(80, 255, 127), color(0, 183, 49), color(0, 107, 29)]
  hard_colors = [color(255, 220, 208), color(255, 127, 80), color(183, 49, 0), color(107, 29, 0)]
  master_colors = [color(255, 208, 243), color(255, 80, 208), color(183, 0, 134), color(107, 0, 78)]
}

easy_btn.onclick = function() {
  // svuoto la griglia
  clear_grid()
  // genero un nuovo sudoku a difficoltà: "easy"
  generate_sudoku(1)
  // ricarico i colori della pagina: sfondo
  document.querySelector("body").style.backgroundColor = easy_colors[0]
  // e intestazione
  document.querySelector("header").style.backgroundColor = easy_colors[1]
  // ombra delle scritte
  document.getElementById("main_header").style.textShadow = "5px 5px 0px rgb(0, 134, 183)"
  document.getElementById("author").style.textShadow = "2px 2px 0px rgb(0, 134, 183)"
  // cambio il colore di sfondo della griglia e dei numeri
  light_color = easy_colors[0]
  norm_color = easy_colors[1]
  dark_color = easy_colors[2]
  numbers_color = easy_colors[3]
  // colore dei titoli minori
  for (var i = 0; i < document.getElementsByTagName("h2").length; i++) {
    document.getElementsByTagName("h2")[i].style.color = easy_colors[1]
  }
  // colore delle scritte degli aiuti
  for (var i = 0; i < document.getElementsByClassName("help_name").length; i++) {
    document.getElementsByClassName("help_name")[i].style.color = easy_colors[2]
  }
}

medium_btn.onclick = function() {
  // svuoto la griglia
  clear_grid()
  // genero un nuovo sudoku a difficoltà: "medium"
  generate_sudoku(2)
  // ricarico i colori della pagina: sfondo
  document.querySelector("body").style.backgroundColor = medium_colors[0]
  // e intestazione
  document.querySelector("header").style.backgroundColor = medium_colors[1]
  // ombra delle scritte
  document.getElementById("main_header").style.textShadow = "5px 5px 0px rgb(0, 183, 49)"
  document.getElementById("author").style.textShadow = "2px 2px 0px rgb(0, 183, 49)"
  // cambio il colore di sfondo della griglia e dei numeri
  light_color = medium_colors[0]
  norm_color = medium_colors[1]
  dark_color = medium_colors[2]
  numbers_color = medium_colors[3]
  // colore dei titoli minori
  for (var i = 0; i < document.getElementsByTagName("h2").length; i++) {
    document.getElementsByTagName("h2")[i].style.color = medium_colors[1]
  }
  // colore delle scritte degli aiuti
  for (var i = 0; i < document.getElementsByClassName("help_name").length; i++) {
    document.getElementsByClassName("help_name")[i].style.color = medium_colors[2]
  }
}

hard_btn.onclick = function() {
  // svuoto la griglia
  clear_grid()
  // genero un nuovo sudoku a difficoltà: "hard"
  generate_sudoku(3)
  // ricarico i colori della pagina: sfondo
  document.querySelector("body").style.backgroundColor = hard_colors[0]
  // e intestazione
  document.querySelector("header").style.backgroundColor = hard_colors[1]
  // ombra delle scritte
  document.getElementById("main_header").style.textShadow = "5px 5px 0px rgb(183, 49, 0)"
  document.getElementById("author").style.textShadow = "2px 2px 0px rgb(183, 49, 0)"
  // cambio il colore di sfondo della griglia e dei colori
  light_color = hard_colors[0]
  norm_color = hard_colors[1]
  dark_color = hard_colors[2]
  numbers_color = hard_colors[3]
  // colore dei titoli minori
  for (var i = 0; i < document.getElementsByTagName("h2").length; i++) {
    document.getElementsByTagName("h2")[i].style.color = hard_colors[1]
  }
  // colore delle scritte degli aiuti
  for (var i = 0; i < document.getElementsByClassName("help_name").length; i++) {
    document.getElementsByClassName("help_name")[i].style.color = hard_colors[2]
  }
}

master_btn.onclick = function() {
  // svuoto la griglia
  clear_grid()
  // genero un nuovo sudoku a difficoltà: "master"
  generate_sudoku(4)
  // ricarico i colori della pagina: sfondo
  document.querySelector("body").style.backgroundColor = master_colors[0]
  // intestazione
  document.querySelector("header").style.backgroundColor = master_colors[1]
  // ombra delle scritte
  document.getElementById("main_header").style.textShadow = "5px 5px 0px rgb(183, 0, 134)"
  document.getElementById("author").style.textShadow = "2px 2px 0px rgb(183, 0, 134)"
  // cambio il colore di sfondo della griglia e dei colori
  light_color = master_colors[0]
  norm_color = master_colors[1]
  dark_color = master_colors[2]
  numbers_color = master_colors[3]
  // colore dei titoli minori
  for (var i = 0; i < document.getElementsByTagName("h2").length; i++) {
    document.getElementsByTagName("h2")[i].style.color = master_colors[1]
  }
  // colore delle scritte degli aiuti
  for (var i = 0; i < document.getElementsByClassName("help_name").length; i++) {
    document.getElementsByClassName("help_name")[i].style.color = master_colors[2]
  }
}

reset_btn.onclick = function() {
  // cancello tutti i numeri non fissi
  clean_numbers()
}
