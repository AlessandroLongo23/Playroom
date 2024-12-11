var board, l
var blacks = []
var whites = []
var turn

function setup() {
	createCanvas(641, 641)

	board = matrix(8, 8)
	l = (width - 1) / 8

	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			board[i][j] = new Cell(i, j, 0)

			if (j <= 2 && (i + j) % 2 == 0) {
				var piece = new Piece(i, j, 0, 1)
				whites.push(piece)
			}
			if (j >= 5 && (i + j) % 2 == 0) {
				var piece = new Piece(i, j, 1, 1)
				blacks.push(piece)
			}
		}
	}

	turn = 0
	print('turno ai bianchi')
}

function draw() {
	background(51)

	for (var i = 0; i < 8; i++)
		for (var j = 0; j < 8; j++)
			board[i][j].show()

	for (var w = 0; w < whites.length; w++)
		whites[w].show()

	for (var b = 0; b < blacks.length; b++)
		blacks[b].show()

	if (blacks.length == 0)
		win(1)

	if (whites.length == 0)
		win(0)
}

function win(team) {
	push()
	fill(255)
	stroke(0)
	strokeWeight(2)
	rectMode(CENTER)
	rect(width / 2, height / 2, width / 2, height / 3, 10)
	pop()

	push()
	textSize(50)
	textAlign(CENTER)
	if (team == 0)
		text("Whites Win!", width / 2, height / 2 + 15)
	else
		text("Blacks Win!", width / 2, height / 2 + 15)
	pop()

	noLoop()
}

class Piece {
	constructor(x, y, team, dama) {
		this.x = x * l
		this.y = y * l
		this.team = team
		this.state = dama

		this.selected = 0
	}

	show() {
		if (this.team == 0) {
			fill(255)
			stroke(0)
		} else {
			fill(0)
			noStroke()
		}
		ellipse(this.x + l / 2, this.y + l / 2, l / 3 * 2, l / 3 * 2)
		if (this.team == 0) {
			fill(230)
			stroke(100)
		} else {
			fill(20)
			stroke(50)
		}
		ellipse(this.x + l / 2, this.y + l / 2, l / 2, l / 2)
		if (this.team == 0) {
			fill(255)
			stroke(100)
		} else {
			fill(0)
			stroke(50)
		}
		ellipse(this.x + l / 2, this.y + l / 2, l / 5, l / 5)
	}
}

class Cell {
	constructor(i, j, color) {
		this.x = i * l
		this.y = j * l
		this.color = color
	}

	show() {
		if ((this.x / l + this.y / l) % 2 == 0)
			fill(255 - this.color, 255, 255 - this.color)
		else
			fill(20, this.color + 20, 20)
		
		rect(this.x, this.y, 80, 80)
	}
}

function mousePressed() {
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			if (mouseX > i * l && mouseX < i * l + l && mouseY > j * l && mouseY < j * l + l) {
				allowed = false
				for (w = 0; w < whites.length; w++) {
					if (abs(mouseX - (whites[w].x + l / 2)) < l / 2 && abs(mouseY - (whites[w].y + l / 2)) < l / 2) {
						whites[w].selected = !whites[w].selected;
						allowed = true
					}
				}

				for (b = 0; b < blacks.length; b++) {
					if (abs(mouseX - (blacks[b].x + l / 2)) < l / 2 && abs(mouseY - (blacks[b].y + l / 2)) < l / 2) {
						blacks[b].selected = !blacks[b].selected;
						allowed = true
					}
				}

				if (board[i][j].color == 0 && allowed)
					board[i][j].color = 255
				else
					board[i][j].color = 0

				for (w = 0; w < whites.length; w++) {
					if (turn == 0) {
						if (i * l == whites[w].x + l && j * l == whites[w].y + l && whites[w].selected == 1) {
							var candidate_x = whites[w].x + l
							var candidate_y = whites[w].y + l
							var allowed = true

							for (w2 = 0; w2 < whites.length; w2++)
								if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
									allowed = false
							
							for (b2 = 0; b2 < blacks.length; b2++)
								if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
									allowed = false

							if (allowed) {
								whites[w].x = board[i][j].x
								whites[w].y = board[i][j].y
								whites[w].selected = 0
								turn = 1
								console.clear()
								print("turno ai neri")
							}

							for (i = 0; i < 8; i++)
								for (j = 0; j < 8; j++)
									board[i][j].color = 0
						}

						if (i * l == whites[w].x - l && j * l == whites[w].y + l && whites[w].selected == 1) {
							var candidate_x = whites[w].x - l
							var candidate_y = whites[w].y + l
							var allowed = true

							for (w2 = 0; w2 < whites.length; w2++)
								if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
									allowed = false

							for (b2 = 0; b2 < blacks.length; b2++)
								if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
									allowed = false

							if (allowed) {
								whites[w].x = board[i][j].x
								whites[w].y = board[i][j].y
								whites[w].selected = 0
								turn = 1
								console.clear()
								print("turno ai neri")
							}

							for (i = 0; i < 8; i++)
								for (j = 0; j < 8; j++)
									board[i][j].color = 0
						}

						for (b = 0; b < blacks.length; b++) {
							if (i * l == whites[w].x + 2 * l && j * l == whites[w].y + 2 * l && whites[w].x + l == blacks[b].x && whites[w].y + l == blacks[b].y && whites[w].selected == 1) {
								var candidate_x = whites[w].x + 2 * l
								var candidate_y = whites[w].y + 2 * l
								var allowed = true

								for (w2 = 0; w2 < whites.length; w2++)
									if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
										allowed = false;

								for (b2 = 0; b2 < blacks.length; b2++)
									if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
										allowed = false;

								if (allowed) {
									whites[w].x = board[i][j].x
									whites[w].y = board[i][j].y
									whites[w].selected = 0
									blacks.splice(b, 1)
									turn = 1
									console.clear()
									print("turno ai neri")
								}

								for (i = 0; i < 8; i++)
									for (j = 0; j < 8; j++)
										board[i][j].color = 0
							}
						}

						for (b = 0; b < blacks.length; b++) {
							if (i * l == whites[w].x - 2 * l && j * l == whites[w].y + 2 * l && whites[w].x - l == blacks[b].x && whites[w].y + l == blacks[b].y && whites[w].selected == 1) {
								var candidate_x = whites[w].x - 2 * l
								var candidate_y = whites[w].y + 2 * l
								var allowed = true

								for (w2 = 0; w2 < whites.length; w2++)
									if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
										allowed = false;

								for (b2 = 0; b2 < blacks.length; b2++)
									if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
										allowed = false;

								if (allowed) {
									whites[w].x = board[i][j].x
									whites[w].y = board[i][j].y
									whites[w].selected = 0
									blacks.splice(b, 1)
									turn = 1
									console.clear()
									print("turno ai neri")
								}

								for (i = 0; i < 8; i++)
									for (j = 0; j < 8; j++)
										board[i][j].color = 0
							}
						}
					}
				}

				for (b = 0; b < blacks.length; b++) {
					if (turn == 1) {
						if (i * l == blacks[b].x + l && j * l == blacks[b].y - l && blacks[b].selected == 1) {
							var candidate_x = blacks[b].x + l
							var candidate_y = blacks[b].y - l
							var allowed = true;

							for (b2 = 0; b2 < blacks.length; b2++)
								if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
									allowed = false;

							for (w2 = 0; w2 < whites.length; w2++)
								if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
									allowed = false;

							if (allowed) {
								blacks[b].x = board[i][j].x
								blacks[b].y = board[i][j].y
								blacks[b].selected = 0
								turn = 0
								console.clear()
								print("turno ai bianchi")
							}

							for (i = 0; i < 8; i++)
								for (j = 0; j < 8; j++)
									board[i][j].color = 0
						}

						if (i * l == blacks[b].x - l && j * l == blacks[b].y - l && blacks[b].selected == 1) {
							var candidate_x = blacks[b].x - l
							var candidate_y = blacks[b].y - l
							var allowed = true

							for (b2 = 0; b2 < blacks.length; b2++)
								if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
									allowed = false;

							for (w2 = 0; w2 < whites.length; w2++)
								if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
									allowed = false;

							if (allowed) {
								blacks[b].x = board[i][j].x
								blacks[b].y = board[i][j].y
								blacks[b].selected = 0
								turn = 0
								console.clear()
								print("turno ai bianchi")
							}

							for (i = 0; i < 8; i++)
								for (j = 0; j < 8; j++)
									board[i][j].color = 0
						}

						for (w = 0; w < whites.length; w++) {
							if (i * l == blacks[b].x + 2 * l && j * l == blacks[b].y - 2 * l && blacks[b].x + l == whites[w].x && blacks[b].y - l == whites[w].y && blacks[b].selected == 1) {
								var candidate_x = blacks[b].x + 2 * l
								var candidate_y = blacks[b].y - 2 * l
								var allowed = true;

								for (b2 = 0; b2 < blacks.length; b2++)
									if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
										allowed = false;

								for (w2 = 0; w2 < whites.length; w2++)
									if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
										allowed = false;

								if (allowed) {
									blacks[b].x = board[i][j].x
									blacks[b].y = board[i][j].y
									blacks[b].selected = 0
									whites.splice(w, 1)
									turn = 0
									console.clear()
									print("turno ai bianchi")
								}

								for (i = 0; i < 8; i++)
									for (j = 0; j < 8; j++)
										board[i][j].color = 0
							}
						}

						for (w = 0; w < whites.length; w++) {
							if (i * l == blacks[b].x - 2 * l && j * l == blacks[b].y - 2 * l && blacks[b].x - l == whites[w].x && blacks[b].y - l == whites[w].y && blacks[b].selected == 1) {
								var candidate_x = blacks[b].x - 2 * l
								var candidate_y = blacks[b].y - 2 * l
								var allowed = true;

								for (b2 = 0; b2 < blacks.length; b2++)
									if (candidate_x == blacks[b2].x && candidate_y == blacks[b2].y)
										allowed = false;

								for (w2 = 0; w2 < whites.length; w2++)
									if (candidate_x == whites[w2].x && candidate_y == whites[w2].y)
										allowed = false;

								if (allowed) {
									blacks[b].x = board[i][j].x
									blacks[b].y = board[i][j].y
									blacks[b].selected = 0
									whites.splice(w, 1)
									turn = 0
									console.clear()
									print("turno ai bianchi")
								}

								for (i = 0; i < 8; i++)
									for (j = 0; j < 8; j++)
										board[i][j].color = 0
							}
						}
					}
				}
			}
		}
	}
}
