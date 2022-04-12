//this is the drawing border around the world
var drawingBorderX = 0;
var drawingBorderY = 0;

//it looks absolutely wonderful when it spans a really huge width and
//you need to scroll around to see it all!
//BUT with so much canvas and so many sites, processing it all gets really slow
var canvasX = 600;
var canvasY = 400;

const numSites = 6; //max 12, as there are 12 colors on the palette
var randomSites = [];
var theWorld; //global variable, can be accessed from particle.js
var theWorldSites = [];
var particles = [];
var attractors = [];
//to give weight to creating particles that are attracted to nothing:
var attractorQualities = ["nothing", "nothing", "nothing", "nothing", "nothing", "nothing", "opportunity", "love", "study", "dignity", "freedom", "peace", "exploration", "a better life"];
var you = ["You"];
var youParticle;

var palette1 = [
  [255, 0, 153, 127], // pink
  [0, 153, 153, 127], // turquoise
  [255, 255, 102, 127], // light yellow
  [153, 51, 204, 127], // purple
  [51, 204, 255, 127], // light blue
  [255, 153, 0, 127], // orange
  [0, 204, 153, 127], // light green
  [255, 0, 102, 127], // red
  [255, 204, 102, 127], // light orange
  [51, 153, 255, 127], // dark blue
  [255, 153, 153, 127], // light red
  [204, 102, 204, 127] // light purple
]

var palette = [
  [255, 223, 0, 127], // yellow
  [241, 181, 11, 127], // yellow orange
  [241, 135, 29, 127], // orange
  [241, 97, 33, 127], // orange red
  [241, 39, 39, 127], // red
  [200, 2, 134, 127], // red purple
  [109, 36, 139, 127], // purple
  [68, 54, 162, 127], // purple blue
  [18, 120, 196, 127], // blue
  [0, 168, 196, 127], // blue green
  [0, 142, 91, 127], // green
  [139, 186, 37, 127], // green yellow
]

//This is to sort particles by attractorQuality:
//var particleAttractorIndex = {love: ["particle1", "particle2", "particle3"], work: ["particle4", "particle5", "particle6"]};
var particleAttractorIndex = [];



//var mic;

function setup() {

  var myCanvas = createCanvas(canvasX, canvasY);
  noSmooth();
  //had frameRate(19); changed to frameRate(50);
  //to see how the program processes the particles
  //at a higher frame rate: does it get smoother?
  frameRate(30);

  //console.log("These are the types of attractors that exist in the world:" + attractorQualities);

  //outsourced to its own function for sake of code simplicity
  doVoronoiSetupStuff();

  var audioElement = createAudio('sound/iywstc-XX.mp3');
  //audioElement.autoplay(true);

  //console.log("Created audioElement. It is:");
  //console.log(audioElement);

  var speak;

  button = createButton("i");
  //button.size(30);
  button.size(40,40);
  button.position(30, 30);
  button.style("border-radius", "50%");
  button.mousePressed(infobuttonPressed);
  button.style("cursor", "pointer");

  button.mouseMoved( () => {
      //console.log("Went into button.mouseOver()");
      textSize(15);
      fill("black");
      var position = random()
      text("use the arrow keys to move You", 80, 45);
  });


  function infobuttonPressed(){
    //console.log("infobutton pressed!");
    audioElement.volume(0.02);
    audioElement.loop = false;
    audioElement.play();
    //button.disable;
    //var speak;



    setTimeout( () => {
      //console.log("making other button!");
      speak = createButton("speak out");
      speak.position(canvasX-100, 30);
      speak.style("cursor", "pointer");
      speak.style("border-radius", "12px");
      speak.style("background-color", "white");
      //speak.class("active");


      //speak.mousePressed(speakButtonPressed);

      //this supposedly creates a checker for whether the mouse is held down
      //continuously:
      var intervalId;
      speak.mousePressed( () => {
        intervalId = setInterval(do_something, 30);
      }).mouseReleased( () => {
        clearInterval(intervalId);
      //  console.log("Mouse was released");
        speak.style("background-color", "pink");

      });
      speak.mouseOut( () => {
        clearInterval(intervalId);
      });


    }, 6000);
    //speak.position(canvasX-200,30);

    }//close setTimeout

    //var foo = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)
    //foo.onResult = showResult; // bind callback function to trigger when speech is recognized
    //foo.start(); // start listening

    function do_something() {
    //  console.log("Mouse is pressed down continually");

      //speak.class("active");

      //colors the button red while it is being held down
      //the idea here would be to "activate" speech recognition ONLY
      //when the user is holding down the *(microphone icon)
      speak.style("background-color", "red");
      //speak.style("background-color", "red");
      //speak.style();
    }

    function speakButtonPressed(){
      //console.log("Speak out button pressed!");
        //foo.start();

    }








  /*
  *
  *              Begin implementing particleAttractorIndex
  *
  *
  */


  /*
  *    var attractorQualities = ["nothing", "work", "love", "study", "culture", "freedom", "peace", "exploration"];
  *    var particleAttractorIndex = [];
  *   //var particleAttractorIndex = {love: ["particle1", "particle2", "particle3"], work: ["particle4", "particle5", "particle6"]};
  *    var particleAttractorIndex = [love: ["particle1", "particle2", "particle3"], work: ["particle4", "particle5", "particle6"]];
  */

  //particleAttractorIndex = {love: ["particle1", "particle2", "particle3"], work: ["particle4", "particle5", "particle6"]};
  //It should be an array of objects.
  particleAttractorIndex = [{quality: "love", particles: ["particle1", "particle2", "particle3"]}, {quality: "work", particles: ["particle4", "particle5", "particle6"]}];

  //In many ways, it would be easier to work with an array, HOWEVER,
  //for my purposes of accessing the list easily by attractorQuality,
  //I absolutely need to use an object, eg:
  //particleAttractorIndex[attractorQuality];


  //createParticleAttractorIndex();

  function createParticleAttractorIndex() {
    for (let i=0; i < attractorQualities.length; i++){
      //console.log("This is the attractor quality at i: " + attractorQualities[i]);
      //let obj = {};
      //obj[]
      let keyName = attractorQualities[i];
      particleAttractorIndex.push({[keyName]:[0,1,2]});
    }
  }

  //the difference between .forEach() and .map() is that map returns an []
//console.table(particleAttractorIndex);

  //console.log("This is particleAttractorIndex: " + particleAttractorIndex);
  //console.log(particleAttractorIndex);

  //let qualityKey = "quality";
  //console.log("This is what we have at index 0, behind the quality key: " + particleAttractorIndex[0].quality);
//  console.log("This is the valueOf the object at that position in the array: " + particleAttractorIndex[0].valueOf());
//  console.log(particleAttractorIndex[0].valueOf());


  //  console.log("This is the first particle at the index for love:" + particleAttractorIndex["love"][0]);

  //here, we can use array methods, because the "love" etc. keys within
  //the object all point towards an array:
  //particleAttractorIndex["love"].push("particle90");
  //console.log("This is the newest particle at the index for love:" + particleAttractorIndex["love"][3]);

  //let myParticles = particleAttractorIndex["love"].splice(0,2);
  //console.log(myParticles);
  //console.log(particleAttractorIndex["love"]);
  //particleAttractorIndex["love"].push(myParticles);
  //particleAttractorIndex["love"].push.apply(particleAttractorIndex["love"], myParticles);
  //console.log(particleAttractorIndex["love"]);




  /*
  //WORKS:
  //create a button
  //once pressed, this button initiates voice capture:
  button = createButton('speak');
  button.position(canvasX-100, canvasY-50);
  button.mousePressed(listenToMe);

  //initialise the microphone connect
  mic = new p5.AudioIn();
  */

  /*
  *
  *     Listen To Me -button
  *
  */

  //button = createButton('listen to me');
  //button.position(canvasX-100, canvasY-50);

  //unfortunately the p5 implementation wraps around an implementation
  //of the SpeechRecognition API that creates an instance of
  //webkitSpeechRecognition. For this reason, the new p5.SpeechRec()
  //will create a new recogniser that only works in chrome.
  //In order to work in firefox (after having enabled the flags through
  //about:config), we would need to create the instance of the speech
  //recogniser as:
  //var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  //thus firefox could point the SpeechRecognition variable to
  //SpeechRecognition, while chrome could point to webkitSpeechRecognition
  //var foo = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)
  //foo.onResult = showResult; // bind callback function to trigger when speech is recognized
  //foo.start(); // start listening
  //every time that the user clicks this button,
  //they also have to allow the recogniser to listen to them...
  //OR: continous recognition, BUT, only when the user holds down the mouse
  //is when we log the recognition results.
  //foo.continuous = true;
  //button.mousePressed(listenToMe);
  //setTimeout(foo.start(), 200);
  //foo.onEnd = restart;

  /*function restart(){
    console.log("Restarting recognition");
    foo.start();
  }

  function listenToMe()
  {
    //foo.start();
  }

  function showResult()
  {
    console.log(foo.resultString); // log the result
  }
  */




} // close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()




function doVoronoiSetupStuff(){


    /*
    *
    *   Initialise world based on voronoi
    *
    */

    //create randomSites for the voronoi diagram
    createRandomSites();

    //Settings for drawing(these are the default values)
    //Set Cell Stroke Weight
    voronoiCellStrokeWeight(1);
    //Set Site Stroke Weight
    voronoiSiteStrokeWeight(0);
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
    //set the voronoiSites
    voronoiSites(randomSites);

    //Compute voronoi diagram with size 500 by 300
    //Without a prepared jitter structure (false)
    voronoi(canvasX - drawingBorderX, canvasY - drawingBorderY, false);

    //Draw diagram in coordinates 0, 0,
    //filled (true), without jitter (false)
    voronoiDraw(drawingBorderX, drawingBorderY, true, false);
    //voronoiDraw(0, 0, true, false);

    //save the voronoiDiagram as theWorld
    theWorld = voronoiGetDiagram();

    createTheWorldSites();
    //console.log("These are the worlds' sites:");
    print(theWorldSites);
    //console.log("This is one site:" + theWorldSites[0]);

    //printing the voronoi diagram generated(full detailed diagram):
  //  console.log("This is the world: " + theWorld);
    print(theWorld);
    //console.log("This is the number of cells I have:" + theWorld.cells.length);

    //Get simplified cells without jitter, for more advanced use
    var normal = voronoiGetCells();
    //console.log(normal);


}

function createTheWorldSites(){
  //consider adding information about the color of the cell..
  for(var i=0;i<theWorld.cells.length;i++){
    var site = createVector(theWorld.cells[i].site.x, theWorld.cells[i].site.y);
    theWorldSites.push(site);
  }

}






/*
//initiate microphone input:
//note! this is not the same as speech recognition...
function listenToMe() {

mic.start();
mic.connect();
//let val = random(255);
//background(val);

} // close listenToMe()
*/



//  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3
//  <3                                     <3
//  <3     This is Lilis idea!!!!!!!!      <3
//  <3                                     <3
//  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3

//and whats nice is this: you can create them by clicking with your mouse
//ie. you can attempt to guide the migratory movements by creating these
//attractors in zones where you want particles to flock to.

//BUG: sometimes it doesnt work: sometimes, when you click, it simply does
//not create a sphere... why..
function mouseClicked() {
    spawnNewAttractor(mouseX, mouseY);
    return false;
}

function draw() {




  //removes trace of former particles
  clear();

  if(frameCount >= 151){
    //youParticle.giveInformation();
  }



  /*
  //attempt to display some feedback from the microphone input:
  var myLevel = mic.getLevel().toString();
  text(myLevel, 60, 30);
  */

  //Draw diagram in coordinates 0, 0
  //Filled and without jitter
  voronoiDraw(drawingBorderX, drawingBorderY, true, false);
  //textSize(20);
  //text(frameCount, 20, 30);

  //create one attractor with the quality: repulsor!
  //for testing purposes!
  //by default: this will be the first "attractor" in the array


  if (frameCount == 10){
    let attractorX = random(0, width);
    let attractorY = random(0, height);
    let quality = "nothing"; //this used to be: "repulsor"
    let lifespan = random(500,1000);
    attractors.push(new attractor(quality, attractorX, attractorY, lifespan));
  //  console.log("Made me!");
    //attractors[0].attractorPosition.x
    //attractors[0].attractorPosition.y
  }



  //BUT its nice that, alongside being able to decide where these attractors
  //emerge, they also emerge randomly. So as much as you try to control where
  //the particles flock to, sometimes their movement will be out of your
  //control.
  if (frameCount % 300 == 0) {
    //spawnNewAttractor();
    for(let i=0; i < attractors.length; i++){
      //console.log("There is a new attractor in the attractors array, with the quality: " + attractors[i].quality);
      //console.log(attractors[0].quality);
    }
  }


  /*
  *
  *   Display all attractors.
  *
  */

  //for some reason this is only displaying attractor[0],
  //it is not going beyond index 0 to display 1, 2, even though the
  //other attractors exist in the array as valid objects.....
  //this currently only displays one attractor at a time....
  //why is this not looping through to display all the attractors in the
  //attractors array?
  //the problem was that this variable was possibly being confused
  //with the for() loop for particles??
  //Problem fixed by initialising i using var i =0.
  for (let i=0; i < attractors.length; i++) {

    //console.log("Length of attractors array is:" + attractors.length);
    //console.log("Displaying attractor number:" + i);
    //displays all attractors in the world
    //this was failing because at the last cycle of the attractors
    //life, the particle was first being removed (through display())
    //and only then did it try to attractParticles().....!!!
    if(attractors[i].existance == "defined"){
      //console.log("Framecount = " + frameCount);
      attractors[i].display();
    }


    /*if(frameCount > 404 && frameCount < 600){
    console.log("Second attractor is: ");
    attractors[1].display();
    console.log(attractors[1]);
  }
  if(frameCount > 606){
  attractors[2].display();
  console.log("Third attractor is: " + attractors[2]);
}
*/

} //close for


/*
*
*   Display all particles.
*
*/

for (let i = 0; i < particles.length; i++) {
  particles[i].move();
  strokeWeight(1);
  particles[i].display();

  /*
  if (frameCount >= 155 && frameCount <= 555){
    youParticle.giveInformation();
  }
  */

  if (frameCount >= 155){
    youParticle.giveInformation();
  }

} //close for


//new method: spawnNewParticle - for testing purposes originally
/*
if (frameCount == 20){
spawnNewParticle();
}
*/



//spawnNewParticles method
//here, we set the frequency at which particles are spawned
//at 30 frames per second, %120 frames means there is a chance
//of new particles spawning every four seconds:
if (frameCount%10 == 0) {
  spawnNewParticles();
} //close if framecount

//Spawn you-particle!
if (frameCount == 150){
  youParticle = new particle(canvasX/2, canvasY/2);
  particles.splice(0, 0, youParticle);
  youParticle.isAttractedTo = you;
  //youParticle.diameter = 40;
  youParticle.lifespan = 50000;
  //youParticle.color = "white";
  //console.log("Succesfully created you");
  //console.log("You are attracted to:" + youParticle.isAttractedTo);
  //console.log("Your lifespan is:" + youParticle.lifespan);
  youParticle.giveInformation();

}







} //close function draw

function keyPressed(){
  //console.log("keypressed!");
    if (keyCode === LEFT_ARROW) {
      youParticle.userDirectionVector.add(-1, 0);
      //console.log("keypressed!");
    } else if (keyCode === RIGHT_ARROW) {
      youParticle.userDirectionVector.add(1, 0);
    } else if (keyCode === UP_ARROW) {
      youParticle.userDirectionVector.add(0, -1);
    } else if (keyCode === DOWN_ARROW) {
      youParticle.userDirectionVector.add(0, 1);
    }

}


/*
*
*   Spawn x particles.
*
*/

function spawnNewParticles() {

  //choose how many particles to spawn this time around:
  //currently manually weighted at zero particles:
  var numberOfNewParticles = random([0,0,0,0,0,1,2]);

  //for each of the particles to be born, assigns random cell to be born into:
  for(let i = 0 ; i < numberOfNewParticles ; i++){
    //chooses one of the voronoi cells:
    var newHome = round(random(0, theWorld.cells.length-1));
    spawnNewParticle(newHome);
  }

} //close spawnNewParticles()

/*
*
*   Spawn one particle.
*
*/

function spawnNewParticle(newHome){
  var newParticle = new particle(theWorld.cells[newHome].site.x, theWorld.cells[newHome].site.y);
  particles.push(newParticle);
} //close spawnNewParticle

/*
*
*   Create random sites for voronoi diagram.
*
*/


function createRandomSites() {
  for (i = 0; i < numSites; i++) {
    var paletteIndex = round(random(0, palette.length-1));
    randomSites.push(
      [random(drawingBorderX, canvasX),
        random(drawingBorderY, canvasY),
        palette[paletteIndex]
      ]
    );
    palette.splice(paletteIndex, 1);
    print(randomSites);
  } //close for

  } //close createRandomSites

  //colorPalette


  /*
  *
  *   Spawn one attractor.
  *
  */

  function spawnNewAttractor(attractorX, attractorY) {

    if(attractorX == undefined || attractorY == undefined){
      attractorX = random(0, width);
      attractorY = random(0, height);
    }
    let quality = random(attractorQualities);
    //sets a random lifespan
    let lifespan = random(300,600);

    if (quality == "nothing"){
      //do not create an attractor
    } else {
      attractors.push(new attractor(quality, attractorX, attractorY, lifespan));
    }
  } //close spawnNewAttractor
