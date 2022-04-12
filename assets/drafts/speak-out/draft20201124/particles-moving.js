//this is the drawing border around the world
var drawingBorderX = 0;
var drawingBorderY = 0;

//it looks absolutely wonderful when it spans a really huge width and
//you need to scroll around to see it all!
//BUT with so much canvas and so many sites, processing it all gets really slow
var canvasX = 1000;
var canvasY = 600;

var canvasX = window.innerWidth - 20;
var canvasY = window.innerHeight - 20;
//window.innerWidth;
//var h = window.innerHeight;

var myCanvas;


const zones = 12; //max 12, as there are 12 colors on the palette
var randomSites = [];
var theWorld; //global variable, can be accessed from particle.js
var theWorldSites = []; //this is an array of p5.Vectors in order of cellID
var particles = [];
var repulsors = [];
var repulsorQualities = ["a bad thing"];

var attractors = [0];
//to give weight to creating particles that are attracted to nothing:
var attractorQualities = [];
var attractorQualitiesEN = ["nothing", "nothing", "nothing", "nothing", "nothing",
"a good thing", "yourself", "the impossible", "myself", "my true self",
"work", "work", "work", "work", "work", "work", "work", "work", "work", "work",
"my retirement",
"opportunity", "love", "shelter", "food",
"health",
"money", "lots of money", "some money", "a coin",
"a home", "a house", "a shelter", "a roof over my head", "a piece of land",
"a job", "a clothing store", "a park", "study",
"dignity", "freedom", "to do what I love", "to love what I do", "a place to breathe",
"peace", "some peace of mind", "some time for myself", "time", "some time",
"exploration", "a mountain", "a better life",
"a flower shop", "a supermarket", "ikea", "coca cola dreams"];

var attractorQualitiesPT = ["nada", "nada", "nada", "nada", "nada",
"o impossível", "eu próprio", "ela", "ele",
"uma coisa boa", "uma surpresa",
"a minha família",
"o autocarro", "o onibus", "o meu carro",
"trabalho", "trabalho", "trabalho", "trabalho", "trabalho", "trabalho", "emprego",
"almoço", "jantar", "comida", "um café",
"algo", "?", "?", "?",
"a escola", "a universidade", "o creche", "o lar", "o escritório", "a obra",
"dinheiro", "um pouco dinheiro", "muito dinheiro",
"tempo para mim", "tempo", "mais tempo",
"uma casa", "um abrigo", "um terreno",
"um parque", "o meu sonho", "uma floresta",
"ikea", "uma loja", "um café", "uma florista",
"liberdade", "um sítio seguro", "respirar sem medo", "um começo", "um começo", "um começo", "um começo", "um começo"];
var you = ["You"];
var youParticle;

var passportModes = ["monochromatic", "analogous", "complementary", "triad", "all"];
//var passportMode = passportModes[1];
var passportMode = 1;


var worldColors = [];
var worldColorsNumberCodes = [];
var worldGIndex = [];

var paletteCopy = [
  [255, 223, 0, 127], // yellow
  [241, 181, 11, 127], // yellow orange
  [241, 135, 29, 127], // orange
  [241, 97, 33, 127], // orange red
  [241, 39, 39, 127], // red
  [200, 2, 134, 127], // red purple
  [109, 36, 139, 127], // purple
  [68, 54, 162, 127], // purple blue
  [18, 120, 196, 127], // blue
  [0, 168, 196, 127], // blue green
  [0, 142, 91, 127], // green
  [139, 186, 37, 127], // green yellow
]

var palette1 = [
  [255, 0, 153, 127], // pink
  [0, 153, 153, 127], // turquoise
  [255, 255, 102, 127], // light yellow
  [153, 51, 204, 127], // purple
  [51, 204, 255, 127], // light blue
  [255, 153, 0, 127], // orange
  [0, 204, 153, 127], // light green
  [255, 0, 102, 127], // red
  [255, 204, 102, 127], // light orange
  [51, 153, 255, 127], // dark blue
  [255, 153, 153, 127], // light red
  [204, 102, 204, 127] // light purple
]

var paletteOriginal = [
  [255, 223, 0, 127], // yellow
  [241, 181, 11, 127], // yellow orange
  [241, 135, 29, 127], // orange
  [241, 97, 33, 127], // orange red
  [241, 39, 39, 127], // red
  [200, 2, 134, 127], // red purple
  [109, 36, 139, 127], // purple
  [68, 54, 162, 127], // purple blue
  [18, 120, 196, 127], // blue
  [0, 168, 196, 127], // blue green
  [0, 142, 91, 127], // green
  [139, 186, 37, 127], // green yellow
]

var palette = [
  [255, 223, 0, 117], // yellow
  [241, 181, 11, 117], // yellow orange
  [241, 135, 29, 117], // orange
  [241, 97, 33, 117], // orange red
  [241, 39, 39, 117], // red
  [200, 2, 134, 117], // red purple
  [109, 36, 139, 117], // purple
  [68, 54, 162, 117], // purple blue
  [18, 120, 196, 117], // blue
  [0, 168, 196, 117], // blue green
  [0, 142, 91, 117], // green
  [139, 186, 37, 117], // green yellow
]

var paletteVeryPale = [
  [255, 223, 0, 100], // yellow
  [241, 181, 11, 100], // yellow orange
  [241, 135, 29, 100], // orange
  [241, 97, 33, 100], // orange red
  [241, 39, 39, 100], // red
  [200, 2, 134, 100], // red purple
  [109, 36, 139, 100], // purple
  [68, 54, 162, 100], // purple blue
  [18, 120, 196, 100], // blue
  [0, 168, 196, 100], // blue green
  [0, 142, 91, 100], // green
  [139, 186, 37, 100], // green yellow
]

/*
var analogous = [
  [223, 181, 135, 97],
  [181, 223, 135, 97],
  [135, 223, 181, 97],
  [97, 223, 181, 135],
  [39, 97, 2, 36],
  [2, 39, 36, 54],
  [36, 2, 54, 120],
  [54, 36, 120],
  [120, 54, 168, 142],
  [168, 120, 142, 186],
  [142, 168, 186, 223],
  [186, 142, 223]
];
*/

var analogous = [
    [223, 181, 135, 97],
    [181, 223, 135, 97],
    [135, 223, 181, 97],
    [97, 223, 181, 135],
    [39, 97, 2, 36],
    [2, 39, 36, 54],
    [36, 2, 54, 120],
    [54, 36, 120],
    [120, 54, 168, 142],
    [168, 120, 142, 186],
    [142, 168, 186, 223],
    [186, 142, 223]
];

var analogousColors = [
  [223, 181, 135, 97],
  [181, 223, 135, 97],
  [135, 223, 181, 97],
  [97, 223, 181, 135],
  [39, 97, 2, 36],
  [2, 39, 36, 54],
  [36, 2, 54, 120],
  [54, 36, 120],
  [120, 54, 168, 142],
  [168, 120, 142, 186],
  [142, 168, 186, 223],
  [186, 142, 223]
];

var complementaryColors = [
  [223, 36],
  [181, 54],
  [135, 120],
  [97, 168],
  [39, 142],
  [2, 186],
  [36, 223],
  [54, 181],
  [120, 135],
  [168, 97],
  [142, 39],
  [186, 2]
];

var complementary = [
  [223, 36],
  [181, 54],
  [135, 120],
  [97, 168],
  [39, 142],
  [2, 186],
  [36, 223],
  [54, 181],
  [120, 135],
  [168, 97],
  [142, 39],
  [186, 2]
];

var triadColors = [
  [223, 39, 120],
  [181, 2, 168],
  [135, 36, 142],
  [97, 54, 186],
  [39, 120, 223],
  [2, 168, 181],
  [36, 142, 135],
  [54, 186, 97],
  [120, 223, 39],
  [168, 181, 2],
  [142, 135, 36],
  [186, 97, 54]
];

var triad = [
  [223, 39, 120],
  [181, 2, 168],
  [135, 36, 142],
  [97, 54, 186],
  [39, 120, 223],
  [2, 168, 181],
  [36, 142, 135],
  [54, 186, 97],
  [120, 223, 39],
  [168, 181, 2],
  [142, 135, 36],
  [186, 97, 54]
];

//var mic;

var lang = "pt"; //use this to set the language of the speech recogniser as well

var passportButtons;

var speechToText = "";
var speechDetected = false;

function setup() {

  attractorQualities = [...attractorQualitiesPT];
  if (window.parent.location.href.indexOf("/en/") > -1) {
        lang = "en";
        attractorQualities = [...attractorQualitiesEN];
        //console.log("Changed attractorQualities to attractorQualitiesEN!");
  } else {
        lang = "pt";
        attractorQualities = [...attractorQualitiesPT];
        //console.log("Changed attractorQualities to attractorQualitiesPT!")
  }
  //console.log("Language of the parent window is:" + lang);

  myCanvas = createCanvas(canvasX, canvasY);
  //for some reason, I have noSmooth() here!! why??
  //noSmooth();

  //had frameRate(19); changed to frameRate(50);
  //to see how the program processes the particles
  //at a higher frame rate: does it get smoother?
  frameRate(30);
  //outsourced to its own function for sake of code simplicity
  doVoronoiSetupStuff();

  var audioElement = createAudio('sound/iywstc-XX.mp3');
  //audioElement.autoplay(true);
  //console.log("Created audioElement. It is:");
  //console.log(audioElement);

  /*
  //if using the words "passport"/"passaporte" in the buttons:

  if (lang="pt") {

        passport0 = createButton("passaporte A", 0);//monochromatic = 0
        passport1 = createButton("passaporte B", 1);//analogous = 1
        passport2 = createButton("passaporte C", 2);//complementary = 2
        passport3 = createButton("passaporte D", 3);//triad = 3
        passport4 = createButton("passaporte E", 4);//all = 4
        passport5 = createButton("passaporte F", 5);//all but my own = 5


  } else if (lang="en"){
        passport0 = createButton("passport A", 0);//monochromatic = 0
        passport1 = createButton("passport B", 1);//analogous = 1
        passport2 = createButton("passport C", 2);//complementary = 2
        passport3 = createButton("passport D", 3);//triad = 3
        passport4 = createButton("passport E", 4);//all = 4
        passport5 = createButton("passaporte F", 5);//all but my own = 5

  }
  */

  passport0 = createButton("A", 0);//monochromatic = 0
  passport1 = createButton("B", 1);//analogous = 1
  passport2 = createButton("C", 2);//complementary = 2
  passport3 = createButton("D", 3);//triad = 3
  passport4 = createButton("E", 4);//all = 4
  passport5 = createButton("F", 5);//all but my own = 5

  let buttonDiv = createDiv();
  passport0.class("passportButton");
  passport1.class("passportButton");
  passport2.class("passportButton");
  passport3.class("passportButton");
  passport4.class("passportButton");
  passport5.class("passportButton");

  passportButtons = selectAll(".passportButton");
  for (let i = 0; i < passportButtons.length; i++) {
        passportButtons[i].parent(buttonDiv);
        //if just A, B, C, etc:
        passportButtons[i].size(40, 40);
        //if with words passaporte/passport:
        //passportButtons[i].size(120, 40);
        passportButtons[i].style("cursor", "hand");
        passportButtons[i].style("border", "3px solid black");
        passportButtons[i].style("border-radius", "50px");
        passportButtons[i].style("background-color", "white");
        passportButtons[i].style("font-weight", "bold");
        passportButtons[i].mousePressed(passportChosen);

        //if just A, B, C, etc:
        passportButtons[i].position(canvasX-50, i*50+30);
        //if with words passaporte/passport:
        //passportButtons[i].position(canvasX-130, i*50+30);
        passportButtons[i].id(i);
  }

  //buttonDiv.hide();
  //console.log("hid button div");

  function passportChosen() {
        //passportMode = passportID;
        //this.value();
        //console.log("This is what the function passed to me: ");
        //console.log(this.id());
        passportMode = this.id();
        for (let i = 0; i < passportButtons.length; i++) {
            passportButtons[i].style("background-color", "white");
            passportButtons[i].style("color", "black");
        }
        this.style("background-color", "#3333cc");
        this.style("color", "white");
        //console.log("Passport changed to: " + passportMode);
  }


  //create i-button:
  button = createButton("i");
  //button.size(30);
  button.size(40,40);
  button.position(canvasX-50, canvasY-50);
  button.style("border-radius", "50%");
  button.mousePressed(infobuttonPressed);
  button.style("cursor", "pointer");
  button.style("border", "3px solid black");
  //button.style("color", "white");
  button.style("background-color", "white");
  button.style("background-color", "white");
  button.style("font-weight", "bold");

  var speak;

  if(lang="pt"){
        speak = createButton("Quero falar");
  } else if (lang="en"){
        speak = createButton("Speak out");
  }
  //window.innerWidth
  //RETHINK THIS!
  //speak.id("speak");
  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  if(!is_chrome) {
        speak.hide();
  }
  speak.position(window.innerWidth-170, window.innerHeight-70);
  speak.style("cursor", "pointer");
  speak.style("border-radius", "50px");
  speak.style("background-color", "white");
  speak.size(90,40);
  speak.style("border", "3px solid black");
  speak.style("font-weight", "bold");
  speak.mousePressed(speakButtonPressed);

  //might be best to just work directly with the speechrecogniser element
  //instead of the p5.js wraparound...


    /*
    //WORKS:
    //create a button
    //once pressed, this button initiates voice capture:
    button = createButton('speak');
    button.position(canvasX-100, canvasY-50);
    button.mousePressed(listenToMe);

    //initialise the microphone connect
    mic = new p5.AudioIn();
    */

    /*
    *
    *     Listen To Me -button
    *
    */

    //unfortunately the p5 implementation wraps around an implementation
    //of the SpeechRecognition API that creates an instance of
    //webkitSpeechRecognition. For this reason, the new p5.SpeechRec()
    //will create a new recogniser that only works in chrome.
    //In order to work in firefox (after having enabled the flags through
    //about:config), we would need to create the instance of the speech
    //recogniser as:
    //var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    //thus firefox could point the SpeechRecognition variable to
    //SpeechRecognition, while chrome could point to webkitSpeechRecognition
    //var foo = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)
    //foo.onResult = showResult; // bind callback function to trigger when speech is recognized
    //foo.start(); // start listening
    //every time that the user clicks this button,
    //they also have to allow the recogniser to listen to them...
    //OR: continous recognition, BUT, only when the user holds down the mouse
    //is when we log the recognition results.
    //foo.continuous = true;
    //button.mousePressed(listenToMe);
    //setTimeout(foo.start(), 200);
    //foo.onEnd = restart;

    /*function restart(){
      console.log("Restarting recognition");
      foo.start();
    }

    function listenToMe()
    {
      //foo.start();
    }

    function showResult()
    {
      console.log(foo.resultString); // log the result
    }
    */

    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    var listener = new SpeechRecognition;
    if(lang == "en"){//listener expects to hear english
          listener.lang = 'en-US';
    }
    if(lang == "pt"){//listener expects to hear portuguese
          listener.lang = 'pt-PT';
    }
    listener.interimResults = true;
    var transcript = '';
    var final_transcript = '';

    //var foo = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)
    //foo.onResult = showResult; // bind callback function to trigger when speech is recognized
     // start listening
    //console.log("Started listening");

      /*
            n.b. p5.SpeechRec() won’t work unless using a secure (HTTPS) server.
            if you never get a prompt from the browser to allow access to your microphone,
            that should be the first thing you troubleshoot.
      */

  var intervalId;
  speak.mousePressed( () => {
        speakButtonPressed();
        intervalId = setInterval(do_something, 30);
        //speakButtonPressed();
        //console.log("Started listening");
  }).mouseReleased( () => {
        clearInterval(intervalId);
        //console.log("Mouse was released");
        speak.style("background-color", "white");
        speak.style("color", "black");
        listener.stop();
        speechDetected = false;
        speechToText = "";
        //console.log(" *** Stopping listener");
        //console.log(" *** speechDetected is now: " + speechDetected);
        //foo.stop(); //this is not a method in p5.speech...
        //speak.style("textContent", "Speak out");
  });
  speak.mouseOut( () => {
        clearInterval(intervalId);
        //speechDetected = false;
        //console.log(" *** mouseOut of button");
        //console.log(" *** speechDetected is now: " + speechDetected);
  });


  listener.onresult = (event) => {
      speechDetected = true;
      speechToText = event.results[0][0].transcript;
      //console.log(" *** *** " + speechToText);
      //THIS WORKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if(speechToText === "Eu quero ter acesso ao todo o mundo"){
            //console.log("They said the right thing!");
            for (let i = 0; i < passportButtons.length; i++) {
                passportButtons[i].style("background-color", "white");
                passportButtons[i].style("color", "black");
            }
            passport4.style("background-color", "#3333cc");
            passport4.style("color", "white");
            passportMode = 4;
      }
  }

  /*
  function showResult(){
        console.log(foo.resultString);
  }
  */

  function do_something() {
        //console.log("Mouse is pressed down continually");
        //speak.class("active");
        //colors the button red while it is being held down
        //the idea here would be to "activate" speech recognition ONLY
        //when the user is holding down the *(microphone icon)
        speak.style("color", "white");
        //speak.style("textContent", "Listening...");
        speak.style("background-color", "#3333cc");

        textSize(20);
        text("Eu quero ter acesso ao todo o mundo", canvasX-400, 4*50+47);
        //speak.style("background-color", "red");
        //speak.style();
        /*
        if(speechDetected == true){
              showRecognitionResults();
              console.log("*** *** " + speechToText);
              console.log("speechDetected is now: " + speechDetected);
              textSize(54);
              fill("black");
              text(speechToText, 20, 60);
        }
        */
        //DISPLAY INTERIM RESULTS!

  }

  function speakButtonPressed(){
        //console.log("Speak out button pressed!");
        //speak.html("Listening...");
        audioElement.pause();
        audioElement.currentTime = 0;
        //display instructions for what to say in order to select
        //a passport:
        //eg. E: Eu quero ter acesso ao mundo todo!
        //textSize(54);
        //text("Eu quero ter acesso ao mundo todo", canvasX-200, 4*50+30);
        listener.start();
        //console.log(" *** Starting listener");
  }

  //make a nicer track for
  function infobuttonPressed(){
        //console.log("infobutton pressed!");
        audioElement.volume(0.02);
        audioElement.loop = false;
        audioElement.play();
  }

} // close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()
// close setup()// close setup()// close setup()// close setup()// close setup()

function doVoronoiSetupStuff(){


    /*
    *
    *   Initialise world based on voronoi
    *
    */

    //create randomSites for the voronoi diagram
    createRandomSites();

    //Settings for drawing(these are the default values)
    //Set Cell Stroke Weight
    voronoiCellStrokeWeight(1);
    //Set Site Stroke Weight
    voronoiSiteStrokeWeight(0);
    //Set Cell Stroke
    voronoiCellStroke(0);
    //Set Site Stroke
    voronoiSiteStroke(0);
    //Set flag to draw Site
    //voronoiSiteFlag(true);

    //Maximum distance between jitters
    voronoiJitterStepMax(20);
    //Minimum distance between jitters
    voronoiJitterStepMin(5);
    //Scales each jitter
    voronoiJitterFactor(3);
    //Jitter edges of diagram
    voronoiJitterBorder(false);

    //after running createRandomSites();
    //set the voronoiSites
    //this method is not adding the sites in randomSites[]
    //in the same order! WHY NOT?
    /*
    for(var i=0; i<randomSites.length;i++){
      voronoiSite(randomSites[i]);
    }
    */

    voronoiSites(randomSites);

    //Compute voronoi diagram with size 500 by 300
    //Without a prepared jitter structure (false)
    voronoi(canvasX - drawingBorderX, canvasY - drawingBorderY, false);

    //Draw diagram in coordinates 0, 0,
    //filled (true), without jitter (false)
    voronoiDraw(drawingBorderX, drawingBorderY, true, false);
    //voronoiDraw(0, 0, true, false);

    //save the voronoiDiagram as theWorld
    theWorld = voronoiGetDiagram();
    //printing the voronoi diagram generated(full detailed diagram):
    //console.log("This is the world: " + theWorld);
    //print(theWorld);

    createTheWorldSites();
    //console.log("These are the worlds' sites:");
    //print(theWorldSites);
    //console.log("This is the site at index 0:" + theWorldSites[1]);
    //console.log("This is the site color at index 0:" + voronoiGetColor(1));
    //console.log("this is the color at index 0 in worldColors" + worldColors[0]);
    //console.log("This is the color at palette index 0:" + palette[1]);
    //console.log("These are the worlds colors:" + worldColors);

    //console.log("This is the length of palette");
    //console.log(palette.length);

    //Get simplified cells without jitter, for more advanced use
    //var normal = voronoiGetCells();
    //console.log(normal);

    //  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3
    //  <3                                     <3
    //  <3             PASSPORT MODE           <3
    //  <3                                     <3
    //  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3

    //What follows here is taking the world apart in terms of the colors of
    //the cells, in order to implement passports!

    //probably what will be sufficient is worldGIndex, which has the G value
    //of each RGBA color sorted by cellID. ie. index of worldGIndex correspons
    //to the cellID - G value of each cell color, which is enough information
    //to know what is the color of each cell, according to cellID

    //Using this information, it should be possible to build the passports

    //make an array of all the colors in the world
    //for(var i=0;i<zones;i++){

    //THESE ARE ALL THE COLORS IN THE WORLD, ordered by cellID = index:
    //worldColors //all colors of world (RGBA), index = cellID
    for(var i=0;i<palette.length;i++){
      //here the position in the worldColors[] == cellID,
      //ie. cellID of 0 is color at worldColors[0];
      //remember that the G value of each color, ie worldColors[i][1]
      //is the unique identifier of each color.
      //This G value can be used to build the passports!
      worldColors[i] = voronoiGetColor(i);
      //add here as the 5th element the "colorID" of the color?
      //worldColors[i][4] = ;
    }
    //console.log("World colors are:");
    //console.log(worldColors);

    //make an array with number names

    //make an array with number codes
    //this is an array of just the G values:

    //the G-value of each color just happens to be unique!!!!
    //easiest way is to check against this...
    //AT THIS POINT, we should save the colorID of that color after the G value:
    //I think we don't need the color ID at all.....
    //making an array that has: cellID = index of array, at position 0 we have:
    for(var i=0;i<palette.length;i++){
      worldColorsNumberCodes[i] = [worldColors[i][1], 0] ;
    }

    //FIRST: identify what is the colorCode of this color?
    for(var i=0;i<zones;i++){
        for(var j=0;j<zones;j++){
          //compare the color of the cell (G) at i with color (G) at index j in palette
          if(worldColorsNumberCodes[i][0] == paletteCopy[j][1]){
            worldColorsNumberCodes[i][1] = j;
          }
        }
    }
    //console.log("Unnecessary variable: worldColorsNumberCodes, the mapping of palette colors (by index) to wolrd colors:");
    //console.log(worldColorsNumberCodes);

    for(var i=0;i<palette.length;i++){
      worldGIndex[i] = worldColors[i][1];
    }

    //Now, what I could already do at this point is: map the
    //different passports into cellIDs:
    //console.log("Logging analogousColors");
    //console.log("Length of analogousColors" + analogousColors.length);

    //console.log("PASSPORT MODE IS:" + passportMode);

    //console.log("This is the monochrome passport written in g values");
    //console.log(worldGIndex);

    for(var i=0; i<analogousColors.length; i++){
      for(var k=0; k<analogousColors[i].length;k++){
        for(var j=0; j<worldGIndex.length; j++){
          if(analogousColors[i][k] == worldGIndex[j]){
            //map g to cellID:
            analogous[i][k] = j;
          }
        }
      }
    }
    //console.log("This is the analogousColors passport written in g values");
    //console.log(analogousColors);
    //console.log("This is the analogous passport written in cellIDs");
    //console.log(analogous);

    for(var i=0; i<complementaryColors.length; i++){
      for(var k=0; k<complementaryColors[i].length;k++){
        for(var j=0; j<worldGIndex.length; j++){
          if(complementaryColors[i][k] == worldGIndex[j]){
            //map g to cellID:
            complementary[i][k] = j;
          }
        }
      }
    }
    //console.log("This is the complementaryColors passport written in g values");
    //console.log(complementaryColors);
    //console.log("This is the complementary passport written in cellIDs");
    //console.log(complementary);



    for(var i=0; i<triadColors.length; i++){
      for(var k=0; k<triadColors[i].length;k++){
        for(var j=0; j<worldGIndex.length; j++){
          if(triadColors[i][k] == worldGIndex[j]){
            //map g to cellID:
            triad[i][k] = j;
          }
        }
      }
    }
    //console.log("This is the triad passport written in g values");
    //console.log(triadColors);
    //console.log("This is the triad passport written in cellIDs");
    //console.log(triad);

    //THIS IS A VERY IMPORTANT VARIABLE:
    //console.log("This is the G index of world colors:");
    //console.log(worldGIndex);

    //  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3
    //  <3                                     <3
    //  <3             PASSPORT MODE           <3
    //  <3                                     <3
    //  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3

}//close doVoronoiSetupStuff()







function createTheWorldSites(){
  //consider adding information about the color of the cell..
  for(var i=0;i<theWorld.cells.length;i++){
    var site = createVector(theWorld.cells[i].site.x, theWorld.cells[i].site.y);
    theWorldSites.push(site);
  }

}






/*
//initiate microphone input:
//note! this is not the same as speech recognition...
function listenToMe() {

mic.start();
mic.connect();
//let val = random(255);
//background(val);

} // close listenToMe()
*/



//  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3
//  <3                                     <3
//  <3     This is Lilis idea!!!!!!!!      <3
//  <3                                     <3
//  <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3

//and whats nice is this: you can create them by clicking with your mouse
//ie. you can attempt to guide the migratory movements by creating these
//attractors in zones where you want particles to flock to.

//BUG: sometimes it doesnt work: sometimes, when you click, it simply does
//not create a sphere... why..
function mouseClicked() {
    spawnNewAttractor(mouseX, mouseY);
    return false;
}

function draw() {

  if (keyIsDown(LEFT_ARROW)){
      youParticle.userDirectionVector.add(-0.9, 0);
  }
  if (keyIsDown(RIGHT_ARROW)){
      youParticle.userDirectionVector.add(0.9, 0);
  }
  if (keyIsDown(UP_ARROW)){
      youParticle.userDirectionVector.add(0, -0.9);
  }
  if (keyIsDown(DOWN_ARROW)){
      youParticle.userDirectionVector.add(0, 0.9);
  }

  //removes trace of former particles
  clear();
  cursor(ARROW);

  /*
  //attempt to display some feedback from the microphone input:
  var myLevel = mic.getLevel().toString();
  text(myLevel, 60, 30);
  */

  //Draw diagram in coordinates 0, 0
  //Filled and without jitter
  voronoiDraw(drawingBorderX, drawingBorderY, true, false);
  //textSize(20);
  //text(frameCount, 20, 30);

  //create one attractor with the quality: repulsor!
  //for testing purposes!
  //by default: this will be the first "attractor" in the array


  /*
  if (frameCount == 10){
    let attractorX = random(0, canvasX);
    let attractorY = random(0, canvasY);
    let quality = "nothing"; //this used to be: "repulsor"
    let lifespan = random(500,1000);
    attractors.push(new attractor(quality, attractorX, attractorY, lifespan));
    console.log("Made me!");
    //attractors[0].attractorPosition.x
    //attractors[0].attractorPosition.y
  }
  */



  //BUT its nice that, alongside being able to decide where these attractors
  //emerge, they also emerge randomly. So as much as you try to control where
  //the particles flock to, sometimes their movement will be out of your
  //control.
  /*
  if (frameCount % 300 == 0) {
    //spawnNewAttractor();
    for(let i=0; i < attractors.length; i++){
      //console.log("There is a new attractor in the attractors array, with the quality: " + attractors[i].quality);
      //console.log(attractors[0].quality);
    }
  }
  */


  /*
  *
  *   Display all attractors.
  *
  */

  //for some reason this is only displaying attractor[0],
  //it is not going beyond index 0 to display 1, 2, even though the
  //other attractors exist in the array as valid objects.....
  //this currently only displays one attractor at a time....
  //why is this not looping through to display all the attractors in the
  //attractors array?
  //the problem was that this variable was possibly being confused
  //with the for() loop for particles??
  //Problem fixed by initialising i using var i =0.
  for (let i=0; i < attractors.length; i++) {
          //console.log("Length of attractors array is:" + attractors.length);
          //console.log("Displaying attractor number:" + i);
          //displays all attractors in the world
          //this was failing because at the last cycle of the attractors
          //life, the particle was first being removed (through display())
          //and only then did it try to attractParticles().....!!!
          if(attractors[i].existance == "defined"){
                //console.log("Framecount = " + frameCount);
                attractors[i].display();

          }
    } //close for


/*
*
*   Display all particles.
*
*/

for (let i = 0; i < particles.length; i++) {
  particles[i].move();
  strokeWeight(1);
  particles[i].display();

  if (frameCount >= 21){
      //youParticle.infoText = "You";
      youParticle.giveInformation();
      //console.log("Cell ID that You particle is currently at:" + voronoiGetSite(youParticle.positionVector));
      var currentCellID = voronoiGetSite(youParticle.positionVector.x, youParticle.positionVector.y);
      if(currentCellID == undefined){
        //this only evaluates as undefined at the edges... grah!!!
        //at the borders it evaluates as either the one cell or the other..
        //console.log("Current cell is undefined at:" + youParticle.positionVector.x);
        //currentCell = this.cellID;
      }
    //youParticle.isAttractedTo = currentCellID + ", " + youParticle.cellID;
    //SO: when the particle is located over a voronoi cell border,
    //it is understood as not being in a cell at all,
    //ie. voronoiGetSite(x,y) will return undefined.
    //
    //if(currentCellID == undefined){
      //youParticle.infoText = currentCellID;
    //}
    //youParticle.isAttractedTo = voronoiGetColor(youParticle.positionVector.x, youParticle.positionVector.y);
    //console.log("Cell ID that You particle is currently at:" + currentCellID);
  }

} //close for

if(speechDetected == true){
      //showRecognitionResults();
      //console.log("*** *** " + speechToText);
      //console.log("*** DRAW *** speechDetected is now: " + speechDetected);
      textSize(54);
      fill("black");
      text(speechToText, 20, 60);
}



//new method: spawnNewParticle - for testing purposes originally
/*
if (frameCount == 20){
spawnNewParticle();
}
*/



//spawnNewParticles method
//here, we set the frequency at which particles are spawned
//at 30 frames per second, %120 frames means there is a chance
//of new particles spawning every four seconds:



if (frameCount%20 == 0) {
      if(particles.length < 200){//limit the maximum number of particles in the world:
            spawnNewParticles();
      } else {
        //console.log(" * -- max number of particles reached --*")
      }
} //close if framecount


if (frameCount%200 == 0) {
            //have to give it an x and a y!
            var randomX = random(0, canvasX);
            var randomY = random(0, canvasY);;
            spawnNewAttractor(randomX, randomY);
            //var randomSite = random(theWorldSites);
            //spawnNewAttractor(randomSite.x, randomSite.y);
} //close if framecount



//Spawn you-particle!
if (frameCount == 20){
  youParticle = new particle(canvasX/2, canvasY/2);
  particles.splice(0, 0, youParticle);

  if(lang == "pt"){
      youParticle.infoText = "Tu";
      youParticle.isAttractedTo = "o impossível";

  } else if (lang == "en"){
      youParticle.infoText = "You";
      youParticle.isAttractedTo = "the impossible";
  }
  //youParticle.passport = "analogous";
  //youParticle.diameter = 40;
  youParticle.lifespan = 100000;
  //youParticle.color = "white";
  //console.log("Succesfully created you");
  //console.log("You are attracted to:" + youParticle.isAttractedTo);
  //console.log("Your lifespan is:" + youParticle.lifespan);
  youParticle.giveInformation();
  //console.log("My g is:" + youParticle.g);
}//close if() for spawning youParticle





} //close function draw




/*
*
*   Spawn x particles.
*
*/

function spawnNewParticles() {

  //choose how many particles to spawn this time around:
  //currently manually weighted at zero particles:
  var numberOfNewParticles = random([0,0,0,0,0,1,2]);

  //for each of the particles to be born, assigns random cell to be born into:
  for(let i = 0 ; i < numberOfNewParticles ; i++){
    //chooses one of the voronoi cells:
    var newHome = round(random(0, theWorld.cells.length-1));
    var newParticle = new particle(theWorld.cells[newHome].site.x, theWorld.cells[newHome].site.y);
    particles.push(newParticle);
    //spawnNewParticle(newHome);
  }

} //close spawnNewParticles()

/*
*
*   Create random sites for voronoi diagram.
*
*/

function createRandomSites() {
      //for (i = 0; i < zones; i++) {
      for (i = 0; i < palette.length; i++) {
                  //here: create the sites so that cellID corresponds
                  //to the index of the color of the cell:
                  /*var paletteIndex = round(random(0, palette.length-1));
                  randomSites.push(
                    [random(drawingBorderX, canvasX),
                      random(drawingBorderY, canvasY),
                      palette[paletteIndex]
                    ]
                  );
                  */
                  randomSites.push(
                        [random(drawingBorderX, canvasX),
                          random(drawingBorderY, canvasY),
                          palette[i]
                        ]
                  );
                //palette.splice(paletteIndex, 1);

                } //close for
      //console.log("These are the random sites and their colors:");
      //print(randomSites);

  } //close createRandomSites

  /*
  *
  *   Spawn one attractor.
  *
  */

  function spawnNewAttractor(attractorX, attractorY) {

    if(attractorX == undefined || attractorY == undefined){
      attractorX = random(0, canvasX);
      attractorY = random(0, canvasY);
    }
    let quality = random(attractorQualities);
    //sets a random lifespan
    let lifespan = random(100,500);
    attractors.push(new attractor(quality, attractorX, attractorY, lifespan));
  } //close spawnNewAttractor
