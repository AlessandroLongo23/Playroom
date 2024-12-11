function setup() {
	createCanvas(windowWidth, windowHeight);

	space_between = width / 4;
	
	sticks = Array.from({ length: 3 }, (_, i) => new Stick(i));
	disks = Array.from({ length: 4 }, (_, i) => new Disk(i));

	for (let disk of disks.reverse())
		sticks[0].insert(disk);
	
	moves = 0;
	stroke(0);
}

function draw() {
	background(200);

	for (let stick of sticks)
		stick.show();

	fill(100);
	rect(0, height - 50, width, 50);
}

function check_win() {
	if (sticks[sticks.length - 1].pile.length == disks.length)
		noLoop();
}

class Stick {
	constructor(index) {
		this.index = index;
		this.pile = [];
	}

	insert(disk) {
		this.pile.push(disk);
		disk.stick = this;
	}

	on_top() {
		return this.pile[this.pile.length - 1];
	}

	show() {
		fill(100);
		rect((this.index + 1) * space_between - 10, height - height / 2 + 50, 20, height / 2 - 50);
		for (let i = 0; i < this.pile.length; i++)
			this.pile[i].show(createVector((this.index + 1) * space_between, height - 50 - (i + 1) * 20));
	}
}

class Disk {
	constructor(index) {
		this.index = index;
		this.radius = (index + 1) * 20;
	}

	show(pos) {
		fill(map(this.index, 0, disks.length - 1, 0, 255));
		rect(pos.x - this.radius, pos.y, this.radius * 2, 20);
	}
	
	move() {
		if (this.stick.on_top() == this) {
			let first_choice_stick = disks.length % 2 == 0 ? sticks[(this.stick.index + 1) % sticks.length] : sticks[(this.stick.index - 1 + sticks.length) % sticks.length];
			let second_choice_stick = disks.length % 2 == 0 ? sticks[(this.stick.index - 1 + sticks.length) % sticks.length] : sticks[(this.stick.index + 1) % sticks.length];

			if (first_choice_stick.pile.length == 0 || first_choice_stick.on_top().index > this.index) {
				this.stick.pile.pop();
				first_choice_stick.insert(this);
				moves++;
			} else if (second_choice_stick.pile.length == 0 || second_choice_stick.on_top().index > this.index) {
				this.stick.pile.pop();
				second_choice_stick.insert(this);
				moves++;
			}
		}
	}
}

function keyPressed() {
	for (let i = 0; i < disks.length; i++)
		if (key == i + 1)
			disks[disks.length - key].move();
}
