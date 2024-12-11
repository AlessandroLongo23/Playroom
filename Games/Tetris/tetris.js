function setup() {
   unit = 35
   createCanvas(21 * unit, 20 * unit)
   stroke(0)
   shapes = ["o", "i", "s", "z", "t", "l", "j"]
   frames = 0
   points = 0
   dxside = 14 * unit
   cols = 14
   rows = 20

   pieces = []
   pieces.push(new Piece(random(shapes), createVector(round(cols / 2) * unit, 0)))
   next_shape = random(shapes)
}

function draw() {
   background(51)
   grid(cols + 1, rows, unit, unit)

   for (var i = 0; i < pieces.length; i++) {
      pieces[i].update()
      pieces[i].show()
      pieces[i].create()
   }

   info()
   frames++
}

function info() {
   push()
   fill(220)
   stroke(0)
   rect(dxside, 0, width - dxside - 1, height - 1)
   pop()

   push()
   textSize(28)
   textAlign(CENTER, CENTER)
   fill(0)
   noStroke()
   text("Successivo:", dxside + (width - dxside) / 2, 2 * unit)
   pop()

   push()
   translate(dxside + unit, 3 * unit)
   fill(51)
   stroke(0)
   rect(0, 0, unit * 5, unit * 6)
   switch (next_shape) {
      case "o":
         fill(255, 255, 0)
         rect(1.5 * unit, 2 * unit, unit, unit)
         rect(1.5 * unit, 3 * unit, unit, unit)
         rect(2.5 * unit, 2 * unit, unit, unit)
         rect(2.5 * unit, 3 * unit, unit, unit)
         break;
      case "i":
         fill(255, 100, 0)
         rect(2 * unit, unit, unit, unit)
         rect(2 * unit, 2 * unit, unit, unit)
         rect(2 * unit, 3 * unit, unit, unit)
         rect(2 * unit, 4 * unit, unit, unit)
         break;
      case "t":
         fill(150, 150, 255)
         rect(unit, 2 * unit, unit, unit)
         rect(2 * unit, 2 * unit, unit, unit)
         rect(3 * unit, 2 * unit, unit, unit)
         rect(2 * unit, 3 * unit, unit, unit)
         break;
      case "l":
         fill(255, 0, 0)
         rect(1.5 * unit, 2 * unit, unit, unit)
         rect(1.5 * unit, 3 * unit, unit, unit)
         rect(1.5 * unit, 4 * unit, unit, unit)
         rect(2.5 * unit, 4 * unit, unit, unit)
         break;
      case "j":
         fill(255, 0, 255)
         rect(2.5 * unit, 2 * unit, unit, unit)
         rect(2.5 * unit, 3 * unit, unit, unit)
         rect(2.5 * unit, 4 * unit, unit, unit)
         rect(1.5 * unit, 4 * unit, unit, unit)
         break;
      case "s":
         fill(0, 255, 0)
         rect(2 * unit, 2 * unit, unit, unit)
         rect(3 * unit, 2 * unit, unit, unit)
         rect(unit, 3 * unit, unit, unit)
         rect(2 * unit, 3 * unit, unit, unit)
         break;
      case "z":
         fill(0, 0, 255)
         rect(unit, 2 * unit, unit, unit)
         rect(2 * unit, 2 * unit, unit, unit)
         rect(2 * unit, 3 * unit, unit, unit)
         rect(3 * unit, 3 * unit, unit, unit)
         break;
   }
   pop()

   push()
   translate(dxside, 0)
   fill(0)
   noStroke()
   textSize(30)
   textAlign(CENTER)

   text("Punteggio:", (width - dxside) / 2, 12 * unit)
   fill(51)
   stroke(0)
   rect(unit, 13 * unit, 5 * unit, 2 * unit)
   fill(220)
   noStroke()

   text(points, (width - dxside) / 2, 14 * unit + unit / 2)

   fill(0)
   textSize(20)
   text("1° Ale: 1018", (width - dxside) / 2, 20.75 * unit)
   text("2° Ale: 756", (width - dxside) / 2, 17 * unit)
   text("3° Ale: 508", (width - dxside) / 2, 18.25 * unit)
   text("4° Ale: 316", (width - dxside) / 2, 19.5 * unit)
   text("5° ...", (width - dxside) / 2, 22 * unit)

   pop()
}

function cancel_line() {
   for (var i = 0; i < rows; i++) {
      var cancel = true
      for (var j = 0; j < cols; j++) {
         var occupied = false

         for (var p = 0; p < pieces.length; p++) {
            for (var c = 0; c < pieces[p].cubes.length; c++) {
               if (
                  pieces[p].pos.x + pieces[p].cubes[c].x * unit == j * unit &&
                  pieces[p].pos.y + pieces[p].cubes[c].y * unit == i * unit
               ) {
                  occupied = true
               }
            }
         }

         if (!occupied)
            cancel = false
      }

      if (cancel) {
         for (var j = 0; j < cols; j++) {
            for (var p = 0; p < pieces.length; p++) {
               for (var c = 0; c < pieces[p].cubes.length; c++) {
                  if (
                     pieces[p].pos.x + pieces[p].cubes[c].x * unit == j * unit &&
                     pieces[p].pos.y + pieces[p].cubes[c].y * unit == i * unit
                  ) {
                     pieces[p].cubes.splice(c, 1)
                  }
               }
            }
         }

         points += cols

         for (var p = 0; p < pieces.length; p++)
            for (var c = 0; c < pieces[p].cubes.length; c++)
               if (pieces[p].pos.y + pieces[p].cubes[c].y * unit < i * unit)
                  pieces[p].cubes[c].y++
      }
   }
}

function keyTyped() {
   if (key == "d") {
      var allowed = true
      for (var i = 0; i < pieces[pieces.length - 1].cubes.length; i++)
         if (pieces[pieces.length - 1].pos.x + pieces[pieces.length - 1].cubes[i].x * unit >= dxside - unit)
            allowed = false

      if (allowed) 
         pieces[pieces.length - 1].pos.x += unit
   }

   else if (key == "a") {
      var allowed = true
      for (var i = 0; i < pieces[pieces.length - 1].cubes.length; i++)
         if (pieces[pieces.length - 1].pos.x + pieces[pieces.length - 1].cubes[i].x * unit < unit)
            allowed = false

      if (allowed)
         pieces[pieces.length - 1].pos.x -= unit
   }

   if (key == "e" && pieces[pieces.length - 1].shape != "o") {
      for (var i = 0; i < pieces[pieces.length - 1].cubes.length; i++) {
         var app = -pieces[pieces.length - 1].cubes[i].x
         pieces[pieces.length - 1].cubes[i].x = pieces[pieces.length - 1].cubes[i].y
         pieces[pieces.length - 1].cubes[i].y = app
      }
   }

   else if (key == "q" && pieces[pieces.length - 1].shape != "o") {
      for (var i = 0; i < pieces[pieces.length - 1].cubes.length; i++) {
         var app = pieces[pieces.length - 1].cubes[i].x
         pieces[pieces.length - 1].cubes[i].x = -pieces[pieces.length - 1].cubes[i].y
         pieces[pieces.length - 1].cubes[i].y = app
      }
   }
}

class Piece {
   constructor(shape, pos) {
      this.shape = shape
      this.pos = pos
      this.new = true
      this.allowed = true

      switch (this.shape) {
         case "o":
            this.cubes = [
               createVector(0, 0),
               createVector(1, 0),
               createVector(0, 1),
               createVector(1, 1)
            ]
            break;
         case "i":
            this.cubes = [
               createVector(0, 0),
               createVector(0, -1),
               createVector(0, 1),
               createVector(0, 2)
            ]
            break;
         case "t":
            this.cubes = [
               createVector(0, 0),
               createVector(-1, 0),
               createVector(1, 0),
               createVector(0, 1)
            ]
            break;
         case "l":
            this.cubes = [
               createVector(0, 0),
               createVector(0, -1),
               createVector(0, 1),
               createVector(1, 1)
            ]
            break;
         case "j":
            this.cubes = [
               createVector(0, 0),
               createVector(0, -1),
               createVector(0, 1),
               createVector(-1, 1)
            ]
            break;
         case "s":
            this.cubes = [
               createVector(0, 0),
               createVector(-1, 0),
               createVector(0, -1),
               createVector(1, -1)
            ]
            break;
         case "z":
            this.cubes = [
               createVector(0, 0),
               createVector(1, 0),
               createVector(0, -1),
               createVector(-1, -1)
            ]
            break;
      }
   }

   show() {
      switch (this.shape) {
         case "o":
            fill(255, 255, 0)
            break
         case "i":
            fill(255, 100, 0)
            break
         case "t":
            fill(150, 150, 255)
            break
         case "l":
            fill(255, 0, 0)
            break
         case "j":
            fill(255, 0, 255)
            break
         case "s":
            fill(0, 255, 0)
            break
         case "z":
            fill(0, 0, 255)
            break
      }

      for (var i = 0; i < this.cubes.length; i++)
         rect(this.pos.x + this.cubes[i].x * unit, this.pos.y + this.cubes[i].y * unit, unit, unit)
   }

   update() {
      if (keyIsDown(83) && frames % 3 == 0 && this.allowed)
         this.pos.y += unit

      for (var i = 0; i < this.cubes.length; i++)
         if (this.pos.y + this.cubes[i].y * unit >= height - unit)
            this.allowed = false

      for (var i = 0; i < pieces.length - 1; i++) {
         for (var j = 0; j < this.cubes.length; j++) {
            for (var k = 0; k < pieces[i].cubes.length; k++) {
               if (
                  this.pos.x + this.cubes[j].x * unit == pieces[i].pos.x + pieces[i].cubes[k].x * unit &&
                  this.pos.y + this.cubes[j].y * unit == pieces[i].pos.y + pieces[i].cubes[k].y * unit - unit
               ) {
                  this.allowed = false
               }
            }
         }
      }

      if (this.allowed && frames % 30 == 0)
         this.pos.y += unit
   }

   create() {
      if (!this.allowed && this.new) {
         cancel_line()
         pieces.push(new Piece(next_shape, createVector(round(cols / 2) * unit, 0)))
         this.new = false

         points += 4
         next_shape = random(shapes)
      }
   }
}
