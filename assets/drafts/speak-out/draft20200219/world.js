//This was an attempt to move all things related to creating the voronoi
//outside of particles-moving.js
//BUT IT DID NOT WORK. THIS DOES NOT WORK.
//TRANSITION ON HOLD until more important tasks are complete.

//an array that contains an array of allowed/recommended
//random sites to choose from if the user does not specify
//the number of sites to create upon initialising the world
var sitesArray = [3, 4, 5, 6, 7, 8, 9];

//to define the extremities of the world
var canvasX = 600;
var canvasY = 400;

//to define a possible drawing border for the world
//but this is best kept at zero
var drawingBorderX = 0;
var drawingBorderY = 0;

function world(numberOfSites){

  this.canvasX = 600;
  this.canvasY = 400;

  this.drawingBorderX = 0;
  this.drawingBorderY = 0;

  this.numberOfSites = 2;
  this.randomSites = [];

  if (numberOfSites == undefined){
    this.numberOfSites = random(sitesArray);
  } else {
    this.numberOfSites = numberOfSites;
  }

  //apparently, cannot call a function within the constructor...
  //createRandomSites();
  //after running createRandomSites();

  this.simpleInformation = voronoiGetCells();
  this.complexInformation = voronoiGetDiagram();

  //Compute voronoi diagram with size 500 by 300
  //Without a prepared jitter structure (false)
  voronoi(this.canvasX - this.drawingBorderX, this.canvasY - this.drawingBorderY, false);

  this.createWorld = function(){

      //Settings for drawing a voronoi (these are the default values);
      //Set Cell Stroke Weight
      voronoiCellStrokeWeight(1);
      //Set Site Stroke Weight
      voronoiSiteStrokeWeight(0);
      //Set Cell Stroke
      voronoiCellStroke(0);
      //Set Site Stroke
      voronoiSiteStroke(0);
      //Maximum distance between jitters
      voronoiJitterStepMax(20);
      //Minimum distance between jitters
      voronoiJitterStepMin(5);
      //Scales each jitter
      voronoiJitterFactor(3);
      //Jitter edges of diagram
      voronoiJitterBorder(false);

      voronoiSites(this.randomSites);

  }

  this.drawMe = function(){
      //Draw diagram in coordinates 0, 0,
      //filled (true), without jitter (false)
      voronoiDraw(this.drawingBorderX, this.drawingBorderY, true, false);
      console.log("Attempting to draw!");

  }


  this.createRandomSites = function() {
      for (i = 0; i < this.numberOfSites; i++) {
        this.randomSites.push([random(this.drawingBorderX, this.canvasX), random(this.drawingBorderY, this.canvasY), [random(0, 255), random(0, 255), random(0, 255)]]);
        print(this.randomSites);
      } //close for

  } //close this.createRandomSites


}
