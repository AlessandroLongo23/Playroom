var posx, posy, r
var cont, punt
var hitted, appeared

function setup() {
  createCanvas(600, 600)
  colorMode(HSB)

  cont = 0
  r = 50
  punt = 0
  hitted = 0
  appeared = 0
}

function draw() {
  background(0)

  if (cont % 40 == 0) {
    color = 0
    appeared++
    talpa()
  }
  push()
  fill(color, 255, 255)
  ellipse(posx, posy, 2 * r)
  pop()

  push()
  textSize(30)
  fill(255)
  text(hitted + ' / ' + appeared, 10, 50)
  pop()

  cont++
}

function talpa() {
  posx = random(width)
  posy = random(height)
}

function mousePressed() {
  var d = dist(mouseX, mouseY, posx, posy)
  if (d < r) {
    color = 100
    punt++
    hitted++
  }
}
