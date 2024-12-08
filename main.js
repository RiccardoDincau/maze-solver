let wallsOfTheMaze = 
[
	"0-0;10-0", "10-0;10-10", "0-0;0-10", "0-10;10-10", "0-1;1-1", "1-1;1-3", "2-1;2-2",
	"2-2;3-2", "3-2;3-1", "3-1;5-1", "5-1;5-0", "1-3;4-3", "4-3;4-2", "4-2;6-2", "6-1;8-1",
	"9-0;9-1", "8-1;8-3", "7-2;7-6", "9-2;9-3", "9-2;10-2","5-3;5-2", "6-3;6-5", "3-5;3-3",
	"8-4;8-5", "8-4;9-4", "9-4;9-6", "9-6;8-6", "8-6;8-7","9-7;10-7", "9-8;9-9","9-8;7-8",
	"7-8;7-9", "7-9;6-9", "6-9;6-10","8-9;8-10","4-8;4-9","4-8;6-8", "6-7;8-7","3-8;3-9",
	"2-9;2-10", "0-8;1-8", "1-8;1-9","1-7;5-7", "2-6;2-8", "2-6;6-6","0-6;1-6", "1-6;1-4",
	"1-4;2-4", "2-5;3-5", "4-4;6-4", "4-4;4-6",  "5-9;5-10", "6-6;6-7"
];

// ["0-8;1-8","0-1;1-1", "0-0;10-0", "0-0;0-10", "10-0;10-10", "0-10;10-10", "1-1;1-2", "0-3;1-3", "2-1;2-5", "1-3;1-4", "1-5;2-5", "2-1;5-1", "6-1;6-4", "5-1;5-3", "5-3;3-3", "3-3;3-2", "3-2;4-2", "6-4;4-4", "3-4;3-7", "3-7;2-7", "2-7;2-6", "1-5;1-8", "2-8;2-9", "2-9;1-9", "4-4;4-8", "4-8;2-8", "3-9;7-9", "5-9;5-7", "4-6;6-6", "6-6;6-5", "6-7;6-8", "6-7;5-7", "7-9;7-5", "7-5;6-5", "8-10;8-8", "8-8;9-8", "9-8;9-9", "7-7;9-7", "7-0;7-3", "7-3;6-3", "7-4;9-4", "9-4;9-6", "9-6;8-6", "8-6;8-5", "8-4;8-3", "8-2;8-1", "8-1;9-1", "8-2;9-2", "8-3;9-3", "9-2;9-3"]

let startTile = [0, 0];
let endTile = [4, 4];
let maze;
let car;
let tileWidth = 50;
let stop = false;
let origin = [4,4];

function setup() {
	createCanvas(600, 600);
	maze = new Maze(tileWidth, 11, wallsOfTheMaze, startTile, endTile);
	maze.setupWalls();
	reset();
}

function draw() {
	if (!stop) {
		background(255);
		maze.drawWalls();
		searchMaze();
	}
}

function stopFun() {
	stop = !stop
}

function reset() {
	background(255);
	maze.drawWalls();
	car = new Car(startTile, tileWidth, maze.lines);
	origin = [4,4];
	car.createRays();
	car.move();
	car.update();	
	car.display();
	stop = true;
}


function startFastRun() {
	car.setNewOrigin(0,0);
}

function searchMaze() {
	if (!car.goBack) {
		car.createRays();
		car.update();	
		car.display();
	} else if (car.goBack && origin == [0,0]) {
		if (origin == [0,0]) {
			origin = [4,4];
			car.setNewOrigin(4,4);
		}
		car.update();	
		car.display();
	} else {
		if (origin !== [0,0]) {
			origin = [0,0];
			car.setNewOrigin(0,0);
		}
		car.createRays();
		car.update();	
		car.display();
	}
};