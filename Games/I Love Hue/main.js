function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   rectMode(CENTER)
   noStroke()

   tiles = []

   tl = createVector(random(255), random(255), random(255))
   tr = createVector(random(255), random(255), random(255))
   bl = createVector(random(255), random(255), random(255))
   br = createVector(random(255), random(255), random(255))

   num_x = 8
   num_y = 4
   w = ceil(width / num_x)
   h = ceil(height / num_y)

   var n = 0
   for (var i = 0; i < width; i += w) {
      for (var j = 0; j < height; j += h) {
         tiles.push(new Tile(n, createVector(i + w / 2, j + h / 2), {
            r: map(i, 0, width, map(j, 0, height, tl.x, bl.x), map(j, 0, height, tr.x, br.x)),
            g: map(i, 0, width, map(j, 0, height, tl.y, bl.y), map(j, 0, height, tr.y, br.y)),
            b: map(i, 0, width, map(j, 0, height, tl.z, bl.z), map(j, 0, height, tr.z, br.z))
         }, w, h))
         n++
      }
   }

   selection = null
}

function draw() {
   background(0)

   for (var i = 0; i < tiles.length; i++) {
      tiles[i].show()
   }
}

function shuffle_tiles() {
   var store = []
   store.push(tiles.splice(tiles.length - 1, 1)[0])
   store.push(tiles.splice(tiles.length - num_y + 1, 1)[0])
   store.push(tiles.splice(num_y - 1, 1)[0])
   store.push(tiles.splice(0, 1)[0])

   for (var i = 0; i < store.length; i++) {
      store[i].fixed = true
   }

   tiles = shuffle(tiles, true)
   var temp = tiles[0].pos
   for (var i = 0; i < tiles.length - 1; i++) {
      tiles[i].pos = tiles[i + 1].pos
   }
   tiles[tiles.length - 1].pos = temp

   for (var i = 0; i < store.length; i++) {
      tiles.push(store[i])
   }
}

function keyTyped() {
   if (key == "s") {
      shuffle_tiles()
   }
}

function mousePressed() {
   for (var i = 0; i < tiles.length; i++) {
      if (
         mouseX > tiles[i].pos.x - w / 2 &&
         mouseX < tiles[i].pos.x + w / 2 &&
         mouseY > tiles[i].pos.y - h / 2 &&
         mouseY < tiles[i].pos.y + h / 2 &&
         !tiles[i].fixed
      ) {
         if (selection == tiles[i].index) {
            selection = null
         } else if (!selection) {
            selection = tiles[i]
         } else {
            var temp = tiles[i].pos
            tiles[i].pos = selection.pos
            selection.pos = temp

            selection = null
            break
         }
      }
   }
}

class Tile {
   constructor(index, pos, col, w, h, fixed = false) {
      this.right_pos = pos
      this.pos = pos
      this.col = col

      this.fixed = fixed
      this.index = index
   }

   show() {
      fill(this.col.r, this.col.g, this.col.b)
      if (selection == this) {
         rect(this.pos.x, this.pos.y, w * 3 / 4, h * 3 / 4)
      } else {
         rect(this.pos.x, this.pos.y, w, h)
      }

      if (this.fixed) {
         fill(0)
         ellipse(this.pos.x, this.pos.y, 15)
      }
   }
}
