function setup() {
   createCanvas(windowWidth, windowHeight - 1, WEBGL)

   world = matrix(100, 100)

   camera = createCamera()

   create_world()
}

function draw() {
   background(100, 100, 255)

   show_world()

   orbitControl()
}

function create_world() {
   for (var i = 0; i < 100; i++)
      for (var j = 0; j < 100; j++)
         world[i][j] = round(noise(i / 100, j / 100) * 100)
}

function show_world() {
   for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
         push()
         translate((i - 50) * 50, world[i][j] * 50, (j - 50) * 50)
         
         if (world[i][j] < 20)
            fill(0, 255, 0)
         else if (world[i][j] >= 20 && world[i][j] < 40)
            fill(115, 84, 0)
         else
            fill(156, 156, 156)

         stroke(0, 150, 0)
         box(50, 50)
         pop()
      }
   }
}
