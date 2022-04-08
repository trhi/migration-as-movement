var mitae = [], miksi = [], miten = [], missae = [], juuret = [], kaipuu = [];
var counter = 0;

function doInterface(){

  canvas = createCanvas(windowWidth, windowWidth);
  canvas.style('display', 'block');
  canvas.id('canvas');
  background("transparent");



  infoButton = createButton('i');
  infoButton.addClass('infobutton');
  infoButton.mouseOver( () => heartButton.attribute('src', 'assets/images/h-ear-t-info.png') )
  .mouseOut( () => heartButton.attribute('src', 'assets/images/h-ear-t.png') );

  sortAudiofiles();

  heartButton = createImg('assets/images/h-ear-t.png');
  heartButton.parent('heartDIV');
  heartButton.style("visibility: visible");
  //heartButton.addClass('heartButton');
  heartButton.addClass('h-ear-tButton');
  heartButton.mousePressed( () => listenToMyHeart() )
  .mouseReleased( () => stopAndClear() )
  .mouseMoved( () => stopAndClear() )
  .mouseOut( () => stopAndClear() );
}

function stopAndClear(){
  $("#questions").css('opacity', '0.3');
  //heartButton.attribute('src', 'assets/images/heart-broken.jpg')
  heartButton.attribute('src', 'assets/images/h-ear-t.png')
  listener.stop();
}

function listenToMyHeart() {
  $("#questions").text('');
  $("#questions").text('" 🎤  "');
  $("#questions").css('opacity', '1');
  //heartButton.attribute('src', 'assets/images/heart-beating.gif');
  heartButton.attribute('src', 'assets/images/h-ear-t.gif');
  listener.start();
}

function  sortAudiofiles() {
  for( let i=0; i<thoughts.questions.length; i++){
          if( thoughts.questions[i].text.includes('miksi') ){
            miksi.push(thoughts.questions[i]);
          }
          if( thoughts.questions[i].text.includes('mitä') ){
            mitae.push(thoughts.questions[i]);
          }
          if( thoughts.questions[i].text.includes('miten') ){
            miten.push(thoughts.questions[i]);
          }
          if( thoughts.questions[i].text.includes('missä') ){
            missae.push(thoughts.questions[i]);
          }
          if( /juur/gi.test(thoughts.questions[i].text) ){
            juuret.push(thoughts.questions[i]);
          }
          if( /kaip|kaiv/gi.test(thoughts.questions[i].text) ){
            kaipuu.push(thoughts.questions[i]);
          }
  }
  console.log("Found these:");
  console.log(miksi, mitae, miten, missae);
  console.log(juuret, kaipuu);
}

function whatDidTheyAskUs(whatTheyAskedUs){

       if ( /miksi/ig.test(whatTheyAskedUs) ){
          counter = 0;
        //  console.log("I heard miksi");
          selectRandom(miksi);
      } else if ( /mitä/ig.test(whatTheyAskedUs) ){
          counter = 0;
          //console.log("I heard mitä");
          selectRandom(mitae);
      } else if ( /miten/ig.test(whatTheyAskedUs) ){
            counter = 0;
            //console.log("I heard miten");
            selectRandom(miten);
      } else if ( /missä/ig.test(whatTheyAskedUs) ){
            //console.log("I heard missä");
            selectRandom(missae);
      } else if ( /kaip|kaiv/ig.test(whatTheyAskedUs) ){
            counter = 0;
          //  console.log("I heard kaipuu");
            selectRandom(kaipuu);
        } else if ( /juur/ig.test(whatTheyAskedUs) ){
            counter = 0;
            //console.log("I heard juuret");
            selectRandom(juuret);
        }

}//end whatDidTheyAskUs

function selectRandom(array){
      let randomChoice = random(array);
      console.log("First selection:");
      console.log(randomChoice);
      let path = 'assets/audio/fi/' + randomChoice.filename;
      let audio = createAudio( path );
      audio.addCue(3, next);
      audio.play();
}

function next() {
  //then play back an interjection
  //then play back two observations
  //then echo the audio that the user asked?

  let randomQuestion = random(thoughts.questions);
  let randomAnswer1 = random(thoughts.answers);
  let randomAnswer2 = random(thoughts.answers);
  let randomInterjection1 = random(thoughts.interjections);
  let randomInterjection2 = random(thoughts.interjections);
  let randomInterjection3 = random(thoughts.interjections);

  let randomNext = random([randomQuestion, randomAnswer1, randomAnswer2, randomInterjection1, randomInterjection2, randomInterjection3]);
  console.log("I chose:");
  console.log(randomNext);

  var path = thoughts.path + randomNext.filename;
  var nextAudio = createAudio ( path );
  if(counter < 5){
        console.log("Counter is now: " + counter + ", and I will add another cue");
        console.log("nextAudio is now:");
        console.log(nextAudio);
        nextAudio.addCue(2, next);
        nextAudio.play();
        counter++;
        console.log("Counter is now: " + counter + ", I just added another cue");
        console.log("nextAudio is now:");
        console.log(nextAudio);
  }else{
        console.log("Counter is now: " + counter + ", and I am stopping");
        nextAudio.play();
        counter = 0;
  }
}

function hideInfo(){
  this.style.visibility = "hidden";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
