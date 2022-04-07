/*
*
*     TODO:      this.goTowardsAttractor
*
*/


var particleDiameter = 10;
var cellID;


/*
*
*   Describe internal life of a particle
*
*/

function particle(tempX, tempY) {

      /*
      *
      *   Initialise all random variables related to particle.
      *
      */


      this.lifespan = random(100,2000);
      this.counter = 0;
      //console.log("this.counter is:" + this.counter);

      //particleDiameter = 10;
      this.diameter = particleDiameter;

      //choose random attractorQuality to be attracted towards:
      //here, particle.js can access attractorQualities, because it was
      //declared in particles-moving.js as var, making it global in scope
      //and accessible by other .js files:
      this.isAttractedTo = random(attractorQualities);
      //console.log("This particle is attracted to: " + this.isAttractedTo);

      //Essentially, particles are created first, and then, much later,
      //attractors are created. SO: as soon as a particle is created, it needs
      //to be indexed according to attractor quality: eg into an array called
      //attractorParticleIndex[].                    Then, when an attractor
      //emerges, it can go and pop a sub array of that bigger index array and
      //begin to draw all the particles in that sub array towards itself.

      //But what about when particles puff out of existence? We would remove
      //them from particles[], but how do we update their status in the
      //attractorParticleIndex[]? By the same method? Ie.
      //attractorParticleIndex.splice(attractorParticleIndex.indexOf(this), 1);
      //if attractorParticleIndex.indexOf(this) is undefined, it means that the
      //particle has been spliced out into a subarray by an attractor.
      //Else, if attractorParticleIndex.indexOf(this) returns an index, we simply
      //remove reference to the removed particle from the attractorParticleIndex.

      //In the case that the attractor ceases to exist before the particle, what
      //we can do is iterate through the subarray, and for all the entries that
      //are NOT undefined (ie. the particle still exists), we simply append them
      //to the end of the attractorParticleIndex.

      //assignMeToAnAttractor();

      this.userDirectionVector = createVector(0, 0);

      this.assignMeToAnAttractor = function() {

            //particleAttractorIndex.push

      };

      //set random number for how much the particle is attracted to the attractor
      this.gravityOfAttractor = random(4, 10);
      //console.log("Gravity of attractor is: " + this.gravityOfAttractor);

      //setting random factor for how attracted the particle is to its home
      this.gravityOfHome = random(2, 3);
      //initiate a variable that stores its initial gravityOfHome,
      //to revert back to everytime the particle enters its homeland again.
      this.originalGravityOfHome = this.gravityOfHome;
      //console.log("Gravity of Home is: " + this.gravityOfHome);

      //used to be: 3 * random(1, 10);
      //lets see what happens to the particles' movement when it is set to
      //lower values.. ie. between 1 and 10.
      //set random "factor" which influences the particles speed:
      this.factor = random(1, 10);
      //console.log("My factor is: " + this.factor);

      //This is to initialise the xoff-variable for each particle to start at position 0
      //in the perlin noise table of "random" nubers
      this.xoff = random(0, 10000);
      //console.log("This.xoff is: " + this.xoff);
      this.yoff = random(0, 10000);
      //console.log("This.yoff is: " + this.yoff);

      /*
      *
      *   This is to set the birth color and create a string.
      *
      */

      cellID = voronoiGetSite(tempX, tempY, false);
      this.cellID = cellID;
      var particleBirthColor = voronoiGetColor(this.cellID);

      this.particleBirthColor = particleBirthColor;
      //console.log("Particle birth color is:" + particleBirthColor);

      var particleBirthColorSTRING = this.particleBirthColor.toString();
      this.particleBirthColorSTRING = particleBirthColorSTRING;
      //console.log("This is the particle birth color as a string:" + particleBirthColorSTRING);

      //console.log("Particle birth color is now:" + this.particleBirthColor);
      this.color = this.particleBirthColor;

      /*
      *
      *   Initialise all vectors related to particle:
      *
      */

      //saves coordinates of particles' origin
      //deleted this.originX, this.originY.
      //we just need this.birthSpot/this.home, because we can access .x and .y through it:
      //we save two: this.birthSpot and this.home
      //they are fundamentally different in the course of a particles' lifetime:
      //this.birthSpot will forever be the particles' birthspot, no question about it
      //HOWEVER, over the course of its lifetime, this.home can change, as the
      //particle moves(migrates) and passes its framecounts(life) at an attractor.
      this.birthSpot = createVector(tempX, tempY);
      this.home = createVector(tempX, tempY);
      this.positionVector = createVector(tempX, tempY);

      //this.home = this.birthSpot;

      //console.log("this.birthSpot is:" + this.birthSpot);
      //console.log("this.home is:" + this.home);
      console.log("Made a particle!");
      console.log("This is my positionVector:" + this.positionVector);


      //parameter to keep track of whether the particle is matched with
      //an attractor:
      this.myDestiny = "undefined";

      //set the x,y coordinates of the particle. These are altered everytime the .move() -method is called.
      //this.positionVector = createVector(tempX, tempY);
      //print("positionVector is:" + this.positionVector);

      //initialises vector that pulls towards the attractor
      this.towardsAttractor = createVector();

      //initialises the towardsHome vector:
      this.towardsHome = createVector();

      /*
      *
      *   Determine how the particle is visualised.
      *
      */

      this.display = function() {

        //this is to revert the particle color back to the birth color
        //once the repulsor has been removed from the cell:
        //if( attractors[0].existance === "undefined" ){
        //    this.color = this.particleBirthColor;
        //}



              strokeWeight(1);
              fill(this.color);
              stroke("white");


            //as particle is born, it gradually grows into its full size
            if(this.counter < 10){
              this.diameter = this.counter;
            } else {
              if(this.isAttractedTo == "You"){
                //fill("white");
                //strokeWeight(3);
                stroke("black");
                //this.diameter = 15;

              }else{
                this.diameter = particleDiameter;
              }
            }

            var cursorPosition = createVector(mouseX, mouseY);
            //console.log("This is cursorPosition from within particle.js" + cursorPosition);
            var particleCursorDistance = p5.Vector.dist(this.positionVector, cursorPosition);
            if(particleCursorDistance < particleDiameter/2){
              //console.log("Problem!");
              this.giveInformation();
            }

            //as particle is dying, it gradually fades out:
            //starting at lifespan = 300, we fade them out:
            //if(this.lifespan < 100){
            //  this.diameter += 1;
            //}

            ellipse(this.positionVector.x, this.positionVector.y, this.diameter, this.diameter);
            this.lifespan -= 0.1;
            this.counter += 0.1;

            //now they just pop out of the world:
            if(this.lifespan <= 0){
               this.remove();
            }



      };//close this.display

      this.giveInformation = function () {
          //console.log("My quality is: " + this.isAttractedTo);
          textSize(particleDiameter);
          fill("white");
          stroke("black");
          text(this.isAttractedTo, this.positionVector.x + 5, this.positionVector.y + 5);
          //setTimeout();
      }


      /*
      *
      *   Determine how the particles move.
      *
      */

      //checking the destiny and choosing the destiny should be in the same function...
      //check whether an attractor exists:
      //I had a really silly bug here................. I was basically
      //breaking out of this true/false checking function after index 0 of
      //the attractors array.... lol!

      //should change this so that this function returns an array of possible
      //destinies to pursue. OR if a repulsor is present in their cell, returns
      //only the repulsor!
      this.canLiveOutItsDestiny = function(){
          //check this.isAttractedTo against attractors[]

          for(var i=0; i<attractors.length ; i++){
                if(attractors[i].existance !== "undefined" && attractors[i].quality === this.isAttractedTo){
                  //console.log("There is a destiny! " +
                  //"My index is at: " + particles.indexOf(this) +
                  //" and I am attracted to:" + this.isAttractedTo);
                  return true;
                }
          }//close for
          if(i == attractors.length){
                return false;
          }

      }

      //In fact, we just need to make destinies[] a global variable?
      //then, for this.destinies

      this.findMyDestiny = function(){
        //the problem is here: we are adding all the attractors that at some
        //point exist/ed to the destinies [], but then once they are removed,
        //these attractors continue to exist in the destinies [], which means
        //that random(destinies) will end up returning a destiny which is no
        //longer available....
        //console.log("The destinies array looks like this:" + destinies);
        var destinies = [];
        //console.log("Going to find my possible destinies..");
            for(var i=0; i<attractors.length; i++){
                  if(attractors[i].existance !== "undefined" && attractors[i].quality == this.isAttractedTo){
                    destinies.push(i);
                  }
            }//close for
            //returns a random index from the list of all possible indexes
            //for attractors[] which contain attractors of the quality that the
            //particle is attracted to:
            let randomDestiny = random(destinies);
            //console.log("This is the index of my random destiny: " + randomDestiny);
        return randomDestiny;

      }

      this.feelsPresenceOfRepulosor = function(){
      }

      this.updateDestinySituation = function() {



      }

      this.move = function() {

            /*
            *
            *   Attempt to define particle-attractor relationship within
            *   the particles' .move()
            *
            *
            */

            //attempt to implement repulsor/negative attractor
            //if ( this.feelsPresenceOfRepulsor() ){
              //make them move away from the repulsor!!!!
              //(But not beyond the confines of their zone!)
              //Initial version: just make them go REALLY FAST
              //away from their repulsor (no matter whether they
              //cross out of their cell or not)
            //} else {

            //case1: the first time we check for this
            //case2: while the attractor still s
            //case3: once the actor has ceased to exist:

            //The problem is now:
            //we revert to myDestiny undefined once the lifespan of the
            //attractor is <=2. This means that at the next cycle,
            //the particle will still evaluate canLiveOutItsDestiny() as true

            //this method runs at every cycle to see if there are any new
            //attractors that may be relevant for the particle. It starts
            //iterating from the last index that it was checking from
            //because it already knows the attractors at the earlier positions:
            //this.updateDestinySituation();

            if (this.canLiveOutItsDestiny()){

                  //console.log("I can live out my destiny!");
                  //the problem here is that, once the particle has identified
                  //that a relevant attractor exists for it, it must continue
                  //to move towards that particular attractor, instead of:

                  //AND: as soon as that specific attractor is removed from
                  //the attractors array, there will be a new one to take its
                  //place at that index........ so  attractors[myDestiny] lifespan
                  //less than zero will NEVER evaluate as false.....
                  if(this.myDestiny == "undefined"){
                      //used to change particle color to black if this.hasDestiny
                      //for testing purposes, just to make those particles
                      //visible....
                      //this.color = "black";
                      this.myDestiny = this.findMyDestiny();
                      this.home = attractors[this.myDestiny].attractorPosition;
                      /*console.log("Going towards my destiny");
                      console.log("I am attracted to: " + this.isAttractedTo);
                      console.log("I exist at:" + particles.indexOf(this));
                      console.log("And my attractor is at index:" + this.myDestiny);
                      */
                      //this.home = attractors[myDestiny].position;
                  }else{
                    //console.log("No match with an attractor!");
                    //if destiny is defined, then,
                    //do nothing. (ie. follow it.)
                  }
                  //which effectively chooses a random attractor at each iteration,
                  //ie. at every move() cycle, the particle will inch towards
                  //any of n suitable attractors...............
                  //HOW TO:
                  //1. does an attractor that is suitable for me exist?
                  //2. YES: while that attractor exists, go towards it
                  //3. NO: go to 1.

                //HOWEVER, if the attractor is nearing the end of its lifespan,
                //detach from it:
                //reassign home as birthSpot, and
                //revert this.myDestiny to undefined:
                //if the ID was 1 or 2, and now there is just one element
                //in the attractors [], this will not evaluate:
                //IE. we do need to keep the attractors' unique index within
                //the array in order to keep track of the full situation:
                //if(attractors[this.myDestiny].existance == undefined){
                //once the attractor goes inactive ie: .existance == "undefined"
                if(attractors[this.myDestiny].existance == "undefined" || attractors[this.myDestiny].lifespan <= 1){
                    //revert color back to original birthColor:
                    this.color = this.particleBirthColor;
                    //console.log("Reverting back to destiny undefined");
                    this.home = this.birthSpot;
                    this.myDestiny = "undefined";
                }
                //Now the problem is as follows: once destiny has been
                //reverted to undefined, it is very likely that already in
                //the next iteration, the program will assign a new
                //destiny.

          }// close canLiveOutItsDestiny




          //}//end if this.feelsPresenceOfRepulosor() / else

            // this.hasDestiny will be set to true if there is a repulsor
            // in the cell of the particle,
            // the only other condition in which this is true is when the
            // particle has been matched with an attractor.....
            // YET, in the case that they feel the presence of a repulsor,
            // their this.isAttractedTo will not be equal to repulsor.
            // we need to store: this.isGoingTowards as a reference to the
            // index of the attractor array at which the particles' destiny
            // is located: for example: this.hasADestiny could return this index..
            if ( attractors[0].quality == "repulsor" ){



                var attractorCellID = voronoiGetSite(attractors[0].attractorPosition.x, attractors[0].attractorPosition.y, false);
                var attractorCellColor = voronoiGetColor(attractorCellID);
                //now we know the color of the cell that the attractor is in.
                var attractorCellColorSTRING = attractorCellColor.toString();

                if (attractorCellColorSTRING === particleBirthColorSTRING){


                  //
                  //console.log("My color is:" + particleBirthColorSTRING +
                  //"and the attractorCellColorSTRING is:" + attractorCellColorSTRING);
                  //console.log("The repulsor is in my cell! Turning me to black.");
                  this.color = "black";
                  var repulsorLocation = attractors[0].attractorPosition; //A
                  var repulsorForce = createVector(); //C

                  repulsorForce = p5.Vector.sub(this.positionVector, repulsorLocation);
                  //var repulsed = createVector();
                  repulsorForce.mult(0.02);
                  //console.log("RepulsorForce is: " + repulsorForce);
                  this.positionVector.add(repulsorForce);

                  if( attractors[0].existance === "undefined" ){
                      //this.color = [0, 0, 0, 0];
                      this.color = this.particleBirthColor;
                  }

                }

            }


            //put the amIatHome check AFTER the propel away from repulsor.
            //This way, the particle should get stuck within its own cell:

            //if the particle is not at home, we make it move towards home
            //before we add the movement determined by perlin noise:
            if (!this.amIHome()) {
                  this.goTowardsHome();
            }//close if (!this.amIHome()


            //In the perlin noise version, we will simply iterate through the perlin noice
            //table of numbers by incrementing the xoff and yoff variables for each particle.
            let randomXNoise = noise(this.xoff)
            this.xoff += 0.02;

            let randomYNoise = noise(this.yoff)
            this.yoff += 0.01;

            //we are adding a random speed factor based on perlin noise:
            let randomXSpeedFactor = map(randomXNoise, 0, 1, -7, 7);
            let randomYSpeedFactor = map(randomYNoise, 0, 1, -7, 7);

            this.positionVector.add(randomXSpeedFactor, randomYSpeedFactor);

            this.positionVector.add(this.userDirectionVector);

            //so that the particles do not go off the visible canvas
            this.positionVector.x = constrain(this.positionVector.x, drawingBorderX, width)
            this.positionVector.y = constrain(this.positionVector.y, drawingBorderY, height)

            //for flipping particles to the other side:
            //does not really work, particles start zooming all over the world..
            //this.amIOnTheEdge();

      } // close this.move()


      /*
      *
      *   Particle goes towards home.
      *
      */

      //separated this from the move function
      this.goTowardsHome = function(){

        //console.log("Going towards home!");

        //if the particle is not at home, increase accelerationVector
        //by multiplying it with the gravityOfHome vector
        //accelerationVector will thus be incremented at each
        //draw cycle, if the particle is not at home

        //increment gravityOfHome for as long as they are not at home.
        //small increments like 0.01 hardly make a huge difference

        //IF you do not increment gravityOfHome,
        //ie. += 0, then some Particles
        //will venture deeper beyond home, than others, before returning
        //all determined by their gravityOfHome -factor
        //if you increment gravityOfHome, ALL particles will bounce
        //back towards home much quicker.

        //IF you increment gravityOfHome for every frame that Particles
        //spend away from home, particles will in general tend to
        //wander around their home rather than elsewhere,
        //speedily returning once they realise they are away from home.
        // eg. values like 0.1 or 0.3

        //For next steps, I am going to continue using this rather
        //conservative value for gravityOfHome,
        //ie. I'll be working with a simulation where particles tend
        //to gravitate towards their home, ie. where they tend to stay
        //within the borders of their cells.

        //There is something happening here in terms of gravityOfHome,
        //which is as follows:
        //IF the particle is at an attractor, they start moving faster and
        //faster and really jittering around the attractor in a way that is
        //visually really demanding.. I think this is because they are checking
        //against bacckground color and realising that although they are at
        //"home"/their temporary attractor home, they are not in their own
        //cell, and so they keep increasing their velocity..
        this.gravityOfHome += 0.05;
        //console.log("Increasing gravity of home!");

        //An attractor will take over the this.home as well as
        //this.gravityOfHome in order to propel the particle
        //towards itself:
        this.towardsHome = p5.Vector.sub(this.home, this.positionVector);
        this.towardsHome.normalize();

        this.towardsHome.mult(this.gravityOfHome);
        //print("This is the towarards home vector:" + this.towardsHome);
        //print("This is the home vector:" + this.home);
        this.positionVector.add(this.towardsHome);

      } // close this.goTowardsHome


      /*
      *
      *   Move particle towards attractor.
      *
      */

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


      } //close this.goTowardsAttractor


      /*
      *
      *   Flip particles over edges of canvas.
      *
      */

      this.amIOnTheEdge = function() {

            if (this.positionVector.x == width) {
              this.positionVector.x = 0;
            } else if (this.positionVector.x == 0) {
              this.positionVector.x = width;
            }

            if (this.positionVector.y == height) {
              this.positionVector.y = 0;
            } else if (this.positionVector.y == 0) {
              this.positionVector.y = height;
            }

      } //close this.amIOnTheEdge()


      this.hasADestiny = function() {
          if(!this.home.equals(this.birthSpot)){
            //meaning that this.home has been changed to equal the
            //position of the attractor:
            return true;
          }else{
            return false;
          }
      }


      /*
      *
      *   Check whether particle is at home.
      *
      */

      this.amIHome = function() {

            //var distanceFromHome;
            //console.log("Going into amIHome(), checkin if positionVector is still defined" + this.positionVector);

            //console.log("This is my CellID" + this.cellID);


            var attractorDistance;
            //need to implement a new check here:
            //if the particles home has been changed to something other than
            //its birthSpot, then amIHome returns true.

            //In preparation of the if/else decision tree below:
            //get the color of the current pixel that the particle is in:
            var colorOfTheLand = get(this.positionVector.x, this.positionVector.y);
            //colorOfTheLand[3] = 254;

            //Because we added transparency, I need to be checking here for:
            // RGB values with a deviation of max 1-2 integers
            // A value can be anything above 127
            // What if there are multiple particles at that position? :X
            // their combined effect will be to

            var colorOfTheLandSTRING = colorOfTheLand.toString();
            //console.log("This is the color of the land:" + colorOfTheLand);
            //console.log("This is the color of the land as a string:" + colorOfTheLandSTRING);
            //console.log("And this is the color of the particle:" + this.particleBirthColor);

            //In preparation for the if/else decision tree below, and primarily
            //in order to implement particles moving in a calm way within the
            //attractors:
            //check if we can access the attractorDiameter from within this class:
            //YES WE CAN, wohoo for var scope!!!!!! it does make sense in many
            //situations, although we do of course appreciate let as well.
            //console.log("The diameter of the attractor is:" + attractorDiameter);
            //this calculates the distance between home and attractorDistance
            //IF home is not equal to birthspot...


            //NEXT PROBLEM: The particle gets completely stuck at the border.
            //NOTE: I kind of like this jitter around the border, because
            //it really makes it feel like the particle is struggling against
            //the wall, and trying to seek all along it for an entrypoint
            //It looks like the particle is "trying to cross"
            //BUT: what is not nice is the jittering, it is very
            //disturbing to the eye.

            //HOWEVER: a more elegant type of decision-making might be
            //wort considering for this situation
            //HOW TO: once they reach the border, either change paths completely
            //and navigate around the rest of their cell, ie. follow along
            //the border without "trying to cross"
            //OR slow down a lot in their movement for x amount of time.

            //IF attractor.quality == "repulsor"
            //check what cell the repulsor is in, if repulsor cellID = particle cellID
            //propel the particle away from the repulsor,
            //OR: but not beyond the borders of their zone.
            //OR: all the way until the edges of the map.

            if ( this.hasADestiny() ) { //check if particle going towards attractor
              attractorDistance = p5.Vector.dist(this.positionVector, this.home);
              if (attractorDistance < (attractorDiameter/2)-10) { //-10 or -5
                this.gravityOfHome = this.originalGravityOfHome;
                return true; //if particle within radius of attractor, keep moving as usual
              } else {
                return false; //-> goTowardsHome
              }
          //if not going after attractor, check if they are in their home cell:
          //NEXT UP: implement passport modes!
          }else if (whichCellAmIin(this.positionVector) == this.cellID){
              this.gravityOfHome = this.originalGravityOfHome;
              return true;
            } else {
              return false //I am not an home
            } //close if else structure

            function whichCellAmIin(myPosition){
              var distances = [];
              for(var i=0;i<theWorldSites.length;i++){
                  var distance = myPosition.dist(theWorldSites[i]);
                  distances[i] = distance;
              }
              var index = 0;
              var smallest = distances[0];
              for (var i=0; i<distances.length;i++){
                  if (distances[i] < smallest){
                    smallest = distances[i]
                    index = i;
                  }
              }
                return index;
            }//close whichCellAmIin

      } //close amIHome()





      /*
      *
      *   Remove particle from particles [].
      *
      */

      this.remove = function(){
        var myIndex = particles.indexOf(this);
        //console.log(myIndex);
        particles.splice(myIndex,1);
        //console.log("Removed me! At index:" + myIndex);
        //console.log("Particles array now looks like this:");
        //console.log(attractors);

      }//close this.remove

      /*
      *
      *   Flickers particle out before removing.
      *         - looks horrible, not -
      *            - using this -
      *
      */

      this.flickerOut = function(){

        if(this.lifespan <= 10){
          this.color = [255, 255, 255, 255];
          this.particleBirthColorSTRING = this.color.toString();
        }

        if(this.lifespan <= 6){
          this.color = [0, 0, 0, 255];
        }

        if(this.lifespan <= 4){
          this.color = [255, 255, 255, 255];
        }

        if(this.lifespan <= 3.5){
          this.color = [0, 0, 0, 255];
        }

        if(this.lifespan <= 3){
          this.color = [255, 255, 255, 255];
        }

        if(this.lifespan <= 2.5){
          this.color = [255, 255, 255, 255];
        }

        if(this.lifespan <= 2){
          this.color = [0, 0, 0, 255];
        }

        if(this.lifespan <= 1.5){
          this.color = [255, 255, 255, 255];
        }

        if(this.lifespan <= 1){
          this.color = [0, 0, 0, 255];
        }

        if(this.lifespan <= 0.5){
          this.color = [255, 255, 255, 255];
        }

        if(this.lifespan <= 0){
           this.remove();
        }//endif


      }//close this.flickerOut

}//close particle()
