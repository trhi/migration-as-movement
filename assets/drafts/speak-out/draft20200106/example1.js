var particleDiameter;

var drawingBorderX = 0;
var drawingBorderY = 0;

var canvasX = 600;
var canvasY = 400;

var numSites = 9;
var randomSites = [];
var theWorld;
var particles = [];
var attractors = [];
var attractorQualities = [];

function setup() {

  createCanvas(canvasX, canvasY);
  noSmooth();
  frameRate(30);

  //initialising particle diameter to 10px
  particleDiameter = 10;

  attractorQualities = ["nothing", "work", "love", "study", "culture", "freedom", "peace"];

  createRandomSites();

  //to-do: random site generator, with certain parameters (ie max number of sites, minimum distance)
  /*
    site1 = [33,78,"magenta"];
    site2 = [200,300,230];
    site3 = [300,9,190];
    site4 = [500,220,"cyan"];
  */

  //Settings for drawing(these are the default values)

  //Set Cell Stroke Weight
  voronoiCellStrokeWeight(1);
  //Set Site Stroke Weight
  voronoiSiteStrokeWeight(10);
  //Set Cell Stroke
  voronoiCellStroke(0);
  //Set Site Stroke
  voronoiSiteStroke(0);
  //Set flag to draw Site
  //voronoiSiteFlag(true);

  //Maximum distance between jitters
  voronoiJitterStepMax(20);
  //Minimum distance between jitters
  voronoiJitterStepMin(5);
  //Scales each jitter
  voronoiJitterFactor(3);
  //Jitter edges of diagram
  voronoiJitterBorder(false);

  //after running createRandomSites();
  voronoiSites(randomSites);

  //Add array of custom sites
  //voronoiSites([site1,site2,site3,site4]);

  //Compute voronoi diagram with size 500 by 300
  //Without a prepared jitter structure (false)
  voronoi(canvasX - drawingBorderX, canvasY - drawingBorderY, true);

  //Draw diagram in coordinates 0, 0,
  //filled (true), without jitter (false)
  voronoiDraw(drawingBorderX, drawingBorderY, true, true);
  //voronoiDraw(0, 0, true, false);


  theWorld = voronoiGetDiagram();

  //printing the voronoi diagram generated(full detailed diagram):
  console.log("This is the world: ");
  console.log(theWorld);

  //implementing a for loop which initialises by generating
  //a new particle at each voronoicell site):
  particles = [];

  //this places the new paricle next
  for (i = 0; i < voronoiGetCells().length; i++) {
    particles.push(new particle(theWorld.cells[i].site.x, theWorld.cells[i].site.y, particleDiameter));
  }

  //Get simplified cells without jitter, for more advanced use
  var normal = voronoiGetCells();
  //console.log(normal);

}


function draw() {

  //removes trace of former particles
  clear();

  //Draw diagram in coordinates 0, 0
  //Filled and without jitter
  voronoiDraw(drawingBorderX, drawingBorderY, true, true);
  textSize(20);
  text(frameCount, 20, 30);

  if (frameCount % 200 == 0) {
    spawnNewAttractor();
    //console.log("There is a new attractor in the attractors array, with the quality: " + attractors[0].quality);
    //console.log(attractors[0].quality);
  }

  for (i = 0; i < attractors.length; i++) {
    //displays all attractors in the world
    attractors[i].display();
  } //close for loop

  //once 50 particles have been created, we start zoning them towards attractors..
  if(particles.length > 7){
    particles[0].diameter = 15;
    particles[0].goTowardsAttractor[0];
    /*
     for(i=0; i<particles.length; i++){
       if(i%2==0){
            particles[i].diameter = 15;
            particles[i].goTowardsAttractor[0];
            console.log("Going towards attractor 0!");
        }
       if(i%3==0){
          particles[i].diameter = 15;
          particles[i].goTowardsAttractor[1];
          console.log("Going towards attractor 1!");
        }*/

  }

  for (i = 0; i < particles.length; i++) {
    //also try to create a new method for how the particles move...
    //so that it looks better... possibly using perlian noise
    particles[i].move();
    particles[i].display();
  } //close for loop



  //spawnNewParticles method
  if (frameCount % 8 == 0) {
    spawnNewParticles();
  } //close if framecount

} //close function draw

function spawnNewAttractor() {

  var attractorX = random(0, width);
  var attractorY = random(0, height);
  var quality = random(attractorQualities);
  //sets a random lifespan
  var lifespan = random(600,1000);

  attractors.push(new attractor(quality, attractorX, attractorY, lifespan));

}

function attractor(quality, attractorX, attractorY, lifespan) {
  this.quality = quality;
  this.x = attractorX;
  this.y = attractorY;
  this.attractorPosition = new p5.Vector(this.x, this.y);
  this.lifespan = lifespan;
  this.gravityOfAttractor = random(20,50);
  console.log("My lifespan is:" + this.lifespan);

  this.existsIn = voronoiGetSite(this.x, this.y, true);
  //console.log("A new attractor was created. This attractor is for: " + this.quality +
  //  " , and exists in cell: " + this.existsIn);

  this.display = function() {
    //choose the fill color or image or logo based on the quality of the attractor
    fill("white");
    ellipse(this.x, this.y, 20, 20);
    this.lifespan -= 1;
    //console.log("My lifespan is now: " + this.lifespan);
    if(this.lifespan <= 0){
       this.remove();
    }//endif
  }//close this.display

  this.remove = function(){
    var myIndex = attractors.indexOf(this);
    console.log(myIndex);
    attractors.splice(myIndex,1);
    console.log("Removed me! At index:" + myIndex);
    console.log("Attractors array now looks like this:");
    console.log(attractors);

  }//close this.remove

}//close attractor

function spawnNewParticles() {
  for (i = 0; i < voronoiGetCells().length; i++) {
    var birthX;
    var birthY;
    var newParticle;
    /*
    //create a new method which will spawn a new particle at any point within the cell
    //so that then particles will "fill the cell" and move all around it. Albeit still
    //gravitate towards the originator once they foray outside of their cell.
    birthX = constrain(canvasX*random(), drawingBorderX, drawingBorderX+canvasX-1);
    birthY = constrain(canvasY*random(), drawingBorderY, drawingBorderY+canvasY-1);
    newParticle = [birthX, birthY, particleDiameter);
    */

    //for creating new particles at the voronoi sites:
    newParticle = new particle(theWorld.cells[i].site.x, theWorld.cells[i].site.y, particleDiameter);
    var randomPointID = voronoiGetSite(theWorld.cells[i].site.x, theWorld.cells[i].site.y, false);

    //this new if() structure has radically reduced the amount of particles spawned
    if ((randomPointID == 0 && frameCount % 10 == 0) ||
        (randomPointID == 1 && frameCount % 30 == 0) ||
        (randomPointID % 2 == 0 && frameCount % 5 == 0) ||
        (randomPointID % 3 == 0 && frameCount % 20 == 0) ||
        (randomPointID == 5 && frameCount % 70 == 0)
       ) {
      //particles.push(new particle(birthX, birthY, particleDiameter));
      particles.push(newParticle);
    }
  } //close for
} //close spawnNewParticles()

function createRandomSites() {
  for (i = 0; i < numSites; i++) {
    randomSites.push([random(drawingBorderX, canvasX), random(drawingBorderY, canvasY), [random(0, 255), random(0, 255), random(0, 255)]]);
    print(randomSites);
  } //close for

} //close return random sites

//this code is courtesy of the p5js example: jitterbug
function particle(tempX, tempY, tempDiameter) {

  //set the x,y coordinates of the origin of the particle
  //we can use these originX and originY coordinates to check the bugs current x,y position relative to the generator of the cell, ie. relative to the cell.
  //ie. we can measure distance between the current x,y and the generators of all the voronoicells to determine which cell the particle is currently in
  //and thus we can translate its x,y to make it "collide" away from the boundary delimiting its origin cell

  this.isAttractedTo = random(attractorQualities);
  var gravityOfAttractor;
  this.gravityOfAttractor = random(3, 8);
  this.towardsAttractor = createVector();
  //console.log("This particle is attracted to: " + this.isAttractedTo);

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
  //This was originally called "speedvector"
  //but was later named to propensityToMove, in order to be more descriptive
  this.propensityToMove = createVector(constrain(10 * random(), 0, 5), constrain(10 * random(), 0, 5));
  //print("speedVector is:" + this.speedVector);

  //var randomSpeed = 10*random();
  //var speed = constrain(randomSpeed, 0, 5);
  //this.speed = speed;

  //This is to initialise the xoff-variable for each particle to start at position 0
  //in the perlin noise table of "random" nubers
  var xoff;
  this.xoff = random(0, 10000);

  var yoff;
  this.yoff = random(0, 10000);

  var gravityOfHome;
  this.gravityOfHome = random(2, 4);
  //print("Gravity of Home is: " + this.gravityOfHome);

  this.factor = 3 * random();

  var cellId = voronoiGetSite(tempX, tempY, false);
  var particleBirthColor = voronoiGetColor(cellId);
  //this.color = particleBirthColor;
  this.particleBirthColor = particleBirthColor;
  this.color = particleBirthColor;

  //Do not like the way that the particles are moving. In general, they hover around
  //the generator, instead of filling the entire space of their cell as would be
  //natural...

  this.move = function() {

    /*
    //functional random noise walker
    //constrain(this.positionVector.x, 20, width-20)
    //pick a random number between negative speed and positive speed
    //and multiply it by the "factor"
    var randomX = random(-this.speedVector.x,this.speedVector.x)*this.factor;
    var randomY = random(-this.speedVector.y,this.speedVector.y)*this.factor;
    this.positionVector.add(randomX, randomY);
    //print("positionVector is now" + this.positionVector);
    */

    //In the perlin noise version, we will simply iterate through the perlin noice
    //table of numbers by incrementing the xoff and yoff variables for each particle.
    let randomXNoise = noise(this.xoff)
    this.xoff += 0.01;

    let randomYNoise = noise(this.yoff)
    this.yoff += 0.01;

    let randomXSpeedFactor = map(randomXNoise, 0, 1, -4, 4);
    let randomYSpeedFactor = map(randomYNoise, 0, 1, -4, 4);

    this.positionVector.add(randomXSpeedFactor, randomYSpeedFactor);
    this.positionVector.dot(this.propensityToMove);

    //this code will make it back into a jitter bug..... althought even crazier
    //and more jittery than before :DDDDDDD
    //this.propensityToMove.rotate(map(random(-randomXNoise, randomXNoise), 0, 1, -360, 360));
    //this.positionVector.add(this.propensityToMove);

    //In other words, I need to add random rotations to the random movement
    //but even these random rotations need to be defined by perlin noise,
    //perhaps using the second dimension of perlin noise

    /*
    //random() movement:
    var randomX = random(-this.speedVector.x,this.speedVector.x)*this.factor;
    var randomY = random(-this.speedVector.y,this.speedVector.y)*this.factor;
    this.positionVector.add(randomX, randomY);
    */

    this.positionVector.x = constrain(this.positionVector.x, drawingBorderX, width)
    this.positionVector.y = constrain(this.positionVector.y, drawingBorderY, height)

    //THIS DOES NOT WORK
    //this.goTowardsAttractor();

    this.amIOnTheEdge();

    if (!this.amIHome()) {
      this.towardsHome = p5.Vector.sub(this.originVector, this.positionVector);
      this.towardsHome.normalize();

      this.towardsHome.mult(this.gravityOfHome);
      //*this.gravityOfHome
      //print("This is the towarards home vector:" + this.towardsHome);
      //print("This is the originVector:" + this.originVector);
      this.positionVector.add(this.towardsHome);

    }

  } //close this.move()

  this.thereIsAMatch = function() {
    for (i = 0; i < attractors.length; i++) {
        //console.log(attractors[i].quality);
        console.log("Printing the quality of this attractor:" + attractors[i].quality);
        console.log("Printing what I am attracted to:" + this.isAttractedTo);
        if (attractors[i].quality === this.isAttractedTo) {
            return i;
        }//end if
    }//end for
  }//close thereIsAMatch

  //THIS DOES NOT WORK
  //Now this does work, but I've made a very awkward version,
  //in order to avoid looping through the entire "is there an attractor match" loop for
  //each particle and each attractor....
  //need to implement the model outlined in my sketchbook today 19.12.2019:
  //eg. attractorQuality: work, particles attracted to: [].
  //and then at the spawning of each attractor, assign specific particles
  //to that attractor, so that once an attractor is born,
  //at each draw() cycle,
  this.goTowardsAttractor = function(attractorIndex) {
    //var enoughIsEnough = false;

      //THIS DOES NOT WORK
      //Now it works, but of course, it crashes the entire system...
      //because you are trying to iterate through every single particle checking all
      //the matches between each particle and each attractor at each draw cycle...
      //that does not work.
      //New logic: when an attractor is born, assign x particles to it
      //during the lifespan of the attractor, at each draw cycle,
      //move the selected particles towards the attractor with some force.
      //for (i = 0; !enoughIsEnough && i < attractors.length; i++) {
        //console.log(attractors[i].quality);
        //console.log("Printing the quality of this attractor:" + attractors[i].quality);
        //console.log("Printing what I am attracted to:" + this.isAttractedTo);
        //if (attractors[i].quality === this.isAttractedTo) {
          //console.log("There is an attractor match!");
          //this.diameter += 1;

          console.log("Going towards attractor....");

          this.towardsAttractor = p5.Vector.sub(attractors[attractorIndex].attractorPosition, this.positionVector);
          this.towardsAttractor.normalize();

          //need to define this.gravityOfAttractor = random(3,8);
          //either define gravityOfAttractor as a property of the particle
          //or of the attractor itself...

          //COMMENTED OUT multiplying the towardsAttractor-vector by a scalar
          //this.towardsAttractor.mult(attractors[attractorIndex].gravityOfAttractor);
          this.positionVector.add(this.towardsAttractor);
          //enoughIsEnough = true;

        //} //close if
      //} //close for

  } //close this.goTowardsAttractor

  this.amIOnTheEdge = function() {

    if (this.positionVector.x == width) {
      this.positionVector.x = 0;
    }
    if (this.positionVector.x == 0) {
      this.positionVector.x = width;
    }

    if (this.positionVector.y == height) {
      this.positionVector.y = 0;
    }
    if (this.positionVector.y == 0) {
      this.positionVector.y = height;
    }

  } //close this.amIOnTheEdge()

  this.amIHome = function() {
    //bugColorMatchesCell is the cell color of the origin of the bug
    var colorOfTheLand = get(this.positionVector.x, this.positionVector.y);
    //print("This is the background color" + colorOfTheLand);
    if (this.particleBirthColor == colorOfTheLand) {
      return true;
    } //close if
    else {
      return false
    } //close else

  } //close amIHome()

  this.display = function() {

    fill(this.color);
    ellipse(this.positionVector.x, this.positionVector.y, this.diameter, this.diameter);

  };
}
