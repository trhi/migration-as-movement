var variations = {
  "moves" : {
    "border" : function() {
      let randomXNoise = noise(this.xoff);
      this.xoff += 0.02;
      let randomYNoise = noise(this.yoff);
      this.yoff += 0.01;

      //generate random number based on perlin noise:
      let randomXSpeedFactor = map(randomXNoise, 0, 1, -7, 10);
      let randomYSpeedFactor = map(randomYNoise, 0, 1, -7, 7);

      //makes the particles move MUCH slower
      //effect of this is: that its easier to notice
      //once they start going very quickly towards an attractor
      randomXSpeedFactor = this.factor*randomXSpeedFactor;
      randomYSpeedFactor = this.factor*randomYSpeedFactor;

      this.x += randomXSpeedFactor;
      this.y += randomYSpeedFactor;
      //this.positionVector.add(randomXSpeedFactor, randomYSpeedFactor);

      //finally, don't let the particles go off the canvas:
      this.x = constrain(this.x, 0, width/3);
      this.y = constrain(this.y, 0, height);
    },
    "solitaireEnding" : function () {
      return "solitaire";
    },
    "moveRight" : function () { //move right
        this.x = this.x + random(0, 1);
        this.y = this.y + random(-1, 1);
        //this.x = constrain(this.x, 0, width);
        //this.y = constrain(this.y, 0, width);

        if (this.x >= width+this.r/2){
          this.x = 0-this.r/2;
        }
        if (this.y >= height+this.r/2){
          this.y = 0-this.r/2;
        }

    },
    "moveDown" : function () { //move right
        this.x = this.x + random(-1, 1);
        this.y = this.y + random(-1, 0);

        if (this.x >= width+this.r/2){
          this.x = 0-this.r/2;
        }
        if (this.y >= height+this.r/2){
          this.y = 0-this.r/2;
        }
    },
    "jitter" : function () { //jitter
      this.x = this.x + random(-1, 1);
      this.y = this.y + random(-1, 1);
    },
    "moveLeft" : function () { //move right
        this.x = this.x + random(1, 0);
        this.y = this.y + random(-1, 1);

        if (this.x >= width+this.r/2){
          this.x = 0-this.r/2;
        }
        if (this.y >= height+this.r/2){
          this.y = 0-this.r/2;
        }
    },
    "moveUp" : function () { //move right
        this.x = this.x + random(-1, 1);
        this.y = this.y + random(0, 1);

        if (this.x >= width+this.r/2){
          this.x = 0-this.r/2;
        }
        if (this.y >= height+this.r/2){
          this.y = 0-this.r/2;
        }
        if (this.x <= 0-this.r/2){
          this.x = width-this.r/2;
        }
        if (this.y <= 0-this.r/2 ){
          this.y = height+this.r/2;
        }
    },
    "drawing" : function () {
      return "drawing";
    },
    "perlin" : function () {
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

      this.x += randomXSpeedFactor;
      this.y += randomYSpeedFactor;
      //this.positionVector.add(randomXSpeedFactor, randomYSpeedFactor);

      //pop the particle from other side of canvas (x or y):
      //console.log("width is:", width, "this.x is:", this.x);

      //courtesy of Daniel Shiffman / The coding train / 5.5 Wander Steering Behavior at 11min39sec
      let hitEdge = false;
      if (this.x > width + this.r){
        this. x = -this.r;
        hitEdge = true;
      } else if (this.x < -this.r){
        this.x = width + this.r;
        hitEdge = true;
      }
      if ( this.y > height + this.r ){
        this.y = -this.r;
        hitEdge = true;
      } else if ( this.y < -this.r){
        this.y = height + this.r;
        hitEdge = true;
      }

      /*
      //finally, don't let the particles go off the canvas:
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
      */
    },
    "phd" : function () {

      if( this.x === phdX && this.y === phdY){
        //do nothing
      } else {
        let terhi = createVector(this.x, this.y);
        let phd = createVector(phdX, phdY);

        let towardsAttractor = createVector();
        towardsAttractor = p5.Vector.sub(phd, terhi);
        towardsAttractor.normalize();

        let attractorDistance = createVector();
        attractorDistance = p5.Vector.dist(terhi, phd);

        towardsAttractor.mult(2); // try 0.3
        terhi.add(towardsAttractor);

        this.x = terhi.x;
        this.y = terhi.y;
      }

    }
  }
};
