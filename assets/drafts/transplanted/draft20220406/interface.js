/*
*  Transplanted (2021 - 2022 -?)
*  by Terhi Marttila
*
*  Transplanted is about missing past and future/current homes.
*  A reflection on the ambivalent emotions caused by being transplanted.
*
*  Project credits and acknowledgments:
*
*  Terhi Marttila: concept, programming, texts, voice (acting?)
*  Tero Marttila: the core logics of the code in function play() which I copied from Give me a Reason (2016)
*  Diogo Cocharro: for borrowing the recording equipment (audio interface, microphone and stand)
*  Miikka Laihinen: nokturno.fi editor 2022 onwards for all support related to
*  publishing Transplanted in nokturno. I especially thank Miikka for the push to
*  include english subtitles, because the subtitles (and the speech input in English)
*  make the work accessible to a broader audience
*  Virpi Vairinen: the previous editor of nokturno.fi for initially accepting
*  Transplanted for publication in early December of 2021
*
*  Satu Miettinen, Heidi Pietarinen, Melanie Sarantou, Tomi Knuutila, Outi Valanto:
*  Such a huge thanks to Satu Miettinen for inviting me to participate in the
*  group exhibition. The conversations that unfolded over the messaging service for the
*  Growth, Death and Decay exhibition were absolutely crucial towards the development
*  of Transplanted. I was very inspired by the work of my artist collegues, who
*  were working with plants and with roots, Melanie was succesfully planting
*  sunflower seeds in Lapland in moist wool (!!!) and that's one of the reasons
*  why I started thinking of migratory movement through the concept of
*  transplanting, roots, the rhizome, and so on. For me, this exchange,
*  of work in progress and ideas amongst the participating artists, was in itself
*  a central methodological approach for my artistic research. Besides the
*  intellectual exchange, the collaboration involved lots of laughs and humor,
*  which was much needed especially in early 2021 during the second COVID lockdown.
*
*  This work was initially created for the Growth, Death and Decay -exhibition
*  which took place on 9. - 25.11.2021 in Galleria Hämärä, Rovaniemi, Lapland
*  (University of Lapland)
*
*  Additional elements were created for the publication on Nokturno.fi in March of 2022
*  including: English subtitles, possibilty to interact/speak in English,
*  the ∞-mode, new recordings (mosquito, ocean, wind, 'kaipaan'-"song"),
*  refactoring and rewriting some of the code, code comments.
*
*  This work is part of the doctoral dissertation of Terhi Marttila at the University
*  of Porto, Portugal (digital media) which will be defended in early 2022.
*  The doctoral dissertation is available at terhimarttila.com/migration-as-movement
*  or somehwere at github.com/trhi
*
*  This work was financially supported by: Operation NORTE-08-5369-FSE-000049
*  co funded by the European Social Fund (FSE) through
*  NORTE 2020 - Programa Operacional Regional do NORTE.
*
*  The h-ear-t image and audio recordings are copyright Terhi Marttila and are
*  not allowed to be used in any way, shape or form ever anywhere. Not for
*  non-commercial purposes, not for commercial purposes. Please contact me if you
*  want to invite the work for exhibition etc.
*
*  Nor are you allowed to copy this work as a whole and present it on a website
*  without my consent.
*
*  The code itself and the concept, ie: organising snippets under structures,
*  then randomly selecting structures and then playing back audio is licenced
*  under CC BY 4.0 - ie. you are welcome to copy any of this code and use it in
*  whatever way you want. I appreciate if you mention my work as an inspiration
*  or a reference, and I will be happy to hear of any work that is in part inspired
*  by or based on my work.
*
*/

var canvas, heartButton, speakingToMyHeart, infoButton, finnishButton, englishButton, infinityButton, url, language, thoughts;
var keywords = [], structure = [];
var infinity;

function doInterface(){

  canvas = createCanvas(windowWidth, windowWidth);
  canvas.style('display', 'block');
  canvas.id('canvas');
  background("transparent");

  //infoButton to display instructions on how to use the piece:
  infoButton = createButton('i');
  infoButton.addClass('infobutton');

  //infinityButton for infinite musing by Transplanted:
  infinity = false; //by default, Transplanted is *not* in infinity mode
  infinityButton = createButton('∞');
  infinityButton.id("select-infinity");
  infinityButton.mouseOver( () => {
    if (language == 'en'){
      $("#infinity-button-info-en").show();
    }
    if (language == 'fi'){
      $("#infinity-button-info-fi").show();
    }
  }).mouseOut( () => {
    if (language == 'en'){
      $("#infinity-button-info-en").hide();
    }
    if (language == 'fi'){
      $("#infinity-button-info-fi").hide();
    }
  });

  infinityButton.mousePressed( () => {

    if(!infinity){
      $("#answers").stop(true, true).empty().hide();
      //when infinityButton is selected, change background to pink (selected):
      infinityButton.style("background: #ff1e8c");
      infinityButton.style('filter', 'drop-shadow(0 0 0.5rem #ff1e8c');
      infinity = true;
      listener.stop();

      //while infinity mode is on, person cannot speak to Transplanted:
      heartButton.mousePressed( () => console.log("disbaled heartButton") );

      if(infinity){ //once infinity mode is turned on, museAboutBeingTransplanted("infinity"):
        museAboutBeingTransplanted("infinity");
      }

    }else{
    //turn off infinityButton:
      infinityButton.style("background: white");
      infinityButton.style("filter: none");
      infinity = false;
      $('#audio').empty();
      $("#answers").stop(true, true).empty().hide(); //empty the poems

      //and then enable heartButton again:
      heartButton.mousePressed( () => listenToMyHeart() )
      .mouseReleased( () => stopAndClear() )
      .mouseMoved( () => stopAndClear() )
      .mouseOut( () => stopAndClear() );
    }

  });

  //finnishButton: speak to Transplanted in Finnish, no transcript visible
  finnishButton = createButton('fi');
  finnishButton.id('select-finnish');
  finnishButton.style("background: #1e8cff"); //it is selected by default
  finnishButton.style('filter', 'drop-shadow(0 0 0.5rem #1e8cff');
  finnishButton.mouseOver( () => {
    $("#finnish-button-info").show();
  }).mouseOut( () => {
    $("#finnish-button-info").hide();
  });

  finnishButton.mousePressed( () => {
    listener.stop();
    $("#answers").stop(true, true).empty().hide();

    if(language == 'en'){ //if in english atm, change to finnish:
      $("#answers").stop(true, true).empty().hide();
      language = 'fi';
      finnishButton.style("background: #1e8cff"); //change background of finnishButton to blue (selected)
      finnishButton.style('filter', 'drop-shadow(0 0 0.5rem #1e8cff');
      englishButton.style('filter', 'none'); //change background of englishButton to white (not selected)
      englishButton.style("background: white");
    }
  });

  //englishButton: speak to Transplanted in English, and English translation of transcript visible
  englishButton = createButton('en');
  englishButton.id('select-english');
  englishButton.mouseOver( () => {
    $("#subtitles-button-info").show();
  }).mouseOut( () => {
    $("#subtitles-button-info").hide();
  });

  englishButton.mousePressed( () => {
    listener.stop();
    $("#answers").stop(true, true).empty().hide();
    if(language == 'fi'){
      language = 'en';
      englishButton.style("background: #FFD500"); //change background of englishButton to yellow (selected)
      englishButton.style('filter', 'drop-shadow(0 0 0.5rem #FFD500');
      finnishButton.style('filter', 'none'); //change background of finnishButton to white (not selected)
      finnishButton.style("background: white");
    }
  });

  infoButton.mouseOver( () => {
      if(language == 'fi'){
        $("#instructions-fi").show();
      } else if (language == 'en'){
        $("#instructions-en").show();
      }
    })
  .mouseOut( () => {
    $('#instructions-fi').hide();
    $("#instructions-en").hide();
    });

  heartButton = createImg('assets/images/h-ear-t.png');
  heartButton.parent('heartDIV');
  heartButton.style("visibility: visible");
  heartButton.addClass('h-ear-tButton');
  heartButton.mousePressed( () => listenToMyHeart() )
  .mouseReleased( () => stopAndClear() )
  .mouseMoved( () => stopAndClear() )
  .mouseOut( () => stopAndClear() );
}

function stopAndClear(){
  $("#questions").css('opacity', '0.3');
  heartButton.attribute('src', 'assets/images/h-ear-t.png')
  listener.stop();
}

function listenToMyHeart() { //activated once person presses the h-ear-t:
  $("#answers").stop(true, true).empty().hide();
  $("#questions").show();
  $("#questions").text('');
  $("#questions").css('opacity', '1');
  $("#questions").text('" 🎤  "'); // 🗣️  🎤
  heartButton.attribute('src', 'assets/images/h-ear-t.gif');
  listener.start();
}

function museAboutBeingTransplanted(whatTheyAskedUs){

  if(!infinity){
    $("#answers").stop(true, true).empty().hide();
  }

  //identify any keywords spoken:
  if(language == 'fi'){
    keywords = whatTheyAskedUs.match(/miksi|mitä|miten|missä|tänne|tääl|tässä|siellä|paikka|järv|metsä|hytty|mer|rihmasto|juur|kasv|maas|muut|elämä|kaip|kaiv|tunn|tunt|viih|ihmi/ig);
  } else if (language == 'en'){
    keywords = whatTheyAskedUs.match(/why|what|how|where|here|there|place|lake|forest|mosquit|ocean|rhizome|root|grow|ground|move|life|miss|feel|familiar|enjoy|human/ig);
  }

  var structure = [];
  if( whatTheyAskedUs.match(/8infinity8/ig) ){
    //if it is in infinity mode: create a new random structure of 8:
    for(let inf = 0; inf < 8; inf++){
      let randomCategory = random(structures[0]);
      structure.push( randomCategory );
    }
    keywords = ['infinity'];
  } else {
    //select structure from the preconceived ones:
    structure = random(structures);
  }

  //selects some thoughts to playback based on these keywords:
  var selections = selectThoughts(keywords, structure);
  //fades out the transcript of the persons speech:
  $("#questions").fadeOut( 2000 );
  play(selections);

}

function selectThoughts(keywords, structure){

  //for the first element, find concordance with keywords
  //for the following ones, choose random ones
  var l, j, k, selections = [], matches = [];
  for(l=0; l < structure.length; l++){
    //if I pass it keywords=null and structure = [], then it will do: selections.push(random(i)) == random interjection..
    if(l==0){ //choose the first random musing so that it matches a keyword in the users speech
      if(keywords == null || keywords[0] == '8infinity8'){
        //if the system doesn't recognise any keywords,
        //just choose an interjection (a small response, a musing... but no huge response):
        //OR if its in inifity mode: just push a random element
        selections.push(random(i));
        if(keywords == null){
          l=1000; //so that it breaks out of the for loop after selecting just one interjection, in case the person spoke nonsense
        }
      } else { //find all the sentences where a keyword occurs
          for(j=0; j<structure[l].length; j++){
            for(k=0; k<keywords.length; k++){
                  if(language == 'fi'){
                    if(structure[l][j].text.includes(keywords[k]) ){
                    //push all the matches:
                    matches.push(structure[l][j]);
                }
              } else if (language == 'en'){
                  if(structure[l][j].subtitleEN.includes(keywords[k]) ){
                  //push all the matches:
                  matches.push(structure[l][j]);
                }
              }
            }
          }
          if(matches.length === 0){ //if there isn't any match, just push a random element:
            selections.push(random(structure[l]));
          } else { //select a random sentence from the matches:
            selections.push(random(matches));
          }
      }

    } else {
      //after selecting the first sentence as one that concords with what the
      //person says, then just select random ones according to the chosen structure:
      selections.push(random(structure[l]));
    }
  }

  return selections;
}

//Credits of this method go to TNT, courtesy of Tero Marttila (August of 2016)
//The code in play() is copied from Give me a Reason, which was written by
//Tero Marttila in August of 2016 when we refactored my otherwise functional code:
//of course it has been adapted here to the necessities of this work:
function play(selections){
  var audioDiv = $('#audio');
  audioDiv.empty();
  var loading = 0;
  var playing = 0;

  function playNext(){
    audios[playing].play();
    if(language == 'en'){
      $("#answers").show();
      $("#answers").append("<span>" + audios[playing].getAttribute('subtitleEN') + "</span>", "<br>");

      if(infinity){
        //once 8 lines are displayed, remove the first one (and thereby "scroll" all lines upwards):
        if($("#answers").children().length == 18 ){
          $("#answers").children().slice(0, 2).remove();
        }
      } else { //if not in infinity mode, fade out answers/lines:
        $("#answers").fadeOut( 40000 , () => $("#answers").hide() );
      }
    }
  }

  var audios = $.map(selections, function(thought){
    //map=iterate through all the selections and create an audio element for each
    //with event handlers that control when to move onto playing the next audio
    loading++;

    //set infinity button text content to 8 while the audio files are loading:
    if(loading == 1){
      infinityButton.html('⧖'); //alternatives: ⧖ ⏱ ◷◶◵◴
    }

    var audio = $( "<audio></audio>", {
      src: thoughts.path+thought.filename,
      txt: thought.text,
      subtitleEN: thought.subtitleEN,
      preload: 'auto',
      on: {
        canplaythrough: function(event){
          loading--;
          if(loading === 0){
            playNext();
            infinityButton.html('∞'); //set button back to ∞ ones all audio loaded:
          }
        },//close canplaythrough:
        ended: function(event){
          playing++;
          if(playing<audios.length){
            playNext();
          } else {
              if(infinity){//if in infinity mode mode:
                //once all have been played: start a new cycle of infinity (ie. 8 musings):
                museAboutBeingTransplanted("8infinity8");
              }
          }
        }//close ended:
      }//close on:
    });//close var audio
    audioDiv.append(audio);
    return audio[0];
  });//close map

}//close play

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
