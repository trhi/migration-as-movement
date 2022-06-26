let context, gain, gains = [], audios = [], audio, cnv, change, speed;
var circles = [], numberOfCircles = 7, mes = [], thisIsYouAUDIO = [], happyface, landscape;
var index, moves, chosenMove, drawingWithCircles = false;
var scene, terhi, refugee;
var phdX, phdY;

// TODO:
// what else do I want to change between the various modes?
// ___ iterator that iterates through the various modes in order <----------------------- PRIORITY!
//     (so that you can just click "round" or "through" to get to the mode you want)
// ___ draw with circles (ie. DO NOT redraw background as black in draw() )
//
// ___ call redraw() == the other circles also move in an interesting way when one is dragged
// ___ do not call redraw() == the other circles don't move when one is dragged
// ___ when move is empty (ie. when it doesn't move), then also do not update background to black at draw!

function nextCircles(){
  //console.log("entered shuffle function");
  //location.reload();
  //chosenMove = random(moves);
  console.log(index);
  if ( index === moves.length-1 ) {
    index = 0;
  } else {
    index++;
  }
  chosenMove = moves[index];
  for(let i=0; i < mes.length; i ++){
    mes[i].move = chosenMove;
  }
    background(0, 0, 0);
  //location.reload();
}

function preload(){
  for (let i = 1; i < numberOfCircles+1; i++){
    circles.push( loadImage(`assets/img/circle-${i}-400k.png`) );
  }

  happyface = loadImage(`assets/img/happy-face-2.png`);
  landscape = loadImage(`assets/img/landscape.png`);

}

function setup() {

  cursor(HAND);
  cnv = createCanvas(windowWidth, windowHeight, P2D);
  //noLoop();

  phdX = width-200;
  phdY = 200;


  console.log("Scene is:", scene);

  if(scene === 'border' || scene === 'title'){
    //document.getElementById("#shuffleButton").visibility = 'visible';
  }

  moves = Object.values(variations.moves); //make array of all maps available
  console.log(moves);

  if(scene === 'title'){
    chosenMove = moves[8]; //on title slide, make them move with perlin
  } else {
    chosenMove = random(moves); //choose random one
    index = moves.indexOf(chosenMove);
  }
  //make lots of mes
  for(let i=0; i<7; i++){
    let me = new Circle ( random(width), random(height), 100, circles[i] );
    me.move = chosenMove;
    //console.log("width and height are:", width, height);
    mes.push(me);
  }

  if(scene === 'border'){
      terhi = new Circle( width/3 + 200, height/2, 100, circles[0] );
      terhi.move = moves[8]; //choose random one
      refugee = new Circle( width/3 - 50, height/2, 100, circles[2] );
      refugee.move = moves[0];
  }
  //console.log(moves.indexOf(chosenMove));

  if(scene === 'phd'){
      terhi = new Circle( 50, height - 10, 100, circles[0] );
      terhi.move = moves[9]; //choose one that goes from bottom left to top right
  }


  background(0, 0, 0);
  //image(happyface, width/3, 1*height/6, 400, 600);
  //image(landscape, width/2, 7*height/8, width, height);



}

function draw(){

  //let toMoveOrNotToMove = mes[0].move();
  //problem is that it is always false in the first moment!
  //console.log("to move or not is:", toMoveOrNotToMove);
    if(scene === 'phd'){
      background(0, 0, 0);
      strokeWeight(3);
      fill('white');
      ellipse(phdX, phdY, 200, 200);

      strokeWeight(10);
      stroke('white');
      line(width/2.5, 0, width/3, height);

      textSize(20);
      noStroke();
      text("PhD", phdX-100, phdY+100);

    } else if ( scene === 'border' ) {
      background(0, 0, 0);
      strokeWeight(10);
      stroke('white');
      line(width/2.5, 0, width/3, height);
  } else if ( chosenMove() === "solitaire" ){
      //draw with the circles
    } else if ( chosenMove() === "drawing" ) {
      background(0, 0, 0);
      image(happyface, 500, 400, 400, 600);
      //image(landscape, width/2, 7*height/8, width, height);
    }  else {
      background(0, 0, 0); //update background
    }

    //background(200, 50, 50);

    //image(happyface, 500, 400, 400, 600);
    //image(landscape, width/2, 7*height/8, width, height);
    //if you don't make it do a background at draw(),
    //then you'll get the circle splaying itself all over the place:
    //background(0, 0, 0);

    //here it draws it too high up on the screen:
    //image(happyface, width/3, 1*height/6, 400, 600);
    //image(circles[0], 0, 0);

if(scene === 'border'){
    terhi.move();
    terhi.display();
    refugee.move();
    refugee.display();
} else if (scene === 'phd'){
  terhi.move();
  terhi.display();
} else {
    for(let i=0; i < mes.length; i ++){
      mes[i].move();
      mes[i].display();
    }
}

}

//Circle object:
class Circle {
  constructor(x, y, r, img) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.img = img;
    this.dragging = false;
    this.xoff = random(0, 10000);
    this.yoff = random(0, 10000);
    this.factor = 0.4; // constant...
  }

  display(){
    imageMode(CENTER);
    image(this.img, this.x, this.y, 2*this.r, 2*this.r);
  }

  move () {}

  clicked( px, py ){
    let d = dist(px, py, this.x, this.y);
    if(d < this.r/4){
      this.dragging = true;
      //cursor('pointer');
      //this.img = random(circles);
      //console.log("I was clicked, my index is!" + mes.indexOf(this));
      //console.log("My coordinates are and width/2 is:" + this.x, this.y, width/2);
    }
  }

  touchStart ( px, py ) {
    let d = dist(px, py, this.x, this.y);
    if(d < this.r/4){
      this.dragging = true;
    }
  }

  touchMove () {
    if(this.dragging){
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  touchEnd () {
    this.dragging = false;
  }

  released () {
    this.dragging = false;
  }

  dragged () {
    if(this.dragging){
      this.x = mouseX;
      this.y = mouseY;
    }
    redraw();
  }

  moved () {
    if(this.dragging){
      this.x = mouseX;
      this.y = mouseY;
    }
  }



}

function touchStarted() {
  for(let i=0; i<mes.length; i++){
    mes[i].touchStart(mouseX, mouseY);
  }
}

function touchMoved() {
  for(let i=0; i<mes.length; i++){
    mes[i].touchMove();
  }
}

function touchEnded() {
  for(let i=0; i<mes.length; i++){
    mes[i].touchEnd();
  }
}


function mousePressed () {
  for(let i=0; i<mes.length; i++){
    mes[i].clicked(mouseX, mouseY);
  }
}

function mouseReleased () {
  for(let i=0; i<mes.length; i++){
    mes[i].released();
  }
}

function mouseDragged () {
  for(let i=0; i<mes.length; i++){
    mes[i].dragged();
  }
}

function mouseMoved() {
  for(let i=0; i<mes.length; i++){
    mes[i].moved();
  }
}
