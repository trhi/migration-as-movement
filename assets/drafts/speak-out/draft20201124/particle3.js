var particleDiameter = 15;

function particle(tempX, tempY) {

        this.lifespan = random(100,2000);
        this.counter = 0;

        this.diameter = particleDiameter;
        this.infoText = "";
        this.selected = false;

        this.cellID = voronoiGetSite(tempX, tempY, false);
        this.particleBirthColor = voronoiGetColor(this.cellID);
        this.g = this.particleBirthColor[1];
        //this.color = this.particleBirthColor;
        this.currentCellID = this.cellID; //later: this is changed to the ID of the cell I am in.
        this.currentG = this.g;
        this.passports = [];

        this.isAttractedTo = random(attractorQualities);
        this.gravityOfAttractor = random(4, 10);
        this.myDestiny = "undefined";

        this.gravityOfHome = random(2, 3);
        this.originalGravityOfHome = this.gravityOfHome;

        this.factor = 0.4;
        this.xoff = random(0, 10000);
        this.yoff = random(0, 10000);

        this.birthSpot = createVector(tempX, tempY);
        this.home = createVector(tempX, tempY);
        this.positionVector = createVector(tempX, tempY);
        this.userDirectionVector = createVector(0, 0);
        this.towardsAttractor = createVector();
        this.towardsAllowedCell = createVector(); //!!! used to be called this.towardsHome

        //in fact, it would be a good idea to link the cellID at this point also,
        //since they do not change
        //eg. a second array
        //put the same element twice here.........
        //hopefully this will not cause problems in the future!
        this.passports[0] = [this.cellID, this.cellID];
        //this.passports[0][0] = this.cellID;
        for(var i=0;i<analogous.length;i++){
                if(this.cellID == analogous[i][0]){
                    this.passports[1] = analogous[i];
                    //console.log("Putting analogous in passport.");
                }
        }
        //need to convert to an array of cellIDs for these as well:
        for(var i=0;i<complementary.length;i++){
                if(this.cellID == complementary[i][0]){
                    this.passports[2] = complementary[i];
                    //console.log("Putting complementary in passport.");

                }
        }
        for(var i=0;i<triad.length;i++){
                if(this.cellID == triad[i][0]){
                    this.passports[3] = triad[i];
                    //console.log("Putting triad in passport.");
                }
        }
        this.passports.push([]);
        for(var i=0;i<theWorldSites.length;i++){
                    //build an array with all the cellIDs:

                    this.passports[4].push(i);
        }
        //console.log("This is the access all areas passport:" + this.passports[4]);
        this.passports.push([]);
        for(var i=0;i<theWorldSites.length;i++){
                //build the same array as before BUT
                //splice one element == this.cellID
                //build an array with all the cellIDs except my own!
                this.passports[5].push(i);
        }
        this.passports[5].splice(this.cellID, 1);

        //console.log("This is my passport collection:");
        //console.log(this.passports);

        this.remove = function(){
              var myIndex = particles.indexOf(this);
              particles.splice(myIndex,1);
        }//close this.remove

        this.giveInformation = function () {
              textSize(particleDiameter);
              noStroke();
              smooth();
              fill("black");
              if(this.infoText == ""){
                    this.infoText = this.isAttractedTo;
              }
              text(this.infoText, this.positionVector.x + 1.0*particleDiameter, this.positionVector.y + 0.5*particleDiameter);
        }

        this.display = function() {
              //if particle has been selected, thick white stroke:
              //remove this functionality:
              if(this.selected){
                    strokeWeight(3);
              } else {
                    strokeWeight(1);
              }

              if(this.counter < particleDiameter){
                    this.diameter = this.counter;
              } else {
                    this.diameter = particleDiameter;
              }

              var cursorPosition = createVector(mouseX, mouseY);
              var particleCursorDistance = p5.Vector.dist(this.positionVector, cursorPosition);
              if(particleCursorDistance < particleDiameter){
                    cursor(HAND);
                    if(this.infoText == "You"){
                      //do nothing, because its already displaying information
                          }else{
                              this.giveInformation();
                          }
                          //this.giveInformation();
                    // EITHER) stop the particle when you mouse over it:
                    this.positionVector = cursorPosition;
                    // OR) select it == easier to follow it on the screen
                    /*if(this.selected == true){
                      this.selected = false;
                    } else {
                      this.selected = true;
                    }*/
              } else {
                //cursor arrow
              }

              //actually draw the particle:
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

        this.move = function() {
              this.currentCellID = voronoiGetSite(this.positionVector.x, this.positionVector.y);
              if(this.amIAllowedToBeHere()){
                    //if yes:
                    //then ask: should I go towards an attractor?
                    if(this.doIFeelThePullOfAnAttractor()){
                          //if yes:
                          //then go towards the attractor,
                          this.goTowardsAttractor();
                          //and then, move randomly
                          //this.moveRandomly();
                    }else{
                          //if no:
                          //then, just move randomly
                          //this.moveRandomly();
                    }
              } else {
                    //if no, I am not allowed to be here
                    //then, go towards the closest site that you are allowed to be at,
                    this.goTowardsClosestAllowedZone(); //take sites of all allowed
                    //then, move randomly
                    //this.moveRandomly();

              }
              this.moveRandomly();
        }//close this.move

        this.amIAllowedToBeHere = function(){
              if(this.positionVector.x <= 0 || this.positionVector.y <= 0){
                  this.goTowardsClosestAllowedZone;
              }
              //universal code to check if I am allowed to be here:
            //} for(var i=0; i<this.passports[passportMode];i++){
            //            if(this.currentCellID == this.passports[passportMode][i]){
                              //    console.log("I am allowed to be here");
                                  //return true;
        //  }
          //}
              else if (passportMode == 0){//monochromatic
                  if(this.currentCellID == this.passports[0][0]){
                          //console.log("I am in my home cell");
                          this.gravityOfHome = this.originalGravityOfHome;
                          return true;
                  }
              } else if (passportMode == 1){//analogous
                //console.log("Passport mode is analogous");
                  for(var i=0;i<this.passports[1].length;i++){
                          if(this.currentCellID == this.passports[1][i]){
                              //console.log(this.currentCellID + " I am not in my home cell, BUT I am in an analogous colored cell");
                              this.gravityOfHome = this.originalGravityOfHome;
                              return true;
                          }
                  }
              } else if (passportMode == 2){//analogous
                //console.log("Passport mode is complementary");
                  for(var i=0;i<this.passports[2].length;i++){
                          if(this.currentCellID == this.passports[2][i]){
                              //console.log("I am not in my home cell, BUT I am in a complementary colored cell");
                              this.gravityOfHome = this.originalGravityOfHome;
                              return true;
                          }
                  }
              } else if (passportMode == 3){//analogous
                //console.log("Passport mode is triad");
                  for(var i=0;i<this.passports[3].length;i++){
                          if(this.currentCellID == this.passports[3][i]){
                              //console.log("I am not in my home cell, BUT I am in one of my triad color cells");
                              this.gravityOfHome = this.originalGravityOfHome;
                              return true;
                          }
                  }
              } else if (passportMode == 4) {//all
                //console.log("Passport mode is all!");
                    for(var i=0;i<this.passports[4].length;i++){
                            if(this.currentCellID == this.passports[4][i]){
                                //console.log("I am not in my home cell, BUT I am in one of my triad color cells");
                                this.gravityOfHome = this.originalGravityOfHome;
                                return true;
                            }
                    }
              } else if (passportMode == 5) {//all but my own
                //console.log("Passport mode is all but my own!");
                      for(var i=0;i<this.passports[5].length;i++){
                              if(this.currentCellID == this.passports[5][i]){
                                  //console.log("I am not in my home cell, BUT I am in one of my triad color cells");
                                  this.gravityOfHome = this.originalGravityOfHome;
                                  return true;
                              }
                      }
              } else {
                    return false;
              }
        }//close amIAllowedToBeHere

        //inside this function: is there a repulsor in one of my allowed cells?
        this.doIFeelThePullOfAnAttractor = function(){
              //is there an attractor out there for me?
              //OR: am I already attracted to an attractor which is (still) defined?

              //If I have been assigned an attractor (this.myDestiny != "undefined"),
              //AND this attractor is still defined:
              if(this.myDestiny !== "undefined" && this.myDestiny.existance !== "undefined"){
                    //console.log("XXXXXXXXXX I (still) have a destiny! It is this one: " + this.myDestiny.quality);
                    return true; //and go towards this one
              }//My attractor still exists
              else { //I need to see if there is an attractor out there for me:
                    var destinies = [];
                    //console.log("Going to find my possible destinies..");
                    //for all the attractors in the attractors [] that are
                    //defined AND of the same quality as I,
                    //push them into the (possible) destinies array:
                    for(var i=0; i<attractors.length; i++){
                              if(attractors[i].existance !== "undefined" && attractors[i].quality == this.isAttractedTo){
                                //can push the actual object itself,
                                //because pushing an object creates a
                                //shallow copy ie. a reference!
                                //therefore, if the object itself is changed
                                //this.myDestiny will be aware of this
                                destinies.push(attractors[i]);
                              }
                    }//close for
                    //returns a random index from the list of all possible indexes
                    //for attractors[] which contain attractors of the quality that the
                    //particle is attracted to:
                    //randomDestiny is now equal to an attractor! the one to which I am attracted to
                    if(destinies.length == 0){ //there were no existing destinies for me :-()
                          //if there is no attractor in the world for me:
                          //slow my movement down!!!!
                          //this.factor -= 0.005;
                          return false;
                    }//I did not find an attractor..
                     else { //there were potential destinies for me!!!
                          //this.factor = 1;
                          let randomDestiny = random(destinies); //chooose one of them randomly
                          //saves the attractor that currently exists in this.myDestiny
                          this.myDestiny = randomDestiny; //this.myDestiny is no longer undefined
                          //console.log("XXXXXXXXXX This is my random destiny: " + randomDestiny.quality);
                          return true; //>> I have a destiny, next up: go towards it!
                    }//I found an attractor!
              }//either I found an attractor, or I did not.
        }//close doIFeelThePullOfAnAttractor

        this.goTowardsAttractor = function(){
              //remember: attractors[i].existsIn returns the cellID that the
              //attractor is in.
              var towardsAttractor = createVector();
              towardsAttractor = p5.Vector.sub(this.myDestiny.attractorPosition, this.positionVector);
              towardsAttractor.normalize();

              var attractorDistance = createVector();
              attractorDistance = p5.Vector.dist(this.positionVector, this.myDestiny.attractorPosition);
              if (attractorDistance < (attractorDiameter/2)-10) { //-10 or -5
                    if(this.infoText != "You" && this.infoText != "Tu"){
                          this.lifespan = this.myDestiny.lifespan;//will lead to this.remove(); once attractor goes out
                    }
                    //break out of this function and -> moveRandomly()
              } else { //first go towards attractor:
                    towardsAttractor.mult(this.myDestiny.gravityOfAttractor);
                    this.positionVector.add(towardsAttractor);
              }
              //this.myDestiny.gravityOfAttractor += 0.05;//let's see whether you can poke at its values like this!


              /*
              for(var i=0; i<this.passports[passportMode];i++){
                  if(this.myDestiny.existsIn  )
                  */
        }//close goTowardsAttractor

        this.goTowardsClosestAllowedZone = function(){
          var distancesToAllowedZones = [];
          //loop through all the cellIDS and
          //make an array of distances between my current position and
          //the site of the allowed cells:
          for(var i=0; i<this.passports[passportMode].length; i++){
                //here, I will have the site of a cell
                var distanceToSite;
                //THIS FAILS!!! Because there is nothing at passports[0][0],
                //because the first slot in this array only has one item...
                distanceToSite = this.positionVector.dist(theWorldSites[this.passports[passportMode][i]]);
                distancesToAllowedZones.push(distanceToSite);
          }
          //console.log("These are the distances to my allowed zones");
          //console.log(distancesToAllowedZones);

          var indexOfSmallest = 0;
          var smallest = distancesToAllowedZones[0];
          for(var j=0; j<distancesToAllowedZones.length; j++){
                if(distancesToAllowedZones[j] < smallest){
                    smallest = distancesToAllowedZones[j];
                    indexOfSmallest = j;
                }
          }

          //console.log("index of smallest is:" + indexOfSmallest);
          var closestAllowedCellID = this.passports[passportMode][indexOfSmallest];
          //var closestAllowedCellSite = voronoiGetSite(closestAllowedCellID);
          var closestAllowedCellSite = theWorldSites[closestAllowedCellID]; //this is already an array of p5.vectors..
          //console.log("The CellID of the closest allowed cell is: " + closestAllowedCellID);
          //console.log("The site of the closest allowed cell is: " + closestAllowedCellSite);

          var towardsAllowed = createVector();
          towardsAllowed = p5.Vector.sub(closestAllowedCellSite, this.positionVector);
          //console.log("This is the vector towards the allowed cell: " + towardsAllowed);
          towardsAllowed.normalize();
          this.gravityOfHome += 0.05;
          towardsAllowed.mult(this.gravityOfHome);
          this.positionVector.add(towardsAllowed);
          //this.factor += 0.5;

          //this.moveRandomly();
        }//close goTowardsClosestAllowedZone

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

              //this.factor = 0.2;

              //randomXSpeedFactor = this.factor*randomXSpeedFactor;
              //randomYSpeedFactor = this.factor*randomYSpeedFactor;

              //unnecessary:
              //this.lastMovementVector.x = (randomXSpeedFactor);
              //this.lastMovementVector.y = (randomYSpeedFactor);

              //add random number to the position vector:

              this.positionVector.add(randomXSpeedFactor, randomYSpeedFactor);

              //if the user hasnt pressed the keys:
              if(this.userDirectionVector == (0,0)){
                    //do nothing
              }else{
                    //else, move the particle, diminsh the effect of
                    //the users movement:
                    this.positionVector.add(this.userDirectionVector);
                    //diminish the effect of the users input over time:
                    //0.99 seems to be a good factor:
                    this.userDirectionVector.mult(0.99);
                    //limit to magnitude 6 seems to be a good value:
                    //this keeps the particle from bouncing back
                    //too much from the border of a wrong cell..
                    this.userDirectionVector.limit(6);
              }
              //finally, don't let the particles go off the canvas:
              this.positionVector.x = constrain(this.positionVector.x, drawingBorderX+2, canvasX-2)
              this.positionVector.y = constrain(this.positionVector.y, drawingBorderY+2, canvasY-2)
        }//close this.move



}//close function particle()
