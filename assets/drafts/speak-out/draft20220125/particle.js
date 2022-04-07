/*
*
*   Describe internal life of a particle.
*
*/


var particleDiameter = 15;

function particle(tempX, tempY) {

  this.lifespan = random(100,2000);
  this.counter = 0;
  this.diameter = particleDiameter;
  this.infoText = "";
  this.cellID = voronoiGetSite(tempX, tempY, false); //constant: cellID of birthplace
  this.particleBirthColor = voronoiGetColor(this.cellID);
  this.currentCellID = this.cellID; //later: this is changed to the ID of the I wander into.

  this.passports = [];

  this.isAttractedTo = random(attractorQualities);
  this.myDestiny = "undefined";

  this.gravityOfHome = random(2, 3);
  this.originalGravityOfHome = this.gravityOfHome;

  this.factor = 0.4; // constant...
  this.xoff = random(0, 10000);
  this.yoff = random(0, 10000);

  this.positionVector = createVector(tempX, tempY);
  this.intentionVector = createVector(0, 0);


  /*
  *
  *   Calculate passports.
  *   TO-DO: do this in a more elegant manner,
  *   considering also possibility of multiple zones with same color.
  *
  */

  //initiate passports by first pushing the right number of empty arrays into the variable,
  //to avoid .... problems
  for(var i=0; i<numberOfPassports; i++){
    this.passports.push([]);
  }
  this.passports[0] = [this.cellID, this.cellID]; //monochrome
  for(var i=0;i<analogous.length;i++){
    if(this.cellID == analogous[i][0]){ // read passport rules for analogous until you find my cellID:
      this.passports[1] = analogous[i]; // then copy that array into my passports
    }
  }
  for(var i=0;i<complementary.length;i++){
    if(this.cellID == complementary[i][0]){ // same as above.
      this.passports[2] = complementary[i];
    }
  }
  //instead of complementary above, try:
  //divide into top and bottom zones


  for(var i=0;i<triad.length;i++){
    if(this.cellID == triad[i][0]){ // same as above.
      this.passports[3] = triad[i];
    }
  }
  for(var i=0;i<theWorldSites.length;i++){
    this.passports[4].push(i); // all cellIDs ->
  }
  for(var i=0;i<theWorldSites.length;i++){
    this.passports[5].push(i);
  }
  this.passports[5].splice(this.cellID, 1); // all cellIDs but splice my own

  if(this.cellID < theWorldSites.length/2){
    for(var i=0;i<theWorldSites.length/2;i++){
      this.passports[6].push(i);
    }
  } else {
    var counter = theWorldSites.length/2;
    for(counter;counter<theWorldSites.length;counter++){
      this.passports[6].push(counter);
    }
  }

  /*
  *
  *   Remove particle at the end of lifetime.
  *
  */

  this.remove = function(){
    var myIndex = particles.indexOf(this);
    particles.splice(myIndex,1);
  }//close this.remove

  /*
  *
  *   Display information.
  *
  */

  this.giveInformation = function (info = "") {
    textSize(particleDiameter);
    noStroke();
    smooth();
    fill("black");
    //this will always get overdriven by the one below:
    if(this.infoText == ""){
      //this.infoText = 'They (' + this.isAttractedTo + ')';
      this.infoText = this.isAttractedTo;
    }
    if(!this.infoText.includes("You")){
      this.infoText = 'someone else (' + this.isAttractedTo + ')';
    }
    if(this.infoText.includes("You")){

    }

    //textFont(myFont);
    text(this.infoText, this.positionVector.x + 1.0*particleDiameter, this.positionVector.y + 0.5*particleDiameter);

  }// close giveInformation

  /*
  *
  *   Display particle.
  *
  */

  this.display = function() {

    if(this.counter < particleDiameter){
      this.diameter = this.counter; // fade particle in like a bubble rising
    } else {
      this.diameter = particleDiameter;
    }

    var particleCursorDistance = p5.Vector.dist(this.positionVector, cursorPosition);

    //check if cursor is on top of particle:
    //for other particles
    if(particleCursorDistance < particleDiameter){
      cursor(HAND);
      this.giveInformation();
      if(!this.infoText.includes("You")){
        //this.positionVector = cursorPosition;
      }
    }

      /*
      if(this.infoText.includes("You")){
          //this.infoText = "You (" + this.isAttractedTo + ")";
        //do nothing, because its already displaying information
      }else{
        this.giveInformation();
      }

      // stop the particle when you mouse over it:

    } else {
      if(this.infoText.includes("You")){
          //this.infoText = "You";
        }
    }
    */

    // draw the particle:
    fill(this.particleBirthColor);
    strokeWeight(2);
    stroke("white");
    ellipse(this.positionVector.x, this.positionVector.y, this.diameter, this.diameter);

    //and finally, decrese its lifetime:
    this.lifespan -= 0.1;
    this.counter += 0.1;

    if(this.lifespan <= 1.5){
      this.remove();
    }
  }//close this.display


  /*
  *
  *   Move particle.
  *
  */

  this.move = function() {
    this.currentCellID = voronoiGetSite(this.positionVector.x, this.positionVector.y);
    if(this.amIAllowedToBeHere()){
      //if yes:
      //then ask: should I go towards an attractor?
      if(this.doIFeelThePullOfAnAttractor()){
        //if yes:
        //then go towards the attractor,
        //if(this.infoText != "You" && || this.infoText != "Tu"){
        //if(this.infoText != "You"){
          this.goTowardsAttractor();
        }

          // add here the condition that if I am inside an attractor that matches
          //my isAttractedTo, then do something visual and change what I am
          //attracted to
        //}

    } else {
      //if no, I am not allowed to be here
      //then, go towards the closest site that you are allowed to be at,
      this.goTowardsClosestAllowedZone(); //take sites of all allowed
    }
    this.moveRandomly(); // and always, move randomly.
  }//close this.move


  /*
  *
  *   Check whether I am allowed to be here.
  *
  */

  this.amIAllowedToBeHere = function(){
    if(this.positionVector.x <= 0 || this.positionVector.y <= 0){
      this.goTowardsClosestAllowedZone;
    }
    // check allowed zones depending on passportMode:
    for(var i=0; i<this.passports[passportMode].length; i++){
      if(this.currentCellID == this.passports[passportMode][i]){
        this.gravityOfHome = this.originalGravityOfHome;
        return true;
      }
    }

    if(this.infoText.includes("You")){
      if(this.doIFeelThePullOfAnAttractor()){

        var attractorDistance = createVector();
        attractorDistance = p5.Vector.dist(this.positionVector, this.myDestiny.attractorPosition);

        if (attractorDistance < (attractorDiameter/2)) {
          this.isAttractedTo = random(attractorQualities);
          this.myDestiny.color = "black";
          //this.myDestiny.color = this.particleBirthColor;
          this.myDestiny = "undefined";
          this.infoText = ("You (" +   this.isAttractedTo + ")");
          lifeAchievements++;
        }
    }
  }
    return false;
  }//close amIAllowedToBeHere


  /*
  *
  *   Check whether a destiny exists for me.
  *
  */


/*
  // TO-DO: my destiny is in a cell that I cannot go into -> find a new one!

  //is my destiny in a not allowed zone?
  //if it is, go towards it
  //if it is not, try to flip it!


  //if the particle enters this function, its because it has an attractor that is defined:
  //flip a coin here: if this.myDestiny is in a cell that I am not allowed in,
  //50% chance of selecting another one:
  let attractorCellID = voronoiGetSite(this.myDestiny.attractorPosition.x, this.myDestiny.attractorPosition.y);
  //check if attractorCellID corresponds to an allowed
  for(counter=0; counter <= this.passports[passportMode].length ; counter++){
    //console.log("attractorCellID is: " + attractorCellID);
    if(counter < this.passports[passportMode].length){
      if(attractorCellID == this.passports[passportMode][counter]){
        //do nothing
      }
    }  else {
      console.log("I have a destiny, I am going to try to change it now, if its not in my allowed zones");
      if(counter == this.passports[passportMode].length ){
        console.log("finished for loop: " + counter);
        let flipACoin = random(["tryAgain", "fail"]);
        if(flipACoin == "tryAgain"){
          this.myDestiny = "undefined";
        }
      }
    }
  }
*/


  // TO-DO: isThereARepulsorInMyAllowedCell?
  this.doIFeelThePullOfAnAttractor = function(){
    if(this.myDestiny !== "undefined" && this.myDestiny.existance !== "undefined"){
      return true; // I have one and it's defined, next: go towards it
    }
    else { // I don't have one, or it's already flickered out:
      var destinies = [];
      //for all the attractors in the attractors [] that are
      //defined AND of the same quality as I,
      //push them into the (possible) destinies array:
      for(var i=0; i<attractors.length; i++){
        if(attractors[i].existance !== "undefined" && attractors[i].quality == this.isAttractedTo){
          destinies.push(attractors[i]);
        }
      }
      if(destinies.length == 0){
        return false; // there is nothing that moves me in life, so just move randomly
      }
      else { // there are things that move me!
        let randomDestiny = random(destinies); //choose one of them randomly
        this.myDestiny = randomDestiny;

        return true; // I have a destiny, next up: go towards it!
      }
    }
  }//close doIFeelThePullOfAnAttractor

  /*
  *
  *   Go towards my destiny.
  *
  */

  this.goTowardsAttractor = function(){

      var towardsAttractor = createVector();
      towardsAttractor = p5.Vector.sub(this.myDestiny.attractorPosition, this.positionVector);
      towardsAttractor.normalize();

      var attractorDistance = createVector();
      attractorDistance = p5.Vector.dist(this.positionVector, this.myDestiny.attractorPosition);

      if(this.infoText.includes("You")){
        if (attractorDistance < (attractorDiameter/2)) {
          this.isAttractedTo = random(attractorQualities);
          this.myDestiny.color = "black";
          //this.myDestiny.color = this.particleBirthColor;
          this.myDestiny = "undefined";
          this.infoText = ("You (" +   this.isAttractedTo + ")");
          //lifeAchievements += ". ";
          lifeAchievements++;
          //lifeAchievements.replace()
        }
      }

      if (attractorDistance < (attractorDiameter/2)-10) { //-10 or -5 -> ie. I am inside my attractor:
        //if the particle is inside the attractor, then it also stays within the attractor:
        //if(this.infoText != "You" || this.infoText != "Tu"){ //if it's anything other than the You particle:
          if(this.infoText.includes("You")){ //if it's anything other than the You particle:
            // if the You particle has reached its destiny, change what it is attracted to:

            //this.
            //fill("white");
            //ellipse(this.myDestiny.attractorPosition.x, this.myDestiny.attractorPosition.y, 20, 20);
            //this.giveInformation();

            /*
            this.isAttractedTo = random(attractorQualities);
            this.myDestiny.color = this.particleBirthColor;
            this.infoText = ("You (" +   this.isAttractedTo + ")");
            */

            //this.giveInformation("    (" +   this.isAttractedTo + ")");
            //this.infoText = "You (" + this.isAttractedTo + ")";
            //this.giveInformation();
            //console.log("In GoTowardsAttractor: Changed you particle destiny to:" + this.isAttractedTo);
            //this.color = "white";
            //In fact: make it so that the You particle never surges towards the attractor!!!
            //this.gravityOfHome += 0.5;

        //} else if ( this.infoText == "You") { // if the You particle has reached its destiny, change what it is attracted to:
        } else {
            this.lifespan = this.myDestiny.lifespan; // will lead to this.remove(); once attractor goes out
        }
        // if I am inside my attrator already, break out of this function and -> moveRandomly()
      } else { // first go towards attractor:
        if(this.infoText.includes("You")){
          // do nothing
        }  else { //for all other particles, go towards the attractor:
          towardsAttractor.mult(this.myDestiny.gravityOfAttractor);
          this.positionVector.add(towardsAttractor);
      }// and if its the you particle, don't go towards the attractor...
      }

  }//close goTowardsAttractor

  /*
  *
  *   Go towards a zone I am allowed to be in.
  *
  */

  this.goTowardsClosestAllowedZone = function(){
    var distancesToAllowedZones = [];
    //loop through all the cellIDS and
    //make an array of distances between my current position and
    //the site of the allowed cells:
    for(var i=0; i<this.passports[passportMode].length; i++){
      var distanceToSite; // here, I will have the site of a cell
      distanceToSite = this.positionVector.dist(theWorldSites[this.passports[passportMode][i]]);
      distancesToAllowedZones.push(distanceToSite);
    }

    // find the allowed site that is closest to me:
    var indexOfSmallest = 0;
    var smallest = distancesToAllowedZones[0];
    for(var j=0; j<distancesToAllowedZones.length; j++){
      if(distancesToAllowedZones[j] < smallest){
        smallest = distancesToAllowedZones[j];
        indexOfSmallest = j;
      }
    }

    var closestAllowedCellID = this.passports[passportMode][indexOfSmallest];
    var closestAllowedCellSite = theWorldSites[closestAllowedCellID]; // this is already an array of p5.vectors..

    var towardsAllowed = createVector();
    towardsAllowed = p5.Vector.sub(closestAllowedCellSite, this.positionVector);
    towardsAllowed.normalize();

    if(this.infoText.includes('You')){
      this.gravityOfHome += 0.5;
    } else { this.gravityOfHome += 0.05; }//this was initially 0.05

    towardsAllowed.mult(this.gravityOfHome);
    this.positionVector.add(towardsAllowed);
  }//close goTowardsClosestAllowedZone


  /*
  *
  *   Move randomly.
  *
  */

  this.moveRandomly = function(){
    let randomXNoise = noise(this.xoff);
    this.xoff += 0.02;
    let randomYNoise = noise(this.yoff);
    this.yoff += 0.01;

    //generate random number based on perlin noise:
    let randomXSpeedFactor = map(randomXNoise, 0, 1, -7, 7);
    let randomYSpeedFactor = map(randomYNoise, 0, 1, -7, 7);

    //makes the particles move MUCH slower
    //effect of this is: that its easier to notice
    //once they start going very quickly towards an attractor
    randomXSpeedFactor = this.factor*randomXSpeedFactor;
    randomYSpeedFactor = this.factor*randomYSpeedFactor;

    //add random number to the position vector:
    this.positionVector.add(randomXSpeedFactor, randomYSpeedFactor);

    //if the user hasnt pressed the keys:
    if(this.intentionVector == (0,0)){
      //do nothing
    }else{

      //else, move the particle,
      //and gradually diminsh the effect of
      //the users movement:
      this.positionVector.add(this.intentionVector);
      //diminish the effect of the users input over time:
      //0.99 seems to be a good factor:
      this.intentionVector.mult(0.99);
      //limit to magnitude 6 seems to be a good value:
      //this keeps the particle from bouncing back
      //too much from the border of a wrong cell..
      this.intentionVector.limit(5);
    }
    //finally, don't let the particles go off the canvas:
    this.positionVector.x = constrain(this.positionVector.x, drawingBorderX+2, canvasX-2);
    this.positionVector.y = constrain(this.positionVector.y, drawingBorderY+2, canvasY-2);
  }//close this.move

}//close function particle()
