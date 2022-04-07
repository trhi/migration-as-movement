/*
*
*   Describe internal life of an attractor
*
*/

var attractorDiameter = 40;

function attractor(quality, attractorX, attractorY, lifespan) {

        //first attempt to associate sound with attractors:
        //var audioElement = createAudio('sound/guterres-migration-is-here-to-stay.mp3');
        //this.audioElement = createAudio('sound/guterres-migration-is-here-to-stay.mp3');
        this.quality = quality;
        this.attractorPosition = new p5.Vector(attractorX, attractorY);
        this.lifespan = lifespan;
        this.gravityOfAttractor = random(30,100);
        //console.log("My gravity is: " + this.gravityOfAttractor)
        //console.log("My lifespan is:" + this.lifespan);

        //attempt to create unique identifiers for attractors based on their
        //position in the array:
        //this.existance = exists/defined
        //this.existance = removed/undefined
        this.existance = "defined";

        //corresponds to the cellID of the cell in which the attractor is
        this.existsIn = voronoiGetSite(this.attractorPosition.x, this.attractorPosition.y, false);
        //console.log("A new attractor was created. This attractor is for: " + this.quality +
        //  " , and exists in cell: " + this.existsIn);

        //an attempt at implementing a give information on hover
        //perhaps .mouseOver() only works on html elements?
        //this.mouseOver(this.giveInformation);
        //OK: cannot add a .mouseOver() on things that are not html elements..
        //HOWEVER, attractors always stay in the same position.
        //This means that, if we see that there is a mouse hovering within
        //the area of the attractor, we can display information:

        //as the mouse hovers over the attractor, it displays its quality
        //in white:
        this.giveInformation = function () {
            //console.log("My quality is: " + this.quality);
            textSize(20);
            fill("white");
            text(this.quality, this.attractorPosition.x, this.attractorPosition.y + 5);
            //setTimeout();
            //this.audioElement.play();
        }


          /*
          *
          *    Attract particles
          *
          */

        //currently not being used:
        this.attractParticles = function() {

            //console.log("Attracting particles");
            //console.log("My position is: " + this.attractorPosition);
            //particles[0].home = this.attractorPosition;
            //console.log("Particle at 0 home is now:" + particles[0].home);
            //particles[0].goTowardsHome;

            //for each attractor: attract x particles starting from
            //var myIndex = attractors.indexOf(this);

            var myIndex = attractors.indexOf(this);

            //for testing purposes only: set the .home of the first 3 particles
            //and move them towards home:
            if(myIndex == 0){
                  for(i=0; i < 5; i++){
                      particles[i].home = this.attractorPosition;
                      particles[i].gravityOfHome = 8;
                      //call it multiple times to make them come faster:
                      particles[i].goTowardsHome;
                      particles[i].goTowardsHome;
                      particles[i].goTowardsHome;

                  }
            }
            if(myIndex == 1){
                  for(i=5; i < 10; i++){
                      particles[i].home = this.attractorPosition;
                      particles[i].gravityOfHome = 8;
                      //call it multiple times to make them come faster:
                      particles[i].goTowardsHome;
                      particles[i].goTowardsHome;
                      particles[i].goTowardsHome;

                  }
            }
            if(myIndex == 2){
                  for(i=10; i < 15; i++){
                      particles[i].home = this.attractorPosition;
                      particles[i].gravityOfHome = 8;
                      //call it multiple times to make them come faster:
                      particles[i].goTowardsHome;
                      particles[i].goTowardsHome;
                      particles[i].goTowardsHome;

                  }
            }



        } // close this.attractParticles

        /*
        *
        *   Display attractor
        *
        */

        //YEY! Moved the attractParticles() function to only be executed
        //in the case that the particle is not removed at that draw() cycle
        //NOW IT WORKS: once the attractor is removed, particles go back home:
        //To resolve next: how to get particles to move aroud/on attractor
        //in a more natural way... -> particle.js
        this.display = function() {

              this.lifespan -= 1;
              //console.log("My lifespan is now: " + this.lifespan);
              if(this.lifespan <= 0){
                //console.log("Framecount = " + frameCount);
                //INSTEAD: we could simply give attractors and particles
                //a this.state = removed/existing;
                //that way it would keep its unique position in the array,
                //yet nevertheless evaluate as either in existance or not.
                //In fact, we might let particles be removed from the array
                //yet keep attractors.
                 //this.remove();
                 //This essentially does not solve the problem:
                 //console.log("My lifespan is over!");
                 this.existance = "undefined";

              } else {
                  //this.attractParticles();
                  //choose the fill color or image or logo based on
                  //the quality of the attractor?
                  //White fill color looked extremely awkward
                  //Changed to transparent, ie. to match background:
                  //fill(get(this.attractorPosition.x, this.attractorPosition.y));
                  noFill();
                  if(this.quality == "repulsor"){
                    fill(0);
                  }
                  //console.log("Color at my position is:" + get(this.attractorPosition.x, this.attractorPosition.y));
                  ellipse(this.attractorPosition.x, this.attractorPosition.y, attractorDiameter, attractorDiameter);
              }

              //attractorDistance = p5.Vector.dist(this.positionVector, this.home);


              var cursorPosition = createVector(mouseX, mouseY);
              var attractorCursorDistance = p5.Vector.dist(this.attractorPosition, cursorPosition);
              if(attractorCursorDistance < attractorDiameter/2){
                //console.log("Problem!");
                this.giveInformation();
              }



        }//close this.display

        /*
        *
        *   Remove attractor from attractors [].
        *
        */

        //we no longer remove attractors from the array, we simply change
        //their status to this.existance = "undefined"/"defined"
        this.remove = function(){

              var myIndex = attractors.indexOf(this);
              console.log("My index is:" + myIndex);
              attractors.splice(myIndex,1);
              console.log("Removed me! At index:" + myIndex);
              console.log("Attractors array now looks like this:" + attractors);
              console.log("attractor at i is:" + attractors[i]);
              console.log("length of attractors is: " + attractors.length);


              /*
              //for testing purposes only: reset the .home of the first 3 particles
              //and the gravityOfHome
              for(i=0; i < 4; i++){
                  particles[i].home = particles[i].birthSpot;
                  particles[i].gravityOfHome = particles[i].originalGravityOfHome;
                  console.log("My home was changed");
              }
              */

              //This is definitely not any sort of final solution, BUT works in
              //the sense that we can get an idea of what it looks like when
              //particles swarm towards various attractors, and then go back
              //home after the attractors cease to exist.
              //Next up: generate attractor using speech/voice input!!!!!!

              //OR: create index that matches attractors with particles...
              if(myIndex == 0){
                    for(i=0; i < 15; i++){
                      particles[i].home = particles[i].birthSpot;
                      particles[i].gravityOfHome = particles[i].originalGravityOfHome;
                    }
              }
              if(myIndex == 1){
                    for(i=5; i < 15; i++){
                      particles[i].home = particles[i].birthSpot;
                      particles[i].gravityOfHome = particles[i].originalGravityOfHome;
                    }
              }
              if(myIndex == 2){
                    for(i=5; i < 15; i++){
                      particles[i].home = particles[i].birthSpot;
                      particles[i].gravityOfHome = particles[i].originalGravityOfHome;
                    }
              }


        }//close this.remove

}//close attractor
