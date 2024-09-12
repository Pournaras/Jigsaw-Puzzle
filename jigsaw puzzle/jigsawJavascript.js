//Setup main variables
let CANVAS = null;

let CONTEXT = null;

let SCALER = 0.8;

let image = null;

let SIZE = {x:0, y:0, width:0, height:0, rows: 6, columns:5};

let PIECES = [];

let SELECTED_PIECE = null;

let gameCompleted = false;

//Setup sizes
function main(){
	
	CANVAS = document.getElementById("jigsawCanvas");
	
	//canvasSizeInTwine = document.getElementById("passages");
	//CANVAS.width = canvasSizeInTwine.style.width;
	//CANVAS.height = canvasSizeInTwine.style.height;
	CANVAS.width = window.innerWidth;
	CANVAS.height = window.innerHeight;
	//CANVAS.width = CANVAS.width * 4;
	//CANVAS.height = CANVAS.height * 4;
	CONTEXT = CANVAS.getContext("2d");
	
	addEventListeners();
	
	image = new Image();
	image.src = "images/starry night.png";
	image.onload = function(){ 
	
		let resizer = SCALER *
			Math.min(
				
				CANVAS.width / image.width,
				CANVAS.height / image.height
			);
			
		SIZE.width = resizer * image.width;
		SIZE.height = resizer * image. height;
		SIZE.x = CANVAS.width/2 - SIZE.width/2;
		SIZE.y = CANVAS.height/2 - SIZE.height/2;
		
		initializePieces(SIZE.rows, SIZE.columns);
		randomizePieces();
			
		updateCanvas(); 
	}
	
}

//Get the position of the mouse relative to the canvas
function getMousePos(canvas, loc) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (loc.x - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (loc.y - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
}

//Check if puzzle is completed
function isComplete(){
	
	for(let i=0; i<PIECES.length; i++){
		
		if(PIECES[i].correct == false){
			
			return false;
		}
	}
	
	return true;
}

//Add mouse functions
function addEventListeners(){
	
	CANVAS.addEventListener("mousedown", onMouseDown);
	CANVAS.addEventListener("mousemove", onMouseMove);
	CANVAS.addEventListener("mouseup", onMouseUp);
}

//Stuff when mouse is pressed
function onMouseDown(evt){
	
	//SELECTED_PIECE = getPressedPiece(evt);
	SELECTED_PIECE = getPressedPiece(getMousePos(CANVAS, evt));
	if(SELECTED_PIECE != null){
		
		const index = PIECES.indexOf(SELECTED_PIECE);
		if(index>-1){
			
			PIECES.splice(index,1);
			PIECES.push(SELECTED_PIECE);
		}
		
		SELECTED_PIECE.offset={
			
			//x:evt.x-SELECTED_PIECE.x,
			//y:evt.y-SELECTED_PIECE.y
			x:getMousePos(CANVAS,evt).x-SELECTED_PIECE.x,
			y:getMousePos(CANVAS,evt).y-SELECTED_PIECE.y
		}
		
		SELECTED_PIECE.correct = false;
	}
}

//Stuff when mouse is moved
function onMouseMove(evt){
	
	if(SELECTED_PIECE != null){
		
		//SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x;
		//SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y;
		SELECTED_PIECE.x = getMousePos(CANVAS,evt).x - SELECTED_PIECE.offset.x;
		SELECTED_PIECE.y = getMousePos(CANVAS,evt).y - SELECTED_PIECE.offset.y;
	}
}

//Stuff when mouse button is released
function onMouseUp(){
	
	if(SELECTED_PIECE != null && SELECTED_PIECE.isClose()){
		
		SELECTED_PIECE.snap();
		
		//Stuff to do when the puzzle is completed
		if(isComplete()){
			
			gameCompleted = true;
			
			//CANVAS.remove();
			
			//var x = document.getElementById("jigsawSolutionImage");
			//x.style.display = "block";
			
			setTimeout(() => {
				x = document.getElementById("jigsawSolutionButton");
				x.style.display = "block";
			}, 1000);
		}
	}
	
	SELECTED_PIECE = null;
}

//Check which piece got pressed
function getPressedPiece(loc){
	
	for(let i=PIECES.length-1; i>=0; i--){
		
		if(loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
			loc.y > PIECES[i].y && loc.y < PIECES[i].y + PIECES[i].height){
				
				return PIECES[i];
			}
	}
	
	return null;
}

//Create the jigsaw pieces
function initializePieces(rows, cols){
	SIZE.rows = rows;
	SIZE.cols = cols;
	
	PIECES = [];
	
	for(let i=0; i<SIZE.rows; i++){
		
		for(let j=0; j<SIZE.columns; j++){
			
			PIECES.push(new Piece(i,j));
		}
	}
	
	let cnt=0;
	for(let i=0; i<SIZE.rows; i++){
		
		for(let j=0; j<SIZE.columns; j++){
			
			const piece = PIECES[cnt];
			
			if(i == SIZE.rows-1){
				
				piece.bottom = null;
			}
			else{
				
				const sgn = (Math.random()-0.5) < 0 ? -1 : 1;
				piece.bottom = sgn * (Math.random() * 0.4 + 0.3);
			}
			
			if(j == SIZE.columns-1){
				
				piece.right = null;
			}
			else{
				
				const sgn = (Math.random()-0.5) < 0 ? -1 : 1;
				piece.right = sgn * (Math.random() * 0.4 + 0.3);
			}
			
			if(j == 0){
				
				piece.left = null;
			}
			else{
				
				piece.left = -PIECES[cnt-1].right;
			}
			
			if(i == 0){
				
				piece.top = null;
			}
			else{
				
				piece.top = -PIECES[cnt - SIZE.columns].bottom;
			}
			
			cnt++;
		}
	}
}

//Start the pieces in a random position
function randomizePieces(){

	for(let i=0; i<PIECES.length; i++){
		
		//Place pieces randomply in a position between the two ranges left and right:
		//[0, SIZE.x-PIECES[i].width], [SIZE.x+SIZE.width, CANVAS.width-PIECES[i].width];
			
		let leftOrRight = Math.floor(Math.random()*10 + 1);
		let xPos;
		console.log(leftOrRight);
			
		if(leftOrRight <= 5){
				
			xPos = Math.random()*(SIZE.x- PIECES[i].width);
		}
		else{
			
			xPos = Math.random()*((CANVAS.width-PIECES[i].width)-(SIZE.x+SIZE.width))
				+ (SIZE.x+SIZE.width);
		}
		
		let loc = {
			
			x:xPos,
			//x:Math.random()*(CANVAS.width - PIECES[i].width),
			y:Math.random()*(CANVAS.height - PIECES[i].height)
		}
		PIECES[i].x = loc.x;
		PIECES[i].y = loc.y;
		PIECES[i].correct = false;
	}
	
}

//Pieces information
class Piece{
	
	constructor(rowIndex, colIndex){
		
		this.rowIndex = rowIndex;
		this.colIndex = colIndex;
		this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns;
		this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows;
		this.width = SIZE.width / SIZE.columns;
		this.height = SIZE.height / SIZE.rows;
		this.xCorrect = this.x;
		this.yCorrect = this.y;
		this.correct = true;
	}
	
	draw(context){
		
		context.beginPath();
		
		const sz = Math.min(this.width, this.height);
		const neck = 0.1 * sz;
		const tabWidth = 0.2 * sz;
		const tabHeight = 0.2 * sz;
		
		//Calculating the links between the pieces:
		
		//from top left
		context.moveTo(this.x, this.y);
		
		//to top right
		if(this.top){
			
			context.lineTo(this.x + this.width * Math.abs(this.top) - neck,
				this.y);
			
			context.bezierCurveTo(
				this.x + this.width * Math.abs(this.top) - neck,
				this.y - tabHeight * Math.sign(this.top) * 0.2,
				
				this.x + this.width * Math.abs(this.top) - tabWidth,
				this.y - tabHeight * Math.sign(this.top),
				
				this.x + this.width * Math.abs(this.top),
				this.y - tabHeight * Math.sign(this.top)
			);
				
			context.bezierCurveTo(
				this.x + this.width * Math.abs(this.top) + tabWidth,
				this.y - tabHeight * Math.sign(this.top),
				
				this.x + this.width * Math.abs(this.top) + neck,
				this.y - tabHeight * Math.sign(this.top) * 0.2,
				
				this.x + this.width * Math.abs(this.top) + neck,
				this.y
			);
		}
		context.lineTo(this.x + this.width, this.y);
		
		//to bottom right
		if(this.right){
			context.lineTo(this.x + this.width,
				this.y + this.height * Math.abs(this.right) - neck);
				
			context.bezierCurveTo(
				this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
				this.y + this.height * Math.abs(this.right) - neck,
				
				this.x + this.width - tabHeight * Math.sign(this.right),
				this.y + this.height * Math.abs(this.right) - tabWidth,
				
				this.x + this.width - tabHeight * Math.sign(this.right),
				this.y + this.height * Math.abs(this.right)
			);
			
			context.bezierCurveTo(
				this.x + this.width - tabHeight * Math.sign(this.right),
				this.y + this.height * Math.abs(this.right) + tabWidth,
				
				this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
				this.y + this.height * Math.abs(this.right) + neck,
				
				this.x + this.width,
				this.y + this.height * Math.abs(this.right) + neck
			); 
		}
		context.lineTo(this.x + this.width, this.y + this.height);
		
		//to bottom left
		if(this.bottom){
			context.lineTo(this.x + this.width * Math.abs(this.bottom) + neck,
				this.y + this. height);
				
			context.bezierCurveTo(
				this.x + this.width * Math.abs(this.bottom) + neck,
				this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,
				
				this.x + this.width * Math.abs(this.bottom) + tabWidth,
				this.y + this.height + tabHeight * Math.sign(this.bottom),
				
				this.x + this.width * Math.abs(this.bottom),
				this.y + this.height + tabHeight * Math.sign(this.bottom)
			);
			
			context.bezierCurveTo(
				this.x + this.width * Math.abs(this.bottom) - tabWidth,
				this.y + this.height + tabHeight * Math.sign(this.bottom),
				
				this.x + this.width * Math.abs(this.bottom)- neck,
				this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,
				
				this.x + this.width * Math.abs(this.bottom) - neck,
				this.y + this.height
			);
		}
		context.lineTo(this.x, this.y + this.height);
		
		//to top left
		if(this.left){
			context.lineTo(this.x,
				this.y + this.height * Math.abs(this.left) + neck);
			
			context.bezierCurveTo(
				this.x + tabHeight * Math.sign(this.left) * 0.2,
				this.y + this.height * Math.abs(this.left) + neck,
				
				this.x + tabHeight * Math.sign(this.left),
				this.y + this.height * Math.abs(this.left) + tabWidth,
				
				this.x + tabHeight * Math.sign(this.left),
				this.y + this.height * Math.abs(this.left)
			);
			
			context.bezierCurveTo(
				this.x + tabHeight * Math.sign(this.left),
				this.y + this.height * Math.abs(this.left) - tabWidth,
				
				this.x + tabHeight * Math.sign(this.left) * 0.2,
				this.y + this.height * Math.abs(this.left) - neck,
				
				this.x,
				this.y + this.height * Math.abs(this.left) - neck
			);
		}
		context.lineTo(this.x, this.y);
		
		//Drawing the image inside the pieces:
		context.save();
		context.clip();
		
		const scaledTabHeight = 
			Math.min(image.width/SIZE.columns, image.height/SIZE.rows) * tabHeight/sz;
		
		context.drawImage(image,
			this.colIndex*image.width/SIZE.columns - scaledTabHeight,
			this.rowIndex*image.height/SIZE.rows - scaledTabHeight,
			image.width/SIZE.columns + scaledTabHeight * 2,
			image.height/SIZE.rows + scaledTabHeight * 2,
			this.x - tabHeight,
			this.y - tabHeight,
			this.width + tabHeight * 2,
			this.height + tabHeight * 2
		);
		
		context.restore();
		
		context.stroke();
	}
	
	//Check if a piece is close to its correct position
	isClose(){
		
		if(distance({x:this.x, y:this.y},
			{x:this.xCorrect, y:this.yCorrect}) < this.width/3){
				
			return true;
		}
		
		return false;
	}
	
	//Attach a piece to its correct position
	snap(){
		
		this.x = this.xCorrect;
		this.y = this.yCorrect;
		this.correct = true;
	}
	
}

//Calculate distance between two points
function distance(p1, p2){
	
	return Math.sqrt(
	
		(p1.x - p2.x) * (p1.x - p2.x) + 
		(p1.y - p2.y) * (p1.y - p2.y)
	);
}

//Drawing in the canvas
function updateCanvas(){
	
	CONTEXT.clearRect(0,0,CANVAS.width,CANVAS.height);
	
	if(!gameCompleted)
		CONTEXT.globalAlpha = 0.2;
	
	CONTEXT.drawImage(
		image,
		SIZE.x,
		SIZE.y,
		SIZE.width,
		SIZE.height
	);
	
	CONTEXT.globalAlpha = 1;
	
	if(!gameCompleted){
		for(let i=0; i<PIECES.length; i++){
	
			PIECES[i].draw(CONTEXT);
		}
	}
	
	if(!gameCompleted)
		window.requestAnimationFrame(updateCanvas);
}

function restartGame(){
		
	x = document.getElementById("jigsawSolutionButton");
	x.style.display = "none";
	
	gameCompleted = false;
	
	randomizePieces();
	
	updateCanvas();
}



//Execute functions
main();