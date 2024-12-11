function setup() {
   createCanvas(windowWidth, windowHeight - 1)
   stroke(0)

   num = 10
   length = width / 4
   moves = 0
   bin = [num]
   prev = [num]
   for (var i = 0; i < num; i++)
      bin[i] = 0

   disks = []
   for (var i = 1; i < num + 1; i++) {
      var d = new Disk(length, height - (num - i) * 20 - 50, i * 30, 20, i, 0)
      disks.push(d)
   }
}

function draw() {
   background(200)

   push()
   textSize(50)
   textAlign(CENTER)
   fill(0)
   stroke(255)
   push()
   if (moves > pow(2, num) - 1)
      fill(255, 0, 0)

   text(moves, 75, 75)
   pop()
   text(pow(2, num) - 1, width - 75, 75)
   pop()

   sticks()

   for (var i = 0; i < num; i++)
      disks[i].show()

   win()

   for (var i = 0; i < num; i++)
      prev[i] = bin[i]

   bin[num - 1]++
   for (var i = num - 1; i >= 0; i--) {
      if (bin[i] == 2) {
         bin[i] = 0
         bin[i - 1]++
      }
   }

   for (var i = 0; i < num; i++)
      if (bin[i] == 1 && prev[i] == 0)
         autoMove(num - i - 1)
}

function win() {
   var contrWin = 1
   for (var i = 0; i < num; i++)
      if (disks[i].pos != 2)
         contrWin = 0

   if (contrWin == 1) {
      push()
      rectMode(CENTER)
      stroke(0)
      strokeWeight(3)
      fill(255)
      rect(width / 2, height / 2 - 15, width / 2, 200, 10)

      textSize(75)
      textAlign(CENTER)
      fill(0)
      text("Vittoria!", width / 2, height / 2)
      pop()

      noLoop()
   }
}

function sticks() {
   for (var i = 1; i < 4; i++) {
      rectMode(CENTER)
      fill(100)
      rect(i * length, height, 20, height)
   }
}

class Disk {
   constructor(x, y, w, h, val, pos) {
      this.y = y - h - 1
      this.w = w
      this.h = h

      this.n = val
      this.pos = pos
   }

   show() {
      fill(map(this.n, 1, num, 0, 255))
      rectMode(CORNER)
      rect((this.pos + 1) * length - this.w / 2, this.y, this.w, this.h)
   }
}

function autoMove(index) {
   if (num % 2 == 0) {
      var contr1 = 1
      for (var i = 0; i < num; i++)
         if (index != i && disks[index].pos == disks[i].pos && disks[index].y > disks[i].y)
            contr1 = 0

      var contr2 = 0
      var esc = 0
      var steps = 1
      while (contr2 == 0 && esc == 0) {
         var contr3 = 1
         for (var i = 0; i < num; i++)
            if ((disks[index].pos + steps) % 3 == disks[i].pos && disks[index].n > disks[i].n)
               contr3 = 0

         if (contr3 == 1)
            contr2 = 1

         if (contr2 == 1)
            steps--

         steps++
         if (steps > num)
            esc = 1
      }
      
      if (contr1 == 1 && contr2 == 1) {
         var h = 1
         for (var i = 0; i < disks.length; i++)
            if (index != i && disks[i].pos == (disks[index].pos + steps) % 3)
               h++

         disks[index].pos = (disks[index].pos + steps) % 3
         disks[index].y = height - 20 * h - 1 - 50
         moves++
      }
   } else {
      var contr1 = 1
      for (var i = 0; i < num; i++)
         if (index != i && disks[index].pos == disks[i].pos && disks[index].y > disks[i].y)
            contr1 = 0

      var contr2 = 0
      var esc = 0
      var steps = 1
      while (contr2 == 0 && esc == 0) {
         var contr3 = 1
         for (var i = 0; i < num; i++) {
            if (index != i) {
               var pos = disks[index].pos
               if (disks[index].pos - steps < 0)
                  pos += 3

               if (pos - steps == disks[i].pos && disks[index].n > disks[i].n)
                  contr3 = 0
            }
         }

         if (contr3 == 1)
            contr2 = 1

         if (contr2 == 1)
            steps--

         steps++
         if (steps > num)
            esc = 1
      }
      if (contr1 == 1 && contr2 == 1) {
         var h = 1
         for (var i = 0; i < disks.length; i++) {
            if (index != i) {
               if (disks[index].pos - steps < 0 && disks[i].pos == disks[index].pos + 3 - steps)
                  h++;
               else if (disks[i].pos == disks[index].pos - steps)
                  h++;
            }
         }

         if (disks[index].pos - steps < 0)
            disks[index].pos += 3

         disks[index].pos = disks[index].pos - steps
         disks[index].y = height - 20 * h - 1 - 50
         moves++
      }
   }
}
