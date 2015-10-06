var difficultyLevel = "";

// array with hashes holding all information for the game tiles
var gameBoard = [{"tileID": "back", "image": "", "match": true}];

// assigned after difficultyLevel chose
var gridSize = 0;

// total number of tiles being displayed, assigned after difficultyLevel set
var numberOfTiles = 0;

// used as "first selected tile info" for comparison of the two selected tiles
var tile1 = "";

// default selected value
var tileSelection = "Everyday Items";

// actual images displayed on screen, assigned after tileSelection is set
var tileSet = [];

var timeFinished;
var timeStarted;
var timeTotal;
var userName = "";
var wrapper = document.getElementById("wrapper");


// start game!!!
titleScreen();


//-----------------------------------------------------------------------------
// creates elements for the title screen
//-----------------------------------------------------------------------------
function titleScreen () {
  var div; 
  var img1;
  var img2;

  div = document.createElement("div");
  div.id = "title_screen";
  wrapper.appendChild(div);

  div = document.getElementById("title_screen");

  img1 = document.createElement("img");
  img1.id = "title_image";
  img1.src = "images/title.png";
  div.appendChild(img1);

  img2 = document.createElement("img");
  img2.id = "start_button";
  img2.src = "images/start.png";
  img2.addEventListener("click", function(event) {
    gameSetupScreen();
  });
  div.appendChild(img2);
}


//-----------------------------------------------------------------------------
// creates HTML tags for game setup screen
//-----------------------------------------------------------------------------
function gameSetupScreen () {
  var code = "";
  var div;
  var edaySel;
  var kidsSel;

  // clears the title screen
  document.getElementById("title_screen").remove();

  div = document.createElement("div");
  div.id = "game_setup_screen";
  wrapper.appendChild(div);

  // I ended up just creating this code to be inserted as innerHTML, I started
  // coding it with document.createElement and stuff but the code for doing
  // this that way got long very fast; will look into creating a function
  // to create elements for a future revision of the program
  code = '<form id="setup"><table><tr><td>' +
         '<label for="name"><h3>Enter your name:</h3></label>' +
         '<input id="name" type="text" size="50%"></td></tr>' +
         '<tr><td><h3>Select the tile set you\'d like to use:</h3>' +
         '<img src="images/eday.jpg" id="eday_selection" ' +
         'style="border: 2px solid #d06600">&nbsp&nbsp&nbsp' +
         '<img src="images/kids.jpg" id="kids_selection"></td></tr>' +
         '<tr><td><input type="radio" id="easy" ' +
         'name="difficultyLevel" value="Easy">' +
         '<label for="easy">Easy (2x2)</label>' +
         '<input type="radio" id="normal" name="difficultyLevel" ' +
         'value="Normal" checked>' +
         '<label for="normal">Normal (4x4)</label>' +
         '<input type="radio" id="hard" name="difficultyLevel" value="Hard">' +
         '<label for="hard">Hard (6x6)</label></td></tr>' +
         '<tr><td><input type="button" onclick="startGame()" ' +
         'value="Play Game!"></td></tr>' +
         '</table></form>';

  document.getElementById("game_setup_screen").innerHTML = code;

  edaySel = document.getElementById("eday_selection"); 
  kidsSel = document.getElementById("kids_selection"); 

  edaySel.addEventListener("click", function(event) {
        edaySel.style.border = "2px solid #d06600";
        kidsSel.style.border = "none";
        tileSelection = "Everyday Items";
  });

  kidsSel.addEventListener("click", function(event) {
        kidsSel.style.border = "2px solid #d06600";
        edaySel.style.border = "none";
        tileSelection = "Kids";
  });
}


//-----------------------------------------------------------------------------
// sets game up with game setup screen values
//-----------------------------------------------------------------------------
function gameSetup () {
  userName = document.getElementById("name").value;
  difficultyLevel = document.getElementsByName("difficultyLevel");

  // checks the radio buttons for difficultyLevel and assigns checked one
  for (var index = 0, length = difficultyLevel.length; index < length; index ++) {
    if (difficultyLevel[index].checked) {
      difficultyLevel = difficultyLevel[index].value;
    }

  switch(tileSelection) {
    case "Kids":
      tileSet = "kids";
      break;
    default:
      tileSet = "eday";
  }

  }
  switch (difficultyLevel) {
    case "Hard":
      numberOfTiles = 36;
      break;
    case "Easy":
      numberOfTiles = 4;
      break;
    default: // "Normal"
      numberOfTiles = 16;
  }
  gridSize = Math.sqrt(numberOfTiles);
}


//-----------------------------------------------------------------------------
// creates all tile pairs and randomly assigns them to the gameBoard array
//-----------------------------------------------------------------------------
function randomizeTiles () {
  var assigned;
  var randomNumber;
  var tempBoard = [];

  // assignment of the card back image with current tileSet
  gameBoard[0].image = "images/" + tileSet + "Back.jpg";

  // assignment of random tile pairs to all numberOfTiles positions
  for (var index = 1 ; index <= numberOfTiles ; index++) {
    assigned = false;
    while (!assigned) {
      randomNumber = Math.floor((Math.random() * (numberOfTiles / 2)) + 1);
      if (tempBoard.indexOf(randomNumber + "b") === -1) {
        if (tempBoard.indexOf(randomNumber + "a") === -1) {
          // if #a doesn't exist, create #a in the arrays
          gameBoard.push({tileID: (randomNumber + "a")});
          tempBoard.push(randomNumber + "a");
        } else {
          // if #a exists, create #b in the arrays
          gameBoard.push({tileID: (randomNumber + "b")});
          tempBoard.push(randomNumber + "b");
        }

        gameBoard[index].image = "images/" + tileSet +
          (randomNumber <= 9 ? "0" : "") + randomNumber + ".jpg";
        gameBoard[index].match = false;
        assigned = true;
      } else {
        // if #a and #b already exist restart loop for a new random number
        assigned = false;
      }
    }
  }
}


//-----------------------------------------------------------------------------
// creates gameBoard tiles and assigns variables
//-----------------------------------------------------------------------------
function createGameBoard () {
  var borders = 6;   // borders # chosen based on css borders + margins for img
  var div;
  var gameboard;
  var gameStatus = "";
  var h2;
  var imgHeight = 0;
  var imgWidth = 0;
  var statusFooter;
  var screenHeight = window.innerHeight - 100;
  var screenWidth = window.innerWidth - 100;

  // clears the game setup screen; doesn't try if the game is being replayed
  if (document.getElementById("game_setup_screen") !== null) {
    document.getElementById("game_setup_screen").remove();
  }

  div = document.createElement("div");
  div.id = "game_board";
  wrapper.appendChild(div);

  gameboard = document.getElementById("game_board");

  // checks window size and orientation so the tiles fit into a square
  // within the window based on smallest space available and orientation
  if (window.matchMedia("(orientation: portrait)").matches) {
    imgWidth = (screenWidth / gridSize) - borders;
    imgHeight = imgWidth;
    gameboard.style.width = screenWidth + "px";
    gameboard.style.height = screenWidth + "px";
  }
  if (window.matchMedia("(orientation: landscape)").matches) {
    imgHeight = (screenHeight / gridSize) - borders;
    imgWidth = imgHeight;
    gameboard.style.height = screenHeight + "px";
    gameboard.style.width = screenHeight + "px";
  }

  for (var count = 1; count <= numberOfTiles; count++) {
    var img = document.createElement("img");

    function addListener (img) {
      img.addEventListener("click", function(event) {
        checkTile(img);
      });
    }

    img.id = gameBoard[count].tileID;
    img.src = gameBoard[0].image;
    img.height = imgHeight;
    img.width = imgWidth;
    img.alt = count;
    addListener(img);
    gameboard.appendChild(img);
  }

  // creates game settings line for the current game
  statusFooter = document.createElement("div");
  statusFooter.id = "game_status";
  wrapper.appendChild(statusFooter);

  statusFooter = document.getElementById("game_status");

  h2 = document.createElement("h2");
  h2.id = "status";
  h2.style.margin = "3px";
  h2.style.color = "#ffffff";
  h2.style.textAlign = "center";
  h2.style.textShadow = "2px 2px 3px #000000";
  statusFooter.appendChild(h2);

  gameStatus = userName + "&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp" + tileSelection +
    " Tile Set" + "&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp" + difficultyLevel +
    " Difficulty</h3>";
  document.getElementById("status").innerHTML = gameStatus;
}


//-----------------------------------------------------------------------------
// checks each tile as they're clicked to see if a first selection already
// exists and if a match is made; flips images
//-----------------------------------------------------------------------------
function checkTile(tileIn) {

  document.getElementById(tileIn.id).src = gameBoard[tileIn.alt].image;

  if (tile1 === "") {    // global tile1 = "" if no tiles are currently showing
    tile1 = tileIn;
  } else {
    if (tile1.id !== tileIn.id) {
      if (tile1.id.replace(/\D/g,'') === tileIn.id.replace(/\D/g,'')) {
        gameBoard[tile1.alt].match = true;
        gameBoard[tileIn.alt].match = true;
        tile1 = "";
      } else {
        setTimeout(function(){
          document.getElementById(tile1.id).src = gameBoard[0].image;
          document.getElementById(tileIn.id).src = gameBoard[0].image;
          tile1 = "";
        }, 750);
      }
    }
  }
  setTimeout(function(){
    gameWonCheck();
  }, 750);
}


//-----------------------------------------------------------------------------
// checks all match values to see if all matches have been made, exits the
// loop & function upon the first match value of false found
//-----------------------------------------------------------------------------
function gameWonCheck() {
  var index = 0;
  var stillMatchesToCheck = true;

  // check for game won (all matches made)
  while (stillMatchesToCheck) {
    if (!gameBoard[index].match) {
      stillMatchesToCheck = false;
    } else {
      // if all tiles are checked and no false is found
      if (index === numberOfTiles) {
        gameWonScreen();
      } else {
        index++;
      }
    }
  }
}


//-----------------------------------------------------------------------------
// creates elements for the game won screen and gives "new game" and "replay"
// options; clears previous game divs/values as neccessary to start new game
//-----------------------------------------------------------------------------
function gameWonScreen () {
  var button;
  var div;
  var gameWonMessage;
  var h1;
  var message;

  // clears the game board
  document.getElementById("game_board").remove();
  document.getElementById("game_status").remove();

  div = document.createElement("div");
  div.id = "game_won_screen";
  wrapper.appendChild(div);

  timeFinished = timeAssignment();
  timeTotal = timePassed(timeStarted, timeFinished);

  // creates the game won message
  gameWonMessage = document.getElementById("game_won_screen");

  h1 = document.createElement("h1");
  h1.id = "message";
  h1.style.color = "#ffffff";
  h1.style.textShadow = "2px 2px 3px #000000";
  gameWonMessage.appendChild(h1);

  message = "Congratulations " + userName + "!<br>" +
    "You beat the " + difficultyLevel + " game in " +
    formalTimePassed(timeTotal) + "!";

  document.getElementById("message").innerHTML = message;

  button = document.createElement("input");

  button.type = "button";
  button.value = "New Game";
  button.addEventListener("click", function(event) {
    window.location.href=window.location.href;
  });

  gameWonMessage.appendChild(button);
  

/* I had planned for the program to ask for new game or replay with current
   settings but for some reason there was erratic behaviors with the tiles
   on a replay; this feature axed for now but would like to implement later;
   my thinking is either variables weren't correctly clearing or the event
   listeners were still linked to original values, even when I re-assigned
   values to both the browser had wrong event handlers assigned to new match
   pairs and tiles; removeEventHandler() function did not correctly remove

  var button1;
  var button2;

  button1 = document.createElement("input");

  button1.type = "button";
  button1.id = "new_game";
  button1.value = "New Game";
  button1.addEventListener("click", function(event) {
    document.getElementById("game_won_screen").remove();
    userName = "";
    tileSelection = "";
    difficultyLevel = "";
    titleScreen();
  });
  gameWonMessage.appendChild(button1);

  button2 = document.createElement("input");

  button2.type = "button";
  button2.id = "replay_game";
  button2.value = "Replay Game";
  button2.addEventListener("click", function(event) {
    document.getElementById("game_won_screen").remove();
    replayGame();
  });
  gameWonMessage.appendChild(button2);
*/
}


//-----------------------------------------------------------------------------
// sets current time in hours, minutes and seconds;
// returns a string in 00:00:00 format
//-----------------------------------------------------------------------------
function timeAssignment() {
  var time = new Date();
  var currentHour = time.getHours();
  var currentMins = time.getMinutes();
  var currentSecs = time.getSeconds();
  
  return(
    currentHour + ":" +
    (currentMins <= 9 ? "0" : "") + currentMins + ":" +
    (currentSecs <= 9 ? "0" : "") + currentSecs
  );
}


//-----------------------------------------------------------------------------
// calculates difference in hours, minutes and seconds between two times
// passed in as strings in 00:00:00 format; returns string in 00:00:00 format;
// the function was written to output this way for future revisions where a
// scoreboard will be created and kept and the scoreboard will show the user
// name and time in 00:00:00 format
//-----------------------------------------------------------------------------
function timePassed(start, finish) {
  var hoursPassed;
  var minsPassed;
  var secsPassed;

  start = start.split(":");
  finish = finish.split(":");

  hoursPassed = finish[0] - start[0];
  minsPassed = finish[1] - start [1];
  secsPassed = finish[2] - start [2];

  // when the difference in seconds is a negative number adjusts minutes / secs
  if (secsPassed < 0) {
    minsPassed-= 1;
    secsPassed = 60 + secsPassed;
  }

  // when the difference in minutes is a negative number adjusts hours / mins
  if (minsPassed < 0) {
    hoursPassed-= 1;
    minsPassed = 60 + minsPassed;
  }

  return(
    hoursPassed + ":" +
    (minsPassed <= 9 ? "0" : "") + minsPassed + ":" +
    (secsPassed <= 9 ? "0" : "") + secsPassed
  );
}


//-----------------------------------------------------------------------------
// takes a time passed in as a string in 00:00:00 format and returns the time
// passed as a string in "formal english" format
//-----------------------------------------------------------------------------
function formalTimePassed(timeIn) {
  var text = "";
  var time = timeIn.split(":");
  
  // converts hours, minutes and seconds to numbers for calculations
  time[0] = Number(time[0]);
  time[1] = Number(time[1]);
  time[2] = Number(time[2]);

  if (time[0] > 0) {
    if (time[0] === 1) {
      text = time[0] + " hour, ";
    } else {
    text = time[0] + " hours, ";
    }
  }
  
  if (time[1] > 0) {
    if (time[1] === 1) {
      text = time[1] + " minute and ";
    } else {
    text+= time[1] + " minutes and ";
    }
  }

  if (time[2] === 1) {
    text+= time[2] + " second";
  } else {
    text+= time[2] + " seconds";
  }

  return(text);
}


//-----------------------------------------------------------------------------
// starts the game and does setup, creations and start time
//-----------------------------------------------------------------------------
function startGame () {

  gameSetup();
  randomizeTiles();
  createGameBoard();

  timeStarted = timeAssignment();

}


/* goes with the code in gameWonScreen() for called on functions

//-----------------------------------------------------------------------------
// starts the game after the setup, does creations and start time
//-----------------------------------------------------------------------------
function replayGame () {

  randomizeTiles();
  createGameBoard();

  timeStarted = timeAssignment();

}
*/
