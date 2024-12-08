class Maze {
	constructor(widthOfTile, widthOfMaze, walls, start, end) {
		this.tWidth = widthOfTile;
		this.mWidth = widthOfMaze;
		this.walls = walls;
		this.points = [];
		this.lines = [];
		this.start = start;
		this.end = end;
	}

	setupWalls() {
		for (let x = 0; x < this.mWidth; x++) {
			for (let y = 0; y < this.mWidth; y++){
				this.points.push([x*this.tWidth, y*this.tWidth]);
			}
		}
		for (var i = 0; i < this.walls.length; i++) {
			let a = this.walls[i].split(";");
			let startPos = a[0].split("-");
			let endPos = a[1].split("-");
			this.lines.push([startPos[0]*this.tWidth, startPos[1]*this.tWidth, 
				endPos[0]*this.tWidth, endPos[1]*this.tWidth])
		}
	}

	drawWalls() {
		strokeWeight(1);
		// Draw start
		rectMode(CORNER);
		noStroke();
		fill("#dfe6e9");
		square(this.start[0]*this.tWidth+1, this.start[1]*this.tWidth+1, this.tWidth-2);
		// Draw End
		fill("#fab1a0");
		square(this.end[0]*this.tWidth+1, this.end[1]*this.tWidth+1, this.tWidth*2-2);
		stroke(0);
		for (var i = 0; i < this.points.length; i++) {
			point(this.points[i][0], this.points[i][1])
		}
		for (var i = 0; i < this.lines.length; i++) {
			line(this.lines[i][0], this.lines[i][1], this.lines[i][2], this.lines[i][3]);
		}
	}
}
