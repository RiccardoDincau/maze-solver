class Car {
	constructor(start, width, mazeLines, mode) {
		this.width = width;
		this.mass = 1;
		this.pos = createVector(start[0]*this.width+this.width/2, start[1]*this.width+this.width/2);
		this.vel = createVector(0, 0);
  		this.acc = createVector(0, 0);
  		this.rays = [];
  		this.walls = mazeLines;
  		this.target; 
  		this.rotation = 0;
  		this.mode = mode; 
  		this.x = start[0];
  		this.y = start[1];
  		this.endPoint = [4,4];
  		this.floodArray = [
  			[8,7,6,5,4,4,5,6,7,8],
  			[7,6,5,4,3,3,4,5,6,7],
  			[6,5,4,3,2,2,3,4,5,6],
  			[5,4,3,2,1,1,2,3,4,5],
  			[4,3,2,1,0,0,1,2,3,4],
  			[4,3,2,1,0,0,1,2,3,4],
  			[5,4,3,2,1,1,2,3,4,5],
  			[6,5,4,3,2,2,3,4,5,6],
  			[7,6,5,4,3,3,4,5,6,7],
  			[8,7,6,5,4,4,5,6,7,8],
  		];
  		this.searchingWalls = [
  			[1,1,1,1,1,1,1,1,1,1,1],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,1,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,0,0,0,0,0,0,0,0,0,0],
  			[1,0,0,0,0,0,0,0,0,0,1],
 			[1,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,1],
  			[1,1,1,1,1,1,1,1,1,1,1],
  		];
  		this.stack = [];
  		this.bestPath = [];	
  		this.readyToRun = false;
  		this.goBack = false;
  	}
  	
	createRays() {
		angleMode(DEGREES)
		this.rays = [
			[p5.Vector.fromAngle(radians(90+this.rotation), this.width/2+5).add(this.pos), 0, "red"],
			[p5.Vector.fromAngle(radians(0+this.rotation), this.width/2+5).add(this.pos), 0, "lime"],
			[p5.Vector.fromAngle(radians(-90+this.rotation), this.width/2+5).add(this.pos), 0, "blue"],
		]
	}

	display() {	
		push()
		translate(this.pos.x, this.pos.y)
		rotate(this.rotation)
		rectMode(CENTER); 
		fill(0);
		rect(0,0, this.width/2, this.width/4);
		pop()
		for (var i = 0; i < this.rays.length; i++) {
			stroke(this.rays[i][2]);
			strokeWeight(1);
			line(this.pos.x, this.pos.y, this.rays[i][0].x  , this.rays[i][0].y );
			stroke(0);
		}
		for (let x = 0; x < this.floodArray.length; x++) {
			for (var y = 0; y < this.floodArray.length; y++) {
				textSize(16);
				textAlign(CENTER, CENTER);
				fill("rgba(0, 0, 0, 0.5)")
				fill("rgba(255, 0, 0, 0.4)")
				noStroke()
				text(this.floodArray[y][x], y*this.width+this.width/2, x*this.width+this.width/2);
			}
		}
	}

	update() {
		if (this.target === null) this.flood();
		this.moveToTarget(this.target);
		this.acc.setMag(0.5);
		this.vel.limit(1);
		this.vel.add(this.acc);
	  	this.pos.add(this.vel);
	  	this.acc.mult(0);
	}

	moveToTarget(target) {
		// stroke("orange");
		// strokeWeight(5);
		// point(target.x, target.y);
		// noStroke();
		this.acc = p5.Vector.sub(target, this.pos);
		if (round(target.x*100) === round(this.pos.x*100) && round(target.y*100) === round(this.pos.y*100)) {
  			
  			if (this.pos.x > this.endPoint[0]*this.width && this.pos.x < (this.endPoint[0]+2)*this.width && 
  				this.pos.y > this.endPoint[1]*this.width && this.pos.y < (this.endPoint[1]+2)*this.width) {
					fill("black");
					text("HAI VINTO", 250, 250);
  					if (!this.goBack) this.goBack = true;

			}
  			this.vel.mult(0);
	  		this.acc.mult(0);
	  		this.scanWalls();
	  		this.flood();
			this.move();
		}
	}

	surroundingCells(x,y) {
		let x1 = x + 1;
		let y1 = y;

		let x2 = x;
		let y2 = y - 1;

		let x3 = x - 1;
		let y3 = y;

		let x4 = x;
		let y4 = y + 1;

		if (y2 === -1 && x3 === -1) return [[x1,y1],[x4,y4]];
		if (x === this.floodArray.length-1 && y === this.floodArray.length-1) return [[x2,y2],[x3,y3]];
		if (y2 === -1 && x === this.floodArray.length-1) return [[x3,y3],[x4,y4]]; 
		if (x3 === -1 && y === this.floodArray.length-1) return [[x1,y1],[x2,y2]];
		if (x === this.floodArray.length-1) return [[x2,y2],[x3,y3],[x4,y4]]; 
		if (y === this.floodArray.length-1) return [[x1,y1],[x2,y2],[x3,y3]]; 
		if (y2 === -1) return [[x1,y1],[x3,y3],[x4,y4]]; 
		if (x3 === -1) return [[x1,y1],[x2,y2],[x4,y4]]; 
		return [[x1,y1],[x2,y2],[x3,y3],[x4,y4]];
	}

	getOrientationToMove(x, y, finalX, finalY) {
		// Positive rotation is clockwise
		if ((finalX - x) === 1) this.rotation = 0;
		else if((finalY - y) === -1) this.rotation = 270;
		else if((finalX - x) === -1) this.rotation = 180;
		else if((finalY - y) === 1) this.rotation = 90;
	}

	scanWalls() {
		for (var i = 0; i < this.rays.length; i++) {
			for (var j = 0; j < this.walls.length; j++) {
				let denominator = ((this.rays[i][0].x - this.pos.x) * (this.walls[j][3] - this.walls[j][1])) - ((this.rays[i][0].y - this.pos.y) * (this.walls[j][2] - this.walls[j][0]));
				let numerator1 = ((this.pos.y - this.walls[j][1]) * (this.walls[j][2] - this.walls[j][0])) - ((this.pos.x - this.walls[j][0]) * (this.walls[j][3] - this.walls[j][1]));
				let numerator2 = ((this.pos.y - this.walls[j][1]) * (this.rays[i][0].x - this.pos.x)) - ((this.pos.x - this.walls[j][0]) * (this.rays[i][0].y - this.pos.y));
				let r = numerator1 / denominator;
				let s = numerator2 / denominator;
				if ((r >= 0 && r <= 1) && (s >= 0 && s <= 1)) {
					this.rays[i][1] = 1; //this ray has a collison
					break;
				}
			} 
		}  

  		let xInWalls = this.x + 1;
  		let yInWalls = this.y*2 + 1;
		switch (this.rotation) {
			case 0:
				this.searchingWalls[yInWalls+1][xInWalls] = this.rays[0][1];
				this.searchingWalls[yInWalls][xInWalls] = this.rays[1][1];
				this.searchingWalls[yInWalls-1][xInWalls] = this.rays[2][1];				
				break;
			case 90:
				this.searchingWalls[yInWalls][xInWalls-1] = this.rays[0][1];
				this.searchingWalls[yInWalls+1][xInWalls] = this.rays[1][1];
				this.searchingWalls[yInWalls][xInWalls] = this.rays[2][1];
				break;
			case 180: 
				this.searchingWalls[yInWalls-1][xInWalls] = this.rays[0][1];
				this.searchingWalls[yInWalls][xInWalls-1] = this.rays[1][1];
				this.searchingWalls[yInWalls+1][xInWalls] = this.rays[2][1];
				break;
			case 270: 
				this.searchingWalls[yInWalls][xInWalls] = this.rays[0][1];
				this.searchingWalls[yInWalls-1][xInWalls] = this.rays[1][1];
				this.searchingWalls[yInWalls][xInWalls-1] = this.rays[2][1];
			break;}

	}

	isAccesible(x, y, finalX, finalY) {
		let xInWalls = x + 1;
  		let yInWalls = y*2 + 1;

		if ((finalX - x) === 1 && this.searchingWalls[yInWalls][xInWalls] === 1) return false;
		else if ((finalY - y) === -1 && this.searchingWalls[yInWalls-1][xInWalls] === 1) return false;
		else if ((finalX - x) === -1 && this.searchingWalls[yInWalls][xInWalls-1] === 1) return false;
		else if ((finalY - y) === 1 && this.searchingWalls[yInWalls+1][xInWalls] === 1) return false;
		else return true
	}
	move() {
		this.target = null;
		let currentCellValue = this.floodArray[this.x][this.y];
		let aroundCells = this.surroundingCells(this.x, this.y);
		let equalCell = null;


		for (let i = 0; i < aroundCells.length; i++) {
			let checkingCellVal = this.floodArray[aroundCells[i][0]][aroundCells[i][1]];
			let accessibile = this.isAccesible(this.x, this.y, aroundCells[i][0], aroundCells[i][1]);

			if (currentCellValue - checkingCellVal === 1 && accessibile) {
				this.getOrientationToMove(this.x, this.y, aroundCells[i][0], aroundCells[i][1]);
				this.target =  p5.Vector.fromAngle(radians(this.rotation)).setMag(this.width);
				this.target.add(this.pos);
				this.moveToTarget(this.target);
				this.x = aroundCells[i][0];
				this.y = aroundCells[i][1];
				break;
			} else if (checkingCellVal === currentCellValue && accessibile) {
				equalCell = aroundCells[i];				
			}		
		}

		if (equalCell !== null && this.target === null) {
			this.getOrientationToMove(this.x, this.y, equalCell[0], equalCell[1])
			this.target =  p5.Vector.fromAngle(radians(this.rotation)).setMag(this.width);
			this.target.add(this.pos);
			this.moveToTarget(this.target);
			this.x = equalCell[0];
			this.y = equalCell[1];
		}
	}

	flood() {		
		let aroundCellsToPush = this.surroundingCells(this.x, this.y);
		for (let i = 0; i < aroundCellsToPush.length; i++) {
			if (this.isAccesible(this.x, this.y, aroundCellsToPush[i][0], aroundCellsToPush[i][1])) {
				this.stack.push([aroundCellsToPush[i][0],aroundCellsToPush[i][1]]);
			}
		}

		this.stack.push([this.x, this.y]);

		while (this.stack.length > 0) {
			let a = this.stack.pop()
			let currentCell = this.floodArray[a[0]][a[1]];
			let aroundCells = this.surroundingCells(a[0],a[1]);
			let lowerValCell = 1000000;

			for (let i = 0; i < aroundCells.length; i++) {
				let checkingCellVal = this.floodArray[aroundCells[i][0]][aroundCells[i][1]];
				let accessibile = this.isAccesible(a[0], a[1], aroundCells[i][0], aroundCells[i][1]);				
				if (accessibile && checkingCellVal < lowerValCell) {
					lowerValCell = checkingCellVal;
				};	
			};
			if (!(currentCell - lowerValCell === 1)) {
				if (!(this.floodArray[a[0]][a[1]]===0)) this.floodArray[a[0]][a[1]] = lowerValCell + 1;
				let aroundCellsToPush = this.surroundingCells(a[0],a[1]);
				for (let i = 0; i < aroundCellsToPush.length; i++) {
					if (this.isAccesible(a[0],a[1], aroundCellsToPush[i][0],aroundCellsToPush[i][1]) &&
						lowerValCell !== 0) {
						this.stack.push([aroundCellsToPush[i][0],aroundCellsToPush[i][1]]);
					}
				}
			} 
		}
	}

	setNewOrigin(originX, originY) {	
		this.endPoint = [originX, originY];
  		for (let i = 0; i < 10; i++) {
  			for (let j = 0; j < 10;j++) {
	  			if (!(i === originX && j === originY)) {
	  				this.floodArray[i][j] = Math.abs(originY-j) + Math.abs(originX-i);
	  				this.stack.push([i,j]);
	  			}
	  			else {
	  				this.floodArray[i][j] = 0;
	  			}
	  		}
  		}
  		this.flood();
	}	
}