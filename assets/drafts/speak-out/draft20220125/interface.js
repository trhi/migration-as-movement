var passportButtons;
var passportsDiv;
var scoreDiv;
var score;
var speakOutDiv;

var speakButton;
var speechToText = "";

var infoButton;

var invisibleButton;

var score;



/*
*
*     Everything related to the interface.
*
*/

function doInterface(){

  //test whether speech recognition is supported or not:
  var isSpeechRecognitionSupported = false;
  try {
    //disable all of this if window doesn't have webkitSpeechRecognition or SpeechRecognition
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    var listener = new SpeechRecognition;
    isSpeechRecognitionSupported = true;
  } catch (err) {
    //console.log("Speech recognition is not supported!!!");
    window.alert("Please view this work in Chrome if you want to speak out");
  }

/*
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Great, browser supports the Web Speech API - let's use it
    console.log("Browser supports SpeechRecognition");
  }else {
    console.log("Speech recognition is not supported");
    window.alert("Please view this work in Chrome");
  }
  */

//if(isSpeechRecognitionSupported){

  //iywstc = createAudio('sound/iywstc-XX.mp3');
  //iywstc = createAudio('sound/iywstc-III.m4a');
  //var sqvamtqf = createAudio('sound/sqvamtqf-XX.mp3');

  /*
  *
  *     Create score-div
  *
  */

  scoreDiv = createDiv();
  scoreDiv.addClass('score-box tooltip-top tooltip');
  scoreDiv.id('score-div'); // for mapping between button and passportMode
  //scoreDiv.attribute("title", '[fulfil the needs and desires of _You_]');


  score = createP();
  score.id('score'); // for mapping between button and passportMode
  score.parent(scoreDiv);

  /*
  *
  *     Create speak-out-div
  *
  */

  speakOutDiv = createDiv();
  speakOutDiv.addClass('speak-out-box');
  speakOutDiv.id('speak-out-div');
  $("#speak-out-div").hide();

  speakOutText = createP();
  speakOutText.id('speak-out-text');
  speakOutText.parent(speakOutDiv);

  /*
  *
  *     Create speak out button.
  *
  */

  infoButton = createButton("i");

  if(lang=="pt"){
    speakButton = createButton("Quero falar");
    speakButton.attribute("title", "[mantenha carregado para gravar a sua voz]");
    infoButton.attribute("title", "[instruções]");
  } else if (lang=="en"){
    speakButton = createButton("Speak out");
    speakButton.attribute("title", "[press continuously, speak the sentences ↟, observe]");
    infoButton.attribute("title", "[instructions]");
  }

  infoButton.addClass("info-toggle toggle buttonStyle tooltip")
  //infoButton.mousePressed(infoButtonPressed);

  if(isSpeechRecognitionSupported){
    speakButton.mousePressed(speakButtonPressed);
  }
  speakButton.addClass("speak-out-toggle buttonStyle tooltip");
  speakButton.id('speak');

  if(!isSpeechRecognitionSupported){
    speakButton.attribute("title", "[view work in Chrome to speak out]");
    speakButton.mousePressed( () => console.log("") );
    //console.log("do nothing!"
    //$("#speak").text(" - ");
    //$("#speak").prop("disabled",true);
    //speakButton.disabled = true;

  }

  /*
  *
  *     Create invisible passportButton with tooltip instructions.
  *
  *
  */

  //simply add instructions to passportsDiv!
  passportsDiv = createDiv();
  //passportsDiv.attribute('title', 'Speak these sentences to toggle between rules.');
  passportsDiv.addClass('passportsDiv tooltip tooltip-left');

  passportInstructions = createButton("↡");
  passportInstructions.attribute('title', '[speak these sentences to change the rules]');
  passportInstructions.addClass("hiddeninfo buttonStyle toggle passports-toggle tooltip tooltip-left");
  passportInstructions.position("right: 40px", 'top:10px');
  passportInstructions.parent(passportsDiv);
  //passportInstructions.hide();

  /*
  *
  *     Create passport buttons.
  *     TO-DO: use less lines.
  *
  */

  passport0 = createButton("@", 0);//monochromatic = 0
  passport1 = createButton("€", 1);//analogous = 1
  passport2 = createButton(">", 2);//complementary = 2
  passport3 = createButton("§", 3);//triad = 3
  passport4 = createButton("⊙", 4);//all = 4
  passport5 = createButton("!", 5);//exile = 5

  passport0.class("passportButton");
  passport1.class("passportButton");
  passport2.class("passportButton");
  passport3.class("passportButton");
  passport4.class("passportButton");
  passport5.class("passportButton");
  passportButtons = selectAll(".passportButton");

  for (let i = 0; i < passportButtons.length; i++) {
    passportButtons[i].parent(passportsDiv);
    passportButtons[i].addClass("buttonStyle toggle passports-toggle tooltip tooltip-left");
    if(isSpeechRecognitionSupported || !isSpeechRecognitionSupported){
      passportButtons[i].mousePressed(iywstcPlay); // trigger iywstc if they try to click the passports
    } else {
      //passportButtons[i].mousePressed(passportChosen); // for others: allow them to select a passport by clicking
    }
    passportButtons[i].attribute('title', random(passportSentences[i]));
    passportButtons[i].position("right: 40px", i*50+70); // to leave space for raums top tab
    passportButtons[i].id(i); // for mapping between button and passportMode
  }


/*
//cannot do any of this until the youParticle has come into existence:
  console.log("color of youparticle is: " + youParticle.particleBirthColor);
  document.getElementById("0").style.setProperty('color', 'rgba('
  + youParticle.particleBirthColor[0]
  + ',' + youParticle.particleBirthColor[1]
  + ',' + youParticle.particleBirthColor[2]
  + ',' + youParticle.particleBirthColor[3]
  +')');
  */

  function passportChosen() {
    passportMode = this.id();
    for (let i = 0; i < passportButtons.length; i++) {
      //or: toggle between css selector unselected
      passportButtons[i].blur();
      //passportButtons[i].style("background-color", "white");
      //passportButtons[i].style("color", "black");
    }
    //or: toggle between css selector selected
    this.focus();

    /*
    if(this.id == "0"){
      passportButtons[i].style('background', 'rgba('
      + youParticle.particleBirthColor[0]
      + ',' + youParticle.particleBirthColor[1]
      + ',' + youParticle.particleBirthColor[2]
      + ',' + youParticle.particleBirthColor[3]
      +')');

    }
    */
    //this.style("background-color", "#3333cc");
    //this.style("color", "white");
  }



  /*
      "Goal of the game: help all the small balls "
    + "reach the bigger balls by changing the rules. "
    + "<br><br>"
    + "Speak the sentences displayed when you scroll over the buttons on the right"
  */

//        cut out from the instructions:
//        + "<br><br>"
//        + "Click to make large circles"

  infoButton.mousePressed( () => {
    if(lang == "en"){
      $("#speak-out-text").html(
        "Move <em>You</em>  with the arrow keys on the keyboard [ ◄ ▲ ▼ ►]"
        + "<br><br>"
        + "Increase your score by moving <em>You</em> to the large circles"
        + "<br><br>"
        + "<em>Speak out</em> to change the rules"
        + "<br><br>"
        + "Where can <em>You</em> move?"
      );
    } else if (lang == "pt") {
      $("#speak-out-text").text("Procure ajudar as bolinhas a alcançar os seus objetivos");
    }
    $("#speak-out-div").show();
  }).mouseOut( () => {
    stopAndClear();
  });




  /*
  *
  *     Initialise tooltipster for both sets of buttons.
  *
  */



  $('.speak-out-toggle').tooltipster({
    theme: 'tooltipster-noir',
    delay: 0,
  });

  $('.info-toggle').tooltipster({
    theme: 'tooltipster-noir',
    delay: 0,
  });

  $('.tooltip-left').tooltipster({
    theme: 'tooltipster-noir',
    position: 'left',
    delay: 0
  });

  /*$('#score-div').tooltipster({
            });
*/

  $('.tooltip-bottom').tooltipster({
    theme: 'tooltipster-noir',
    position: 'bottom',
    delay: 0
  });


  $('.tooltip-top').tooltipster({
    content: $('<span>[fulfil the needs and desires of <em>You</em>]</span>'),
    theme: 'tooltipster-noir',
    position: 'top',
    delay: 0,
    animation: 'fade',
    speed: 100

  });


  function stopAndClear(){
    if(isSpeechRecognitionSupported){
      listener.stop();
    }
    $("#speak-out-div").hide();
  }



  /*
  *
  *     Create listener (speech recogniser).
  *
  */

  if (isSpeechRecognitionSupported){
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    var listener = new SpeechRecognition;
    if(lang == "en"){ // listener expects to hear english
      listener.lang = 'en-US';
    }
    if(lang == "pt"){ // listener expects to hear portuguese
      listener.lang = 'pt-PT';
    } else { // if lang is not either of these, defaults to english:
      listener.lang = 'en-US';
    }
    listener.interimResults = true;
    listener.continuous = true;

    speakButton.mousePressed( () => {
      $("#speak-out-text").text("");
      $("#speak-out-div").show();
      speakButtonPressed();
    }).mouseReleased( () => {
      stopAndClear();
    });

    speakButton.mouseOut( () => {
      stopAndClear();
    });




    function speakButtonPressed(){
      /*if(lang == "pt"){
      sqvamtqf.pause();
      sqvamtqf.currentTime = 0;
    } else {*/
    iywstc.pause();
    iywstc.currentTime = 0;
    //}
    listener.start();
  }

  listener.onresult = (event) => {
    speechToText = event.results[0][0].transcript;
    $("#speak-out-text").text('"' + speechToText + '"');
    //console.log(" *** *** " + speechToText);
    detectSelection(speechToText);
    //once the user has once pressed continuously, change the instructions behind this button:
    //$('#speak').tooltipster('content', 'then observe what happens').tooltipster('show');
  }

  /*
  *
  *     Change to new line of poem
  *
  */

  function changeTitle(){

    $('#' + passportMode.toString()).tooltipster('content', random(passportSentences[passportMode]));

  }


  /*
  *
  *     Detect which button was "pressed".
  *
  */

  function detectSelection(speechToText) {
    //checking against keywords:

    //@
    if(
      speechToText.includes("ficar aqui")
    || speechToText.includes("irei partir")
    || speechToText.includes("não preciso ir")
    || speechToText.includes("não quero ficar aqui")
    || speechToText.includes("nunca poderei sair")
    || speechToText.includes("to stay here")
    || speechToText.includes("my only choice")
    || speechToText.includes("never leave")
    || speechToText.includes("do not need to go")
    || speechToText.includes("do not want to stay here")
    || speechToText.includes("can never leave")
  ){
      document.getElementById("0").focus();

      //passportButtons[0].style('background-color', youParticle.particleBirthColor);
      passportMode = 0;
      //changeTitle(passportMode);
      //OR: can even call this changeTitle(),
      //since the value for passportMode has just been updated
      changeTitle();

      //this can change many times during one utterance, which is fine:
      //var newTitle = random(passportSentences[0]);
      //this approach allows more focus on the screen and bubbles:
      //$('#0').tooltipster('content', newTitle);
      //the problem with this approach is that the new sentence popping up
      //takes all the attention away from the bubbles on the screen:
      //$('#0').tooltipster('content', newTitle).tooltipster('show');
    }

    //€
    if(
      speechToText.includes("somos parecidos")
    || speechToText.includes("não tenho medo")
    || speechToText.includes("integramos algo")
    || speechToText.includes("outros são diferentes")
    || speechToText.includes("quem são os outros")
    || speechToText.includes("não podem entrar")
    || speechToText.includes("very similar")
    || speechToText.includes("not scared")
    || speechToText.includes("something greater")
    || speechToText.includes("others are different")
    || speechToText.includes("who are the others")
    || speechToText.includes("they cannot enter")
  ){
      document.getElementById("1").focus();
      passportMode = 1;
      changeTitle();

      /*var newTitle = random(passportSentences[1]);
      $('#1').tooltipster('content', newTitle).tooltipster('show');
      */
    }
    //>
    if(
      speechToText.includes("o descobrimento")
    || speechToText.includes("a colonização")
    || speechToText.includes("tem o poder")
    || speechToText.includes("quem está mais fraco")
    || speechToText.includes("era a nossa")
    || speechToText.includes("continua a nossa")
    || speechToText.includes("exploration and colonization")
    || speechToText.includes("position of power")
    || speechToText.includes("colonization and exploration")
    || speechToText.includes("conquer the")
    || speechToText.includes("was our land")
    || speechToText.includes("land continues to be ours")
  ){
      document.getElementById("2").focus();
      passportMode = 2;
      changeTitle();

      /*
      var newTitle = random(passportSentences[2]);
      $('#2').tooltipster('content', newTitle).tooltipster('show');
      */
    }
    //§
    if(
      speechToText.includes("fortaleza")
    || speechToText.includes("uma porta")
    || speechToText.includes("a não abro")
    || speechToText.includes("preciso ar")
    || speechToText.includes("respirar cá fora")
    || speechToText.includes("nasci aqui")
    || speechToText.includes("live in a fortress")
    || speechToText.includes("see a door")
    || speechToText.includes("do not open the door")
    || speechToText.includes("need air")
    || speechToText.includes("try to breathe out here")
    || speechToText.includes("was born here")
  ){
      document.getElementById("3").focus();
      passportMode = 3;
      changeTitle();

      /*
      var newTitle = random(passportSentences[3]);
      $('#3').tooltipster('content', newTitle).tooltipster('show');
      */
    }
    //⊙
    if(
      speechToText.includes("posso ir")
    || speechToText.includes("vou ir")
    || speechToText.includes("onde posso")
    || speechToText.includes("posso querer ir")
    || speechToText.includes("que fosse")
    || speechToText.includes("agora vou")
    || speechToText.includes("tenho terra")
    || speechToText.includes("wherever")
    || speechToText.includes("where ever")
    || speechToText.includes("will go")
    || speechToText.includes("may want to go")
    || speechToText.includes("I can go")
    || speechToText.includes("have no land")
  ){
      document.getElementById("4").focus();
      passportMode = 4;
      changeTitle();

      /*
      var newTitle = random(passportSentences[4]);
      $('#4').tooltipster('content', newTitle).tooltipster('show');
      */
    }
    //!
    if(
      speechToText.includes("muito medo de voltar")
    || speechToText.includes("posso voltar")
    || speechToText.includes("ninguém me espera")
    || speechToText.includes("a minha terra")
    || speechToText.includes("já não é minha")
    || speechToText.includes("já não é minha")
    || speechToText.includes("scared of returning")
    || speechToText.includes("can never return")
    || speechToText.includes("waiting for me")
    || speechToText.includes("no longer wanted")
    || speechToText.includes("miss what is or was mine")
    || speechToText.includes("no longer needed")
  ){
      document.getElementById("5").focus();
      passportMode = 5;
      changeTitle();

      /*
      var newTitle = random(passportSentences[5]);
      $('#5').tooltipster('content', newTitle).tooltipster('show');
      */
    }

  }// close function detectSelection

} // close if ( isSpeechRecognitionSupported



} // close doInterface()


/*
*
*     Play iywstc.
*
*/

function iywstcPlay(){
    iywstc.volume(0.1);
    iywstc.loop = false;
    iywstc.play();
} // close function iywstcPlay()
