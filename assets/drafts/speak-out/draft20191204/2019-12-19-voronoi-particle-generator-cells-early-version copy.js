var bug1;
var bug2;
var bug3;
var bug4;
var bugDiameter;

var site1;
var site2;
var site3;
var site4;

var drawingBorderX = 20;
var drawingBorderY = 20;

var theWorld;
var particles;

function setup() {

	createCanvas(550, 350);
	noSmooth();
    frameRate(30);

    site1 = [33,78,255];
    site2 = [150,170,230];
    site3 = [200,9,190];
    site4 = [300,220,170];

	//Settings for drawing(these are the default values)

	//Set Cell Stroke Weight
	voronoiCellStrokeWeight(1);
	//Set Site Stroke Weight
	voronoiSiteStrokeWeight(3);
	//Set Cell Stroke
	voronoiCellStroke(0);
	//Set Site Stroke
	voronoiSiteStroke(0);
	//Set flag to draw Site
	//voronoiSiteFlag(true);

	//Add array of custom sites
	voronoiSites([site1,site2,site3,site4]);

	//Remove custom site with coordinates 15,5
	//voronoiRemoveSite(15, 5);

	//Remove custom site with index 0 (in this case it's the site with coordinates [5,5])
	//voronoiRemoveSite(0);

	//Compute voronoi diagram with size 500 by 300
	//Without a prepared jitter structure (false)
	voronoi(500, 300, false);

    //Draw diagram in coordinates 0, 0,
	//filled (true), without jitter (false)
    voronoiDraw(0, 0, true, false);

    bugDiameter = 10;

    //print("This is the length of the voronoi cells array:" + voronoiGetCells().length);

    theWorld = voronoiGetDiagram();

    //print(theWorld);

    //print(theWorld.cells[0].site);

    //print(theWorld.cells[1].site);

    //print(voronoiNeighbors(3));

    //implementing a for loop which initialises by generating
    //a new jitterbug at each voronoicell site):

    particles = [];

    //print(particles);


    for(i=0; i < voronoiGetCells().length; i++){
      particles.push(new jitterbug(theWorld.cells[i].site.x+drawingBorderX, theWorld.cells[i].site.y+drawingBorderY, bugDiameter));
    }

    //print(particles);

    //bug1 = new jitterbug(220,29,10);
    //bug2 = new jitterbug(53,98,10);
    //bug3 = new jitterbug(170,190,10);
    //bug4 = new jitterbug(320,240,10);



    //bug1 = new jitterbug(site1[0]+drawingBorderX,site1[1]+drawingBorderY,bugDiameter);
    //bug2 = new jitterbug(site2[0]+20,site2[1]+20,bugDiameter);
    //bug3 = new jitterbug(site3[0]+20,site3[1]+20,bugDiameter);
    //bug4 = new jitterbug(site4[0]+20,site4[1]+20,bugDiameter);

	//Get the raw diagram, for more advanced use
	//This is purely to get information, doesn't change the diagram
	//https://github.com/gorhill/Javascript-Voronoi
	//var diagram = voronoiGetDiagram();
	//console.log(diagram);

	//Get simplified cells without jitter, for more advanced use
	var normal = voronoiGetCells();
	//console.log(normal);

	//Get simplified cells with jitter, for more advanced use
	//var jitter = voronoiGetCellsJitter();
	//console.log(jitter);

   /* console.log("bug1 factor:" +bug1.factor,
                "bug1 color:" +bug1.color,
                "bug1 speed:" +bug1.speed,
                "bug2 factor:" +bug2.factor,
                "bug2 color:" +bug2.color,
                "bug2 speed:" +bug2.speed,
                "bug3 factor:" +bug3.factor,
                "bug3 color:" +bug3.color,
                "bug3 speed:" +bug3.speed,
                "bug4 factor:" +bug4.factor,
                "bug4 color:" +bug4.color,
                "bug4 speed:" +bug4.speed);*/

}



function draw(){

  //removes trace of former particles
  clear();

  //Draw diagram in coordinates 0, 0
  //Filled and without jitter
  voronoiDraw(drawingBorderX, drawingBorderY, true, false);

  //for each 30th frame refresh
  //spawnNewBugs();
  //moveAllBugs();
  //displayAllBugs();

  for(i=0; i < particles.length; i++){
    particles[i].move();
    particles[i].display();
    //print(particles);
  }

  if(frameCount%888==0){
      for(i=0; i < voronoiGetCells().length; i++){
        particles.push(new jitterbug(theWorld.cells[i].site.x+drawingBorderX, theWorld.cells[i].site.y+drawingBorderY, bugDiameter));
      }
  }


}

//this code is courtesy of the p5js example: jitterbug

function jitterbug(tempX,tempY,tempDiameter){

  //set the x,y coordinates of the origin of the particle
  //we can use these originX and originY coordinates to check the bugs current x,y position relative to the generator of the cell, ie. relative to the cell.
  //ie. we can measure distance between the current x,y and the generators of all the voronoicells to determine which cell the particle is currently in
  //and thus we can translate its x,y to make it "collide" away from the boundary delimiting its origin cell
  this.originX = tempX;
  this.originY = tempY;
  this.originVector = createVector(tempX, tempY);
  //print("originVector is:" + this.originVector);

  //set the x,y coordinates of the particle. These are altered everytime the .move() -method is called.
  this.positionVector = createVector(tempX, tempY);
  //print("positionVector is:" + this.positionVector);
  //this.x = tempX;
  //this.y = tempY;
  this.diameter = tempDiameter;

  this.towardsHome = createVector();

  //we could use speed and factor even to set the general "propensity of the particles to move" for any particular simulation
  this.speedVector = createVector(constrain(10*random(), 0, 5),constrain(10*random(), 0, 5));
  //print("speedVector is:" + this.speedVector);

  //var randomSpeed = 10*random();
  //var speed = constrain(randomSpeed, 0, 5);
  //this.speed = speed;

  this.factor = 3*random();

  //bug color matches cell, BUT: how to make it so that
  //this color is assigned once and then never changes again?
  //solved: draw initial voronoi diagram BEFORE creating bugs
  //THEN assign colors as generator+5 in order for them not to
  //become black, which is the color of the generator pixel...
  //That's why we add 5 pixels to both x and y, but this is of
  //course not foolproof, because the cell could end at <5 px..
  //BUT for now, with these parameters, it allows me to spawn
  //particles that inherit the color of their cell of origin
  //and now I can observe how some particles move all over the
  //place while others hover within their original cell.
  //next step: make particles collide against cell extremities.
  this.particleOriginColor = get(tempX+5, tempY+5);
  //var bugColor = color(random(255),random(255),random(255), random(255));
  this.color = this.particleOriginColor;

	var cellId = voronoiGetSite(tempX, tempY, false);
  var particleBirthColor = voronoiGetColor(cellId);

  //print("Color at birth:" + particleBirthColor);


  this.move = function(){
    //this.x += random(-this.speed,this.speed)*this.factor;
    //this.y += random(-this.speed,this.speed)*this.factor;

    //constrain(this.positionVector.x, 20, width-20)
    var randomX = random(-this.speedVector.x,this.speedVector.x)*this.factor;
    var randomY = random(-this.speedVector.y, this.speedVector.y)*this.factor;

    this.positionVector.add(randomX, randomY);
    //print("positionVector is now" + this.positionVector);

    this.positionVector.x = constrain(this.positionVector.x, drawingBorderX, width-drawingBorderX)
    this.positionVector.y = constrain(this.positionVector.y, drawingBorderY, height-drawingBorderY)

    if(!this.amIHome()){
      this.towardsHome = p5.Vector.sub(this.originVector, this.positionVector);
      this.towardsHome.normalize();

      //print("This is the towarards home vector:" + this.towardsHome);
      //print("This is the originVector:" + this.originVector);
      this.positionVector.add(this.towardsHome);

    }


  };

  this.amIHome = function(){

     //bugColorMatchesCell is the cell color of the origin of the bug
    var colorOfTheLand = get(this.positionVector.x, this.positionVector.y);
    //print("This is the background color" + colorOfTheLand);
    if(this.particleOriginColor == colorOfTheLand){
       return true;
    }
    else{
      return false
    }

  }

  this.display = function(){

    fill(this.particleOriginColor);
    ellipse(this.positionVector.x,this.positionVector.y,this.diameter,this.diameter);

  };
}
