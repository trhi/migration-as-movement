var drawingBorderX = 0;
var drawingBorderY = 0;

var canvasX = window.innerWidth; // use width instead (system variable)
var canvasY = window.innerHeight; // use height instead (system variable)

var myCanvas;
var cursorPosition;
var rainbow = 0;

var iywstc;

var frameRate = 30;
var fpm = frameRate*60;
console.log("fpm is: " + fpm);

var lang = ""; // browser language -> sets language of recogniser and all texts
var myFont; // custom font. Atm: poppins. Change also in css/speakout-interface.css

// TO-DO: create unlimited zones using fixed 12 color palette.
//atm: cannot change number of zones because creating the passports is
//hardcoded for 12 colors == 12 zones:
const zones = 12; // currently: maximum value is 12, as there are only 12 colors on the palette
//const zones = 6; // currently: maximum value is 12, as there are only 12 colors on the palette
var randomSites = [];
var theWorld;
var theWorldSites = []; //this is an array of p5.Vectors in order of cellID
var particles = [];
var attractors = [];

// TO-DO: implement repulsors.
// var repulsors = [];
// var repulsorQualititesEN = ["a bad thing"];
// var repulsorQualititesPT = ["uma coisa má"];

var attractorQualities = [];
var worldAttractions = [];


//small list to keep it simple
var attractorQualitiesEN =
[
  "work", "food", "love", "more love", "even more love", "freedom", "a way out", "time",
  "a hug", "sleep", "some rest", "deep sleep", "a glass of water", "a timeout",
  "entertainment", "peace of mind", "warmth", "a success", "a coffee",
  "a bite to eat", "a painkiller"
];

var attractorQualitiesENtons =
[
  "work", "food", "love", "freedom", "a way out", "time",
  "a hug", "sleep", "some rest", "a glass of water", "a timeout",
  "entertainment", "mental health"
];


/*
// big list of lots of things
var attractorQualitiesEN =
[
  "a good thing", "yourself", "the impossible", "myself", "my true self",
"work", "work", "work", "work", "work", "work", "work", "work", "work", "work",
"my retirement",
"opportunity", "love", "shelter", "food",
"health",
"money", "lots of money", "some money", "a coin",
"a home", "a house", "a shelter", "a roof over my head", "a piece of land",
"a job", "a clothing store", "a park", "study",
"dignity", "freedom", "to do what I love", "to love what I do", "a place to breathe",
"a way out", "a solution",
"peace", "some peace of mind", "some time for myself", "time", "some time",
"exploration", "a mountain", "a better life",
"a flower shop", "a supermarket", "ikea", "coca cola dreams"
];
*/

var attractorQualitiesPT = [
"o impossível", "eu próprio", "ela", "ele",
"uma coisa boa", "uma surpresa",
"a minha família",
"o autocarro", "o onibus", "o meu carro",
"trabalho", "trabalho", "trabalho", "trabalho", "trabalho", "trabalho", "emprego",
"almoço", "jantar", "comida", "um café",
"algo", "?",
"a escola", "a universidade", "o creche", "o meu lar", "o escritório", "a obra",
"dinheiro", "um pouco dinheiro", "muito dinheiro",
"tempo para mim", "tempo", "mais tempo",
"uma casa", "um abrigo", "um terreno", "terra",
"um parque", "o meu sonho", "uma floresta",
"ikea", "uma loja", "um café", "uma florista",
"uma solução",
"liberdade", "um sítio seguro", "segurança", "respirar sem medo", "um começo", "um começo"];

var you = ["You"];
var youParticle;
var lifeAchievements = 0;
//var lifeAchievements = '';

var passportMode = 4;
//document.getElementById("4").focus();
var numberOfPassports = 7;

/*
* passports:
* 0 : just my cell
* 1: analogous
* 2: complementary
* 3: triad
* 4: all cells
* 5: all cells except mine
* ->6: [initial state] I access only my half of the screen
*/

function changePassportMode(){
  passportMode = round(random(0, numberOfPassports-2));
  document.getElementById(passportMode).focus();
  console.log("Changed passportMode to:" + passportMode);
}

// TO-DO: 7th passport mode: "/"

// TO-DO: make it easier to continue adding passport modes
// (ie. make it so that Particle doesn't need to be aware of how many passport modes there are)
// ie. set it here, with numberOfPassports.

var worldColors = []; // index of the RGBA of all cells in order of cellID
var worldGIndex = []; // index of the G value of all cells in order of cellID

var palette = [
  [255, 223, 0, 117], // yellow
  [241, 181, 11, 117], // yellow orange
  [241, 135, 29, 117], // orange
  [241, 97, 33, 117], // orange red
  [241, 39, 39, 117], // red
  [200, 2, 134, 117], // red purple
  [109, 36, 139, 117], // purple
  [68, 54, 162, 117], // purple blue
  [18, 120, 196, 117], // blue
  [0, 168, 196, 117], // blue green
  [0, 142, 91, 117], // green
  [139, 186, 37, 117], // green yellow
]

// analogous, complementary and triad represent hard-coded rules about what colors can go where

var complementary = [
  [223, 36, 181, 54],
  [181, 54, 223, 36],
  [135, 120, 97, 168],
  [97, 168, 135, 120],
  [39, 142, 2, 186],
  [2, 186, 39, 142],
  [36, 223, 181, 54],
  [54, 181, 36, 223],
  [120, 135, 168, 97],
  [168, 97, 120, 135],
  [142, 39, 186, 2],
  [186, 2, 186, 2]
];

var analogous = [
  [223, 97, 135, 181, 39, 2],
  [181, 223, 135, 97, 39, 2],
  [135, 223, 97, 181, 39, 2],
  [97, 223, 135, 181, 39, 2],
  [39, 223, 135, 181, 97, 2],
  [2, 223, 135, 181, 39, 97],
  [36, 54, 120, 168, 142, 186],
  [54, 36, 120, 168, 142, 186],
  [120, 54, 36, 168, 142, 186],
  [168, 54, 120, 36, 142, 186],
  [142, 54, 120, 168, 36, 186],
  [186, 54, 120, 168, 142, 36]
];

var oldAnalogous = [ // €
  [223, 181, 135, 97],
  [181, 223, 135, 97],
  [135, 223, 181, 97],
  [97, 223, 181, 135],
  [39, 97, 2, 36],
  [2, 39, 36, 54],
  [36, 2, 54, 120],
  [54, 36, 120],
  [120, 54, 168, 142],
  [168, 120, 142, 186],
  [142, 168, 186, 223],
  [186, 142, 223]
];



var oldComplementary = [
  [223, 36],
  [181, 54],
  [135, 120],
  [97, 168],
  [39, 142],
  [2, 186],
  [36, 223],
  [54, 181],
  [120, 135],
  [168, 97],
  [142, 39],
  [186, 2]
];

var triad = [
  [223, 39, 120],
  [181, 2, 168],
  [135, 36, 142],
  [97, 54, 186],
  [39, 120, 223],
  [2, 168, 181],
  [36, 142, 135],
  [54, 186, 97],
  [120, 223, 39],
  [168, 181, 2],
  [142, 135, 36],
  [186, 97, 54]
];

//create a deep copy of the passport rules (color mappings)
//so that passports can be built
var analogousColors = JSON.parse(JSON.stringify(analogous));
var complementaryColors = JSON.parse(JSON.stringify(complementary));
var triadColors = JSON.parse(JSON.stringify(triad));

// TO-DO: poetry.
// each passport mode has 6 lines of poetry, that can be recombined
var passportSentences = [];
var passportSentencesPT = [
  ['"quero ficar aqui"',
  '"ou: só posso ficar aqui?"',
  '"nunca irei partir"',
  '"porque não preciso ir"',
  '"não quero ficar aqui"',
  '"mas nunca poderei sair"'], //@: monochromatic
  ['"somos parecidos"',
  '"não tenho medo"',
  '"integramos algo maior"',
  '"os outros são diferentes"',
  '"quem são os outros?"',
  '"felizmente não podem entrar"'], //€: analogous
  ['"qual a diferença entre o descobrimento e a colonização?"',
  '"só um de nós é que tem o poder"',
  '"qual a diferença entre a colonização e o descobrimento?"',
  '"é fácil conquistar quem está mais fraco"',
  '"esta terra era a nossa"',
  '"esta terra continua a nossa"'], //>: complementary
  ['"vivo numa fortaleza"',
  '"vejo uma porta"',
  '"mas a não abro"',
  '"preciso ar"',
  '"tento respirar cá fora"',
  '"nasci aqui"'], //§: triad
  ['"posso ir onde quero"',
  '"vou ir"',
  '"poderei querer ir"',
  '"posso ir onde quer que fosse"',
  '"agora vou"',
  '"não tenho terra"'], //⊙: open borders
  ['"tenho muito medo de voltar"',
  '"nunca mais posso voltar"',
  '"ninguém me espera"',
  '"a minha terra já não é minha"',
  '"tenho saudades da minha terra"',
  '"nunca mais posso voltar à minha terra"']  //!: exile
];

var passportSentencesEN = [
  ['"I want to stay here"',
  '"or maybe that is my only choice?"',
  '"I will never leave"',
  '"because I do not need to go"',
  '"I do not want to stay here"',
  '"but I can never leave"'], //@: monochromatic
  ['"we are very similar"',
  '"I am not scared"',
  '"we are part of something greater"',
  '"the others are different"',
  '"who are the others?"',
  '"they cannot enter"'], //€: analogous
  ['"what is the difference between exploration and colonization?"',
  '"only one of us is in a position of power"',
  '"what is the difference between colonization and exploration?"',
  '"it is easy to conquer the weak"',
  '"this was our land"',
  '"this land continues to be ours"'], //>: complementary
  ['"I live in a fortress"',
  '"I see a door"',
  '"I do not open the door"',
  '"I need air"',
  '"I try to breathe out here"',
  '"I was born here"'], //§: triad
  ['"I can go where I want"',
  '"I will go"',
  '"I may want to go"',
  '"I can go whereever I want"',
  '"I will go now"',
  '"I have no land"'], //⊙: open borders
  ['"I am scared of returning"',
  '"I can never return"',
  '"nobody is waiting for me"',
  '"I am no longer wanted"',
  '"I miss what is or was mine"',
  '"I am no longer needed"']  //!: exile
];

var fontDone;

function preload(){
  myFont = loadFont("css/fonts/PoppinsLatin-Medium.otf", fontLoaded);
  iywstc = createAudio('sound/iywstc.mp3');
}

function fontLoaded(){
    fontDone = true;
}

function setup() {

  //iywstc.loop = false;
  //getAudioContext().suspend();
  //iywstc.play();

  //document.getElementById("4").focus();

  textFont(myFont);
  lang="en";
  attractorQualities = [...attractorQualitiesEN];
  worldAttractions = [...attractorQualities];
  passportSentences = [...passportSentencesEN];

/*//for raum:
  if (window.parent.location.href.indexOf("/en/") > -1) {
    //for raum.pt:
    //if the string "/en/ is included in the href of the parent window"
    //ie if the url above the iframe is ...raum.pt/en/terhi-marttila, then:
    //(raum always refreshes when the user selects a new language)
    lang = "en";
    attractorQualities = [...attractorQualitiesEN];
    passportSentences = [...passportSentencesEN];
  } else { // for raum:
    lang = "pt";
    attractorQualities = [...attractorQualitiesPT];
    passportSentences = [...passportSentencesPT];
  }
  */

  myCanvas = createCanvas(canvasX, canvasY);
  frameRate(30);

  doVoronoiSetupStuff();
  doInterface();
  document.getElementById(passportMode).focus();
  doPassports();

  if(fontDone){
      textFont(myFont);
  }


} // close setup()


function doVoronoiSetupStuff(){


  /*
  *
  *   Initialise world based on voronoi
  *
  */

  //Settings for drawing the voronoi diagram:
  voronoiCellStrokeWeight(1); // thin borders
  voronoiSiteStrokeWeight(0); // make site hardly visible

  createRandomSites(); // create randomSites for the voronoi diagram
  voronoiSites(randomSites); // create the voronoi

  //Compute voronoi according to size of canvas
  //Without jitter (false)
  voronoi(canvasX - drawingBorderX, canvasY - drawingBorderY, false);

  //Draw diagram at coordinates 0, 0 (drawingBorderX, drawingBorderY)
  //filled (true) and without jitter (false)
  voronoiDraw(drawingBorderX, drawingBorderY, true, false);

  //save the voronoiDiagram as "theWorld"
  theWorld = voronoiGetDiagram();


  /*
  *
  *   worldSites, an array of p5.Vectors of all sites, by CellID.
  *
  */

  for(var i=0;i<theWorld.cells.length;i++){
    var site = createVector(theWorld.cells[i].site.x, theWorld.cells[i].site.y);
    theWorldSites.push(site);
  }

}//close doVoronoiSetupStuff()


/*
*
*   Calculate passports.
*   TO-DO: do this in a more elegant manner,
*   considering also possibility of multiple zones with same color.
*   as well as the possibility of less zones with same color!
*   ie. first map: 1) cellID to RGBA
*
*/

function doPassports() {

  /*
  *
  *   worldColors, an array of RGBA values ordered by CellID.
  *
  */


  for(var i=0;i<palette.length;i++){ //this works
  //or just go through theWorld.cells.length //<-- but passports are harcoded for zones = 12 = palette.length
  //for(var i=0;i<theWorld.cells.length;i++){
  //for(var i=0;i<zones;i++){
    worldColors[i] = voronoiGetColor(i);
  }

  /*
  *
  *   worldGIndex, an array of G values ordered by CellID.
  *   (also serves as the monochrome passport)
  *
  */

  for(var i=0;i<palette.length;i++){
    for(var i=0;i<zones;i++){

    worldGIndex[i] = worldColors[i][1];
  }
}

    /*
    *
    *   three passports, manually.
    *
    */

  for(var i=0; i<analogousColors.length; i++){
    for(var k=0; k<analogousColors[i].length;k++){
      for(var j=0; j<worldGIndex.length; j++){
        if(analogousColors[i][k] == worldGIndex[j]){
          analogous[i][k] = j; // map g to cellID
        }
      }
    }
  }

  for(var i=0; i<complementaryColors.length; i++){
    for(var k=0; k<complementaryColors[i].length;k++){
      for(var j=0; j<worldGIndex.length; j++){
        if(complementaryColors[i][k] == worldGIndex[j]){
          complementary[i][k] = j; // map g to cellID
        }
      }
    }
  }

  for(var i=0; i<triadColors.length; i++){
    for(var k=0; k<triadColors[i].length;k++){
      for(var j=0; j<worldGIndex.length; j++){
        if(triadColors[i][k] == worldGIndex[j]){
          triad[i][k] = j; // map g to cellID
        }
      }
    }
  }

} //close doPassports


/*
*
*   Create attractors by clicking.
*
*/

function mousePressed(){
  //zone of passports OR zone of other buttons:
  if((mouseX > window.innerWidth-90 && mouseY < 320) || (mouseX > window.innerWidth-270 && mouseY > window.innerHeight-80)){
    //don't do anything if the user clicks in the zone of the buttons.
  } else {
    //when all movement is allowed, also allow making opportunities anywhere:
    //if(passportMode == 4){
    //when movement is restricted, allow making opportunities:
    //if(passportMode != 4){
      //before spawning new attractor: check if any attractorqualities are left:
      //if yes, spawn new attractor using one of them:
      if(frameCount > 200){ // so that the user cannot be clicking all the time to make attractors:
        if(worldAttractions.length > 0 ){
          //spawnNewAttractor(mouseX, mouseY);
        }
      }
      //then remove it from the array
      //else: do nothing
    //}
  }
  return false;
}

function draw() {

  //was doing this for each particle individually, although
  //you could be doing this universally at draw()
  cursorPosition = createVector(mouseX, mouseY);

  //a factor of 0.9 seems to be good:
  if(youParticle){
    if (keyIsDown(LEFT_ARROW)){
      youParticle.intentionVector.add(-1.3, 0);
    }
    if (keyIsDown(RIGHT_ARROW)){
      youParticle.intentionVector.add(1.3, 0);
    }
    if (keyIsDown(UP_ARROW)){
      youParticle.intentionVector.add(0, -1.3);
    }
    if (keyIsDown(DOWN_ARROW)){
      youParticle.intentionVector.add(0, 1.3);
    }
  }


  clear(); //remove trace of former particles
  cursor(ARROW);

  //Draw diagram in coordinates 0, 0
  //Filled and without jitter
  voronoiDraw(drawingBorderX, drawingBorderY, true, false);


  //textSize(18);

  //strokeWeight(1);
  //stroke("white");

  if(frameCount%5 == 0){
    rainbow++;
    if(rainbow == palette.length-1){
      rainbow = 0;
    }
  }

  fill(palette[rainbow]);

  $('#score').css("color", 'rgba( ' + palette[rainbow][0] + ',' + palette[rainbow][1] + ',' + palette[rainbow][2] + ',' +palette[rainbow][3]  + ')' );
  $('#score').text('Score: ' + lifeAchievements);


  //text('score: ' + lifeAchievements, 45, 80);
  //fill('black');
  //noStroke();


  /*
  *
  *   Display all attractors.
  *
  */

  for (let i=0; i < attractors.length; i++) {
    if(attractors[i].existance == "defined"){
      attractors[i].move();
      attractors[i].display();
    }
  } //close for()


  /*
  *
  *   Display all particles.
  *
  */

  for (let i = 0; i < particles.length; i++) {
    //when youParticle.giveInformation is first,
    //colors are changed always for Score!?

    particles[i].move();
    particles[i].display();
    if (youParticle){ //once its defined==truthy, resolves as true in boolean
      youParticle.giveInformation();
    }


  } //close for()

    /*
    *
    *   Change destiny of You particle every 500 or 700 frames
    *
    */


  if(frameCount % 500 == 0){
    //youParticle.isAttractedTo = random(attractorQualities);
    //console.log("Changed youParticles destiny to: " + youParticle.isAttractedTo);
  }


  /*
  *
  *   Limit number of particles in the world.
  *
  */

  if (frameCount%20 == 0) {
    if(particles.length < 100){
      spawnNewParticles();
    } else {
      //console.log(" * -- max number of particles reached --*")
    }
  } //close if(framecount)


  /*
  *
  *   Randomly change passportMode first after 2 minutes and then every 2-4 minutes.
  *
  */

  if (frameCount == fpm) { //once one minute has passed
    changePassportMode();
  } else if ( ( frameCount%( fpm*round(random(1,2)) ) ) == 0 ){
    changePassportMode();
  }//close if(framecount)




  /*
  *
  *   Spawn new attractor.
  *
  */

  if (frameCount >= 600 && frameCount%50 == 0) {
    //find Y coordinate of cell in the middle,
    //create all random attractors only above this middle

    /*
    var middleGround = theWorldSites[theWorldSites.length/2].y; //Y coordinate of middle ground
    var randomX = random(0, canvasX);
    var randomY = random(0, middleGround);
    */

    /*
    var privilegedArea = 4;
    var randomX = random(0, canvasX-70);
    var randomY = random(30, canvasY/privilegedArea);
    */

    var randomX;
    var randomY;

    randomX = random(50, width-100);
    randomY = random(50, height-100);

/*
//make attractors appear in different zones depending on passportmode:
    if(passportMode != 4){ //if its not access all areas, create opportunities in all areas:
      //if(passportMode == 4){ //if its access all areas, create opportunities in all areas:
      randomX = random(33, width-133);
      randomY = random(33, canvasY-33);
    }else { // if it [is NOT/is] restricted, only create opportunities in the center of the screen:
      randomX = random(0.33*width, 0.66*width);
      randomY = random(0.33*height, 0.66*height);
    }
    */

    if(worldAttractions.length > 0){
      if(passportMode == 1){
        spawnNewAttractor(random(20, 100), random(30, 100));
        /*
        var privilege = true;
        while(privilege){
          randomX = random(50, width-100);
          randomY = random(50, height-100);
          //check whether cellID at (randomX, randomY) is equal to
          //the cells allowed for You -particle.
          // if(randomPoint is in area allowed for You particle)
          //choose new random Point
          //once randomPoint is outside of the area allowed for YouParticle,
          */

      }else{
        spawnNewAttractor(randomX, randomY);
      }
    }
  } //close if(framecount)


  /*
  *
  *   Spawn the youParticle.
  *
  */

  if (frameCount == 20){
    youParticle = new particle(canvasX/2, canvasY/2);
    particles.splice(0, 0, youParticle);
    if(lang == "pt"){
      youParticle.infoText = "Tu";
      youParticle.isAttractedTo = "o impossível";
    } else { //otherwise show in english

      //youParticle.isAttractedTo = "the impossible";
      youParticle.isAttractedTo = random(attractorQualities);
      youParticle.infoText = 'You (' + youParticle.isAttractedTo + ')';
      console.log("Initialised: You particle is attracted to: " + youParticle.isAttractedTo);
    }
    youParticle.lifespan = 100000; // may You have a long life
  }//close if(framecount)

} //close function draw()


/*
*
*   Spawn x particles.
*
*/

function spawnNewParticles() {
  //var numberOfNewParticles = random([0,0,0,0,0,1,2]); // randomly choose how many are born, weighted at 0:
  //fill the screen immediately with lots of particles:
  //if(frameCount < 2000){
    var numberOfNewParticles = random([0,5,10,0,5,20,2]); // randomly choose how many are born, weighted at 0:
  //} else {
  //  var numberOfNewParticles = random([0,0,0,0,0,1,2]);
  //}

  for(let i = 0 ; i < numberOfNewParticles ; i++){
    //randomly choose the cell they are born into:
    var newHome = round(random(0, theWorldSites.length-1));
    var newParticle = new particle(theWorldSites[newHome].x, theWorldSites[newHome].y);

    // OR: birth particles selectively from different cells.
    // eg. lots from small ones, few from large ones.

    particles.push(newParticle);
  }
} //close spawnNewParticles()


/*
*
*   Create random sites for voronoi diagram.
*
*/

function createRandomSites() {
  for (var i = 0; i < zones; i++) {
    //let's put them in order by Y already at this point,
    //so that we have more control over what cells have what colors:

    //create an array of random x values:
    //then,

    randomSites.push(
      [random(drawingBorderX, canvasX),
        random(drawingBorderY, canvasY),
        palette[i]
      ]
    );
    /*
    // TO-DO: make it so that any number of cells can be created
    // using the palette colors
    // PROBLEM: passports / goTowardsClosestAllowedZone
    // are assuming that there is only one zone of each color
    // randomSites.push(
    //      [random(drawingBorderX, canvasX),
    //        random(drawingBorderY, canvasY),
    //        random(palette)
    //      ]
    // );
    */
  } //close for
} //close createRandomSites


/*
*
*   Spawn one attractor.
*
*/

function spawnNewAttractor(attractorX, attractorY) {
  if(attractorX == undefined || attractorY == undefined){
    attractorX = random(0, canvasX);
    attractorY = random(0, canvasY);
  }
  //let quality = random(attractorQualities);
  //we've already done the check for if its possible to make an attractor,
  //so now just make it:
  //choose a random quality from the worldAttractions
  let qualityIndex = round(random(0, worldAttractions.length-1));
  //now weve chosen the index of the attractor from the attractions array: qualityIndex
  //now, set quality to
  let quality = worldAttractions[qualityIndex];
  //then remember to remove it from the worldAttractions
  worldAttractions.splice(qualityIndex, 1); //remove 1 element starting from qualityIndex
  let lifespan = random(40,60);
  attractors.push(new attractor(quality, attractorX, attractorY, lifespan));
} //close spawnNewAttractor
