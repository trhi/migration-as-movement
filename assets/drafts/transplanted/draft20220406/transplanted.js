  var listener;
  var a = [], i = [], q = [], structures = [];
  let isSpeechRecognitionSupported = false; //false until proven true

function preload() {

  language = 'fi'; //set to Finnish by default, but possible to change to english using the "en"-button

  try {
    //disable all of this if window doesn't have webkitSpeechRecognition or SpeechRecognition
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    listener = new SpeechRecognition;
    isSpeechRecognitionSupported = true;
  } catch (err) {
    //console.log("Speech recognition is not supported");
    window.alert("Please view this work in Chrome");
  }

  if (isSpeechRecognitionSupported){

        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        listener = new SpeechRecognition;
        listener.lang = 'fi-FI'; //set to Finnish by default
        listener.interimResults = true;
        listener.continuous = true;

        listener.onresult = (event) => {
          speakingToMyHeart = event.results[0][0].transcript;
          //display transcript on screen:
          $("#questions").html('" <em>' + speakingToMyHeart.toLowerCase() + '<em> ? "');
          if(event.results[0].isFinal){
            //based on what the user spoke to the heart, museAboutBeingTransplanted:
            museAboutBeingTransplanted(speakingToMyHeart.toLowerCase());
            stopAndClear();
          }
        }

      //in p5/preload() this will load before going into setup:
      url = 'assets/audio/' + language + '/' + 'thoughts.json';
      thoughts = loadJSON(url);

    }//end if(isSpeechRecognitionSupported)

}//end preload()

function setup(){
  //these are all arrays of audio snippets:
  a = thoughts.answers;
  i = thoughts.interjections;
  q = thoughts.questions;
  //this is in turn an array of arrays:
  //ie. different structures for the musings:
  structures = [
    [a, q, i],
    [a, a, i],
    [a, i, a, a, a, q],
    [a, a, a, i, q, i],
    [i, a, a, a, a, q, i, a, a, q],
    [i, q, a, a],
    [i, i, a, q],
    [i, i, i, q],
    [i, a, a, i],
    [q, a, i],
    [q, a, a, a, i, a, q],
    [q, i, q],
    [q, i, a, a, a, i, q],
    [q, q, i]
  ];
  if (isSpeechRecognitionSupported){
    doInterface();
  }
} //close setup

function draw(){
  //oops, didn't make any use of this... BUT preload() was useful! as are
  //other p5.js methods, such as random()
  //this is me, cherrypicking from HTML5, p5.js and jquery :D
}
