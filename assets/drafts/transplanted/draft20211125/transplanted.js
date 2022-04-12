  let a = "💔";
  var listener, canvas, heartButton, speakingToMyHeart, infoButton, url, language, thoughts;

function preload() {

  // Nothing besides load calls (loadImage, loadJSON, loadFont, loadStrings, etc.) should be inside the preload function

  language = 'fi'; //or set this using a button when you support more languages

  var isSpeechRecognitionSupported = false;
  try {
    //disable all of this if window doesn't have webkitSpeechRecognition or SpeechRecognition
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    listener = new SpeechRecognition;
    isSpeechRecognitionSupported = true;
  } catch (err) {
    //console.log("Speech recognition is not supported");
  }

  if (isSpeechRecognitionSupported){
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    listener = new SpeechRecognition;
    listener.lang = 'fi-FI';
    listener.interimResults = true;
    listener.continuous = true;

    listener.onresult = (event) => {
      speakingToMyHeart = event.results[0][0].transcript;
      //console.log(speakingToMyHeart);
      $("#questions").html('" <em>' + speakingToMyHeart.toLowerCase() + '<em> ? "');
      //console.log(" *** *** " + speechToText);
      if(event.results[0].isFinal){
        whatDidTheyAskUs(speakingToMyHeart.toLowerCase());
        stopAndClear();
      }
    }
  }

  url = 'assets/audio/' + language + '/' + 'thoughts.json';
  thoughts = loadJSON(url);

}

function setup(){
  doInterface();
} //close setup

function draw(){
}
