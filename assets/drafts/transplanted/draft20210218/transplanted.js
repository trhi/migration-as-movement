let poem =
`From that landscape I am now missing.`

var cnv, lines, markov, txt1, txt2, x = 40, y = 40;
let transplanted, rooted, growing, rhizome;
var poetryLoop, toggleAudio, audioStatus, samplePlaying;

let myFont, fontDone;

function fontLoaded(){
    fontDone = true;
}

function preload(){

  soundFormats(`mp3`);
  poetryLoop = loadSound(`assets/sound/transplanted.mp3`);
  poetryLoop.setVolume(0.1);

  myFont = loadFont("assets/fonts/PoppinsLatin-Medium.otf", fontLoaded);

  //txt1 = loadStrings('txt/transplanted.txt');
  //txt2 = loadStrings('txt/rooted.txt');

  transplanted = loadStrings('txt/transplanted.txt');
  rooted = loadStrings('txt/rooted.txt');
  growing = loadStrings('txt/growing.txt');
  rhizome = loadStrings('txt/rhizome.txt');


}

function setup(){

  if(poetryLoop.isLoaded()){

    //poetryLoop.setLoop(true);
      //poetryLoop.play();
    //poetryLoop.pause();
    samplePlaying = false;
  }

  cnv = createCanvas(500, 200);
  cnv.style(`z-index`,`0`);

  toggleAudio = createButton(`&#128264`);
  toggleAudio.id(`toggleAudio`);
  $(`#toggleAudio`).css(`font-size`,`25px`);
  $(`#toggleAudio`).css(`text-align`,`center`);
  $(`#toggleAudio`).css(`border`,`none`);
  $(`#toggleAudio`).css(`background`,`rgb(23, 230, 200)`);
  $(`#toggleAudio`).css(`z-index`,`1000`);
  $(`#toggleAudio`).css(`left`,`30px`);
  $(`#toggleAudio`).css(`top`,`130px`);
  $(`#toggleAudio`).css(`width`,`45px`);
  $(`#toggleAudio`).css(`height`,`45px`);
  $(`#toggleAudio`).css(`border-radius`,`50px`);
  $(`#toggleAudio`).css(`position`,`fixed`);
  $(`#toggleAudio`).css(`cursor`,`pointer`);


  toggleAudio.mousePressed(muteUnmute);

  if(fontDone){
      textFont(myFont);
  }

    textSize(16);
    textLeading(25);
    textAlign(CENTER);

    lines = ["click to (re)generate"];

    markov = RiTa.markov(2, true);

    // load text into the model
    markov.addText(transplanted.join(' '));
    markov.addText(rooted.join(' '));
    //markov.addText(growing.join(' '));
    //markov.addText(rhizome.join(' '));

    //console.log(markov);

    drawText();
}

function muteUnmute(){

  //console.log("entered function and poetryLoop.isPlaying() is: " + poetryLoop.isPlaying() );


  if ( samplePlaying ) {
    poetryLoop.pause();
    samplePlaying = false;
    toggleAudio.html(`&#128264`); // audio on

  } else if ( !samplePlaying ){
    poetryLoop.loop();
    samplePlaying = true;
    toggleAudio.html(`&#128263`); // audio off
  } else {
    //console.log("something is wrong.");
  }

}

function drawText() {
  background(20);
  fill(23, 230, 200);
  text( lines , x, y, 420, 420 );
}

function mouseClicked() {
  lines = markov.generate(2);
  x = y = 40;
  drawText();
}
