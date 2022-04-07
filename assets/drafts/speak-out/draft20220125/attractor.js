/*
*
*   Describe internal life of an attractor.
*
*/

var attractorDiameter = 40;

function attractor(quality, attractorX, attractorY, lifespan) {

  this.attractorPosition = new p5.Vector(attractorX, attractorY);
  //this.factor = 0.04;
  this.factor = 0;
  this.xoff = random(0, 10000);
  this.yoff = random(0, 10000);

  //OR: make the factor depend on quality?


  this.quality = quality;
  this.lifespan = lifespan;
  this.gravityOfAttractor = random(2,8);
  this.existance = "defined";
  this.color = "white";

  //if you make it move a little bit, this will need to be updated:
  this.existsIn = voronoiGetSite(this.attractorPosition.x, this.attractorPosition.y, false);

  /*
  *
  *   Display information about attractor.
  *
  */

  this.giveInformation = function () {
    textSize(20);
    fill("black");
    noStroke();
    //textFont(myFont);
    //text(this.quality, this.attractorPosition.x + 0.75*attractorDiameter, this.attractorPosition.y + 0.21*attractorDiameter);
  }


  /*
  *
  *   Display attractor
  *
  */

  this.display = function() {

    this.lifespan -= 0.1;
    if(this.lifespan <= 0){
      //instead of removing them from the array,
      //set their existance to "undefined"
      this.existance = "undefined";
      worldAttractions.push(this.quality);
      //and then pop their quality back into the worldAttractions variable

    } else {
      noFill();
      if(this.quality == "repulsor"){ // not using atm
        fill(0);
      }
      stroke(this.color);
      ellipse(this.attractorPosition.x, this.attractorPosition.y, attractorDiameter, attractorDiameter);

      noStroke();
      textSize(20);
      fill(this.color);
      text(this.quality, this.attractorPosition.x + 0.75*attractorDiameter, this.attractorPosition.y + 0.21*attractorDiameter);

    }

    var cursorPosition = createVector(mouseX, mouseY);
    var attractorCursorDistance = p5.Vector.dist(this.attractorPosition, cursorPosition);
    if(attractorCursorDistance < attractorDiameter/2){
      this.giveInformation();
    }
  }//close this.display

  /*
  *
  *   Move attractor
  *
  */

  this.move = function() {

    //console.log("moving attractor");
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
  this.attractorPosition.add(randomXSpeedFactor, randomYSpeedFactor);

  this.attractorPosition.x = constrain(this.attractorPosition.x, drawingBorderX+2, canvasX-2);
  this.attractorPosition.y = constrain(this.attractorPosition.y, drawingBorderY+2, canvasY-2);

  this.existsIn = voronoiGetSite(this.attractorPosition.x, this.attractorPosition.y, false);

}// close this.move

}//close attractor
