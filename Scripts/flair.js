var screenwidth = 1920;
var screenheight = 1080;
var hypotenuse = Math.sqrt((screenwidth * screenwidth) + (screenheight * screenheight));
var numprizes = 17;
var boardBuilt = false; //the game board has been built and the game can start
var gameStarted = false; //the user has pressed the start button
var buttonPressed = false; //the user has pressed the button to win a prize
var seperationtime = "1s";//time it takes for the screen to seperate after the user clicks start
var rotatetime = "0.3s"; //time it takes for the logo to rotate after the user clicks start
var originalgamespeed = 100; //populated from the back end to hold the game speed
var originalbuildspeed = 400; //populated from the back end to hold the build speed
var gamespeed = originalgamespeed; //speed at which the selector moves around the board
var buildspeed = originalbuildspeed;//speed at which board is built after user clicks start - also need to change in resetVariables
var finalcountdown = 10000;//milliseconds the user has to hit the button once the board is built
var numSelections = (finalcountdown/gamespeed)+numprizes;//the number of prizes the selector goes over before timeout
var numGone = 0;//the number of prizes that the selector has moved over
var timedOut = false;//if the user has waited too long they time out
var i = 0; //index of which prize the yellow selector is on
var originalselectorsize = 8; //populated from the back end to hold the selector size
var selectorsize = 8; //size of the yellow selector
var prizeWon = 0;// the idnum of the circle of the prize that was selected (not the actual prizeid)
var used = []; //list of indexes of the images used - prevents duplicates on idle screen
var numcircles = numprizes; //number of circles on the board
var imagelist = []; //contains the list of all the images available to rotate on idle
var gameimages = [];//List of the prizes that will load on the board for the player to win
var imagesontheboard = []; //list indexes of images currently on the board
var tipscreenshown = false;//Indicates if a prize has been won and the tip screen has been shown to the winner
var timetoidleAfterWin = 45000; //time in milliseconds to show the congratulations/tip screen before returning to idle screen
var timetoidleAfterTimeout = 30000; //time in milliseconds to show the timed out screen before returning to idle screen
var runGradient = true;//turn on or off the background gradient. 
var gradualSlowSelector = true; //when the user hits the button to win, slow down the selector & stop a few prizes later instead of immediately stopping
var flashwinnerselector; //holds the timeout for the blinking winner selector 
var bgInterval; //holds the continuous interval to change the gradient - needed to stop the gradient
var idleTimeout; //holds the timeout to reset to idle screen
var blinkLogo = false; //blink the logo on the idle screen
var bounceGetReady = false; //bounce in the get ready text after user starts game
var playaudio = true;
var ticktock = true;
var prizesavailable = true;//if there are no prizes left this will set to false

//////////////////////////////////////////
//reset the variables & the board to idle
/////////////////////////////////////////
function resetVariables(){
    populatefromtheback();
    timedOut = false;//if the user has waited too long they time out
    buildspeed = originalbuildspeed;//speed at which board is built after user clicks start
    gamespeed = originalgamespeed; //speed at which the selector moves around the board
    numSelections = (finalcountdown/gamespeed)+numprizes;
    boardBuilt = false; //the game board has been built and the game can start
    gameStarted = false; //the user has pressed the start button
    buttonPressed = false; //the user has pressed the button to win a prize
    i = 0; //index of which prize the yellow selector is on
    selectorsize = originalselectorsize; //size of the yellow selector
    prizeWon = 0;// the idnum of the circle of the prize that was selected
    used = []; //list of indexes of the images used - prevents duplicates
    numcircles = numprizes; //number of circles on the board
    imagesontheboard = []; //list indexes of images currently on the board
    numGone = 0;//number of prizes the selector has gone over (used to calculate timed out)
    tipscreenshown = false;
    $("#gameboard").css("background","none");
    $("#gameboard").hide();
    $("#winnerboard").hide();
    $("#youhave").html(finalcountdown/1000);
    $("#winner").removeClass("bigEntrance");
    $("#prizemelogo").css({
        "transform":"none",
        "top":"319px",
        "width":"100%",
        "left":"0"
        });
    if(blinkLogo){
        $("#prizemelogo").addClass("blink_me");
    }
    $("#prizemelogo").show();
    $("#prizemelogo img").css("left", "50%");
    $("#wanttoplay").css("transform", "scale(1)");
    $("#tryagain").removeClass("timedoutentry");
    //get rid of yellow selector
    $(".outer").css("box-shadow","none");
    $("#innerboard").show();
    $("#topbar").css({"margin-left":"-511.5px", "width":"1019px"});   
    $("#bottombar").css({"margin-right":"-507.5px", "width":"1019px"}); 
    clearInterval(bgInterval);
    clearTimeout(idleTimeout);
    idleTimeout = null;
    //reset countdown
    $(".countdown .top, .countdown .bottom, .countdown .top-back span, .countdown .top-back span").text("0");
    ticktock = true;
    //set audio files to beginning
    $("#audioCheer").get(0).currentTime = 0;
    $("#audioGameBell").get(0).currentTime = 0;  
    $("#noneleft").hide();
    $(".outer, .circle").css({
                "transform": "scale(1)"
                });
}

////////////////////////////////////
//Shows the idle screen
///////////////////////////////////
function idlegame(){
        resetVariables();
        //play audio
        if(playaudio){            
            $("#audioBg")[0].play();
            $("#audioBg").animate({volume: 1}, 2500);
            $("#audioBg").attr("loop",true);
        }       
        //Preload mages
        preload(imagelist);
        loadGameImages(); //load the images that will be played once game is started
        $("#gameboard").fadeIn(1500);
        /////////////////////////////////////////////////////////////////////
        //Set the triangle seperator divs to the width and height of the screen
        ///////////////////////////////////////////////////////////////////////
        $("#toplayer").css({
            "border-right": screenwidth + "px solid transparent",
            "border-top": screenheight + "px solid #47c3c2"
        });
        $("#bottomlayer").css({
            "border-right": screenwidth + "px solid transparent",
            "border-top": screenheight + "px solid #47c3c2",
            "transform": "rotate(180deg)"
        });

        /////////////////////////////////////////////////////////////////////
        //Idle Screen setup - prizes flash at random places around screen
        ///////////////////////////////////////////////////////////////////////        
        var p = 0;
        //initial load, random images
        if (!gameStarted) {
            generaterandom(); //generate a list of random image indexes
            $(".circle").each(function () {
                var ran = used[p];
                imagesontheboard[imagesontheboard.length] = ran;
                p++;
                $(this).css("background-image", "url("+imagelist[ran] + ")");
                $(this).attr("data-index", ran);
            });
        }
        //change prize images randomly on the board
        var n = 0;
        (function rotateprizes(n) {
            setTimeout(function () {
                var numtochange = Math.floor((Math.random() * 4) + 2); //change between 2 and 4 images at once
                for (var j = 0; j < numtochange; j++) {
                    var circle = Math.floor((Math.random() * numcircles) + 0); //pick a random circle
                    var img = getuniquerandomimage(Math.floor((Math.random() * imagelist.length) + 0), circle); //pick a random image
                    $(".circle.p" + circle).css({
                        "background-image": "url(" + imagelist[img] + ")",
                        "transition": "background-image 600ms ease-in-out"
                    });
                    $(".circle.p" + circle).attr("data-index", img);
                }
                if (gameStarted) {
                    //once the game has started stop flashing images on idle screen
                }
                else {
                    rotateprizes(n);
                }
            }, 1000);
        })(n);
    }    


//when the page loads
$(function () {
    $("#audioBoop1").prop("volume",0.4); 
    $("#audioBoop2").prop("volume",0.4);
    //start the idle screen
    idlegame();
    
    /////////////////////////////////////////////////////////////////////
    //when player presses #1, angle the logo, seperate the triangles	
    /////////////////////////////////////////////////////////////////////
    $("#hiddentrigger").click(function () {
        if(playaudio){
            $("#audioBg").animate({volume: 0}, 3000);
        }
        
        //fade out circles	
        $(".outer, .circle").css({
                    "transform": "scale(0)",
                    "transition": "transform 0.6s ease-in"
                 });
        $("#wanttoplay").css({
                    "transform": "scale(0)",
                    "transition": "transform 0.03s ease-in"
                 });

        //stop blinking logo
        if(blinkLogo){
            $("#prizemelogo").removeClass("blink_me");
        }
        //rotate logo
        $("#prizemelogo").css({
                "top":"427px",
                "transition": "top 1s ease-out",
                "transform": "scale(.8) rotate(-27deg)",
                "transition": "transform " + rotatetime + " ease-out",
                "left": (screenwidth+100 - hypotenuse) + "px",
                "width": hypotenuse + "px",
            });   
        $("#prizemelogo img").css("left", (screenwidth / 2) + (hypotenuse - screenwidth) + "px");
        //position & increase upper & lower border size
        $("#topbar").css("margin-left","-360px");
        $("#bottombar").css("margin-right","-654px");
        $(".bar").css({
            "width":"100%",
            "transition": "width 1s linear"
        });
        //once borders are at 100%, slide them away
        setTimeout(function () {
            $("#topbar").css({
                "margin-left":screenwidth+"px",
                "transition": "margin-left 1s linear"
            });
            $("#bottombar").css({
                "margin-right":screenwidth+"px",
                "transition": "margin-right 1s linear"
            });
        }, 500);//wait 1s before sliding borders away
        //open screen
        setTimeout(function () {
            $("#toplayer").css({
                "border-right-width": "0",
                "border-top-width": "0",
                "transition": "border-right-width " + seperationtime + " linear, border-top-width " + seperationtime + " linear"
            });
            $("#bottomlayer").css({
                "border-right-width": screenwidth * 2 + "px",
                "border-top-width": screenheight * 2 + "px",
                "transition": "border-right-width " + seperationtime + " linear, border-top-width " + seperationtime + " linear"
            });
            //start background color gradient
            if(runGradient){
                setTimeout(function () {
                        backgroundgradient(); 
                }, 10);
            }
            //fade out logo over 2 seconds
            $("#prizemelogo").fadeOut(1700);

            //wait 2000ms (2s) for all the idle screen stuff to go away then build the prize circles
            setTimeout(function () {
                if(prizesavailable){
                    BuildPrizes();
                }
                else{
                    $("#noneleft").show();
                    tipscreenshown = true;
                }
            }, 1500); 

        }, 1000);//wait 2 seconds before opening screen

        
    });

});

///////////////////////////////////////////////////////////////////////
//Build prize circles & create the yellow selector using box-shadow
//The box shadow will vary in opacity & size as it moves around the board
/////////////////////////////////////////////////////////////////////
function BuildPrizes() {
    putGameImagesOnBoard();
    $("#getready").css({
        "-webkit-transform":"scale(1)",
        "transition": "-webkit-transform 2s ease-in-out"
    });
//    $(".shadow").css({
//        "-webkit-transform":"scale(1)",
//        "transition": "-webkit-transform 2s ease-in-out"
//    });
    //start bounce
    if(bounceGetReady){
        setTimeout(function () {
                $(".get-ready-container").css({
                "-webkit-animation": "the-forbidden-dance 0.5s linear infinite alternate"
            });
            $(".shadow").css({
                "-webkit-animation": "shadow 0.5s linear infinite alternate",
                "-webkit-transform": "translateX(-50%)"
            });
        },200);
    }    
    //flash the explosions, 4 flashes 16 milliseconds apart
    setTimeout(function () {
        emitter(4,1600);
    },10);  
    var isound;  
    (function circleLoop(i) {
        prizeWon = i;
        numGone ++;
        if(numGone == numSelections){ //the player waited too long and timed out
            timedOut = true;
            handleTimeOut();                    
        }
        else{                
                $(".outer.p" + i).css("box-shadow", "inset 0 0 0 " + selectorsize + "px rgba(255,255,0,1");                
                $(".outer.p" + i + ", .outer.p" + i + " .circle").css({
                "transform": "scale(1)",
                "transition": "transform 0.5s ease-out"
                });
            setTimeout(function () {
                if(playaudio){                    
                    if(isound == 0){
                        isound = 1;
                        $("#audioBoop1")[0].play();      
                    }
                    else{
                        isound = 0;
                        $("#audioBoop2")[0].play();
                    }
                }
                handleSelectorRotation(i);
                //Switch get ready to countdown a little before we finish building
                if(i== numprizes-2 && !boardBuilt){
                    //get rid of getready
                    $("#getready").css({
                        "-webkit-transform":"scale(0)",
                        "transition": "-webkit-transform 1s ease-in-out"
                    });
                    $(".shadow").css({
                        "-webkit-transform":"scale(0)",
                        "transition": "-webkit-transform 2s ease-in-out"
                    });
                    $(".shadow").animate({ 'zoom': 0 }, 1000);
                    setTimeout(function () {
                        $(".get-ready-container, .shadow").css({
                            "-webkit-animation": "none"
                        });
                                
                    },1000);
                    //bring in timer
                    //start countdown
                        countdown();
                        setTimeout(function () {
                                
                        $(".countdown, #countdownlogo").css({
                        "-webkit-transform":"scale(1)",
                        "transition": "-webkit-transform 0.5s ease-in-out"
                    });
                        
                        },500);
                       
                }
                //if the iterator == the number of prizes increase the indicator speed
                if (i == numprizes) {
                    i = -1;
                    boardBuilt = true;
                    buildspeed = gamespeed;
                }

                if (i < numprizes && !buttonPressed && !timedOut) {
                    i++;
                    circleLoop(i);
                }
                if (buttonPressed) { 
                    selectorSlowDown(i,isound);
                   
                }
            }, buildspeed);
        }
    })(i);
}

function handleSelectorRotation(i){
     if (i == 0 && boardBuilt) {
        $(".outer.p" + (numprizes - 2)).css({
            "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0.0)"
        });
        $(".outer.p" + (numprizes - 1)).css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-5) + "px rgba(255,255,0,0.3)"
        });
        $(".outer.p" + numprizes).css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-2) + "px rgba(255,255,0,0.6)"
        });
    }
    if (i == 1) {
        $(".outer.p0").css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-2) + "px rgba(255,255,0,0.6)"
        });
        if (boardBuilt) {
            $(".outer.p" + (numprizes - 1)).css({
                "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0.0)"
            });
            $(".outer.p" + numprizes).css({
                "box-shadow": "inset 0 0 0 " + (selectorsize-5) + "px rgba(255,255,0,0.3)"
            });
        }
    }
    if (i == 2) {
        $(".outer.p1").css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-2) + "px rgba(255,255,0,0.6)"
        });
        $(".outer.p0").css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-5) + "px rgba(255,255,0,0.3)"
        });
        if (boardBuilt) {
            $(".outer.p" + numprizes).css({
                "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0.0)"
            });
        }
    }
    if (i > 2) {
        $(".outer.p" + (i - 1)).css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-2) + "px rgba(255,255,0,0.6)"
        });
        $(".outer.p" + (i - 2)).css({
            "box-shadow": "inset 0 0 0 " + (selectorsize-5) + "px rgba(255,255,0,0.3)"
        });
        $(".outer.p" + (i - 3)).css({
            "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0.0)"
        });
    }
}

/////////////////////////////////////////////////////////
//Player waited too long and timed out
///////////////////////////////////////////////////////
function handleTimeOut(){
    //get rid of timer screen
    $(".countdown, #countdownlogo").css({
        "-webkit-transform":"scale(0)",
        "transition": "-webkit-transform 0.5s linear"
    });
    //get rid of yellow selector
    $(".outer").css("box-shadow","none");
    if(playaudio){
        ticktock = false;        
        $("#audioTickTock")[0].pause();
        $("#audioTimesUp")[0].play();
    }
    //show solid background
    clearInterval(bgInterval);
     $('#gameboard').css({
        "background":"#b6cfd3"
     });


    //show timed out screen
    $("#tryagain").addClass("timedoutentry");

    //return to idle
    if(idleTimeout){
        clearTimeout(idleTimeout);
        idleTimeout = null;
    }
    idleTimeout = setTimeout(function () {
        idlegame();
        },timetoidleAfterTimeout);
}
//////////////////////////////////////////////////////
//Slows down the selector to stop a few prizes after its clicked
///////////////////////////////////////////////////////////
function selectorSlowDown(i,isound){
    //Get a random number - we will move the selector this many more times (between 2 and 5)
    var more = 0;
    if(gradualSlowSelector){
        more = Math.floor((Math.random() * 4) + 2);
    }
    var c = 0;
    var circleAgain = true;
    (function circleLoopMore(c) {
        if(gamespeed < 600){
            gamespeed = gamespeed +(c+1)*40; 
        }
        setTimeout(function () {
            if (i == numprizes) {
                i = -1;
                }
            i++;
            prizeWon = i;
            if(playaudio){                    
                    if(isound == 0){
                        isound = 1;
                        $("#audioBoop1")[0].play();                            
                    }
                    else{
                        isound = 0;
                        $("#audioBoop2")[0].play();                       
                    }
                }
            $(".outer.p" + i).css("box-shadow", "inset 0 0 0 " + selectorsize + "px rgba(255,255,0,1"); 
            handleSelectorRotation(i);
            
            if(c<more){
                c++;
                circleLoopMore(c);
            }
            else{
            if(circleAgain){
                    var isnonprize =  $(".outer.p" +i+" .circle").attr("data-isnonprize");
                    if(isnonprize == "false"){
                        winner(prizeWon);
                        circleAgain = false;
                    }
                    else{
                        circleLoopMore(c);
                    }
                }
            }
        },gamespeed);
        
    })(c);
   
}
//////////////////////////////////////////////////////////
//Player has hit the button & won a prize!
////////////////////////////////////////////////////////
function winner(i){
    if(playaudio){
        $("#audioCheer")[0].play();
        $("#audioGameBell")[0].play();
    }
    //flash on winning prize
    var flashnum = "0";
    var m = 0;
    postWin();
    if(i==0){
         $(".outer.p" + (numprizes)).css({
            "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0)"
        });
        $(".outer.p" + (numprizes - 1)).css({
            "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0)"
        });
    }
    else{
        $(".outer.p" + (i - 1)).css({
            "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0)"
        });
        $(".outer.p" + (i - 2)).css({
            "box-shadow": "inset 0 0 0 0px rgba(255,255,0,0)"
        });
    }

    (function flashit(m) {
        flashwinnerselector = setTimeout(function () {
            $(".outer.p" + prizeWon).css("box-shadow", "inset 0 0 0 " + selectorsize + "px rgba(255,255,0," + flashnum).css("transition", "box-shadow 200ms ease-in-out");
            if (m < 7) {
                m++;
                if (flashnum == "0") {
                    flashnum = "1";
                }
                else {
                    flashnum = "0";
                }
                flashit(m);
            }
        }, 400);
    })(m);

    //get rid of timer screen
    $(".countdown, #countdownlogo").css({
        "-webkit-transform":"scale(0)",
        "transition": "-webkit-transform 0.5s linear"
    });

    //bring in winner text
    $("#winner").addClass("bigEntrance");

    //flash the explosions
    setTimeout(function () {
        emitter(3,500);
    },50);

    //display congrats tip screen
    setTimeout(function () {
        $("#innerboard").fadeOut();
    },2700);
    setTimeout(function () {
        $("#winnerboard").fadeIn();
    },2700);
    setTimeout(function () {
        tipscreenshown = true;
    },5500);
    //after some time return to idle screen
    if(idleTimeout){
        clearTimeout(idleTimeout);
        idleTimeout = null;
    }
    idleTimeout = setTimeout(function () {
        idlegame();
    },timetoidleAfterWin);
            
}

///////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////
function postWin(){
 var prizeid = $(".outer.p" + prizeWon+" .circle").attr("data-index");
        var data = { "prizeid": prizeid };
        //post the id of the prize won so we can subtract its quantity from the db
        $.ajax({
            url: "WinnerHandler.ashx",
            data: data,
            type: 'POST',
            success: function (response) {
                //get prize name & show on win screen
                var data = JSON.parse(response);
                var img = new Image();
                img.src = data.tipimage;
                img.onload = function(){
                    var w = img.naturalWidth;
                    var h = img.naturalHeight;
                    $("#tipimage").html("<img src="+data.tipimage+" />");                     
                    $(".wonprizename").text(data.name);
                    $("#tip").html("<b>TIP</b>:<br>"+data.tip);                    
                }
               
            },
            error: function (response) {
                console.log(response);
            }
        });
        //console.log(prizeWon);
}

/////////////////////////////////////////////////////////////////////	
//Capture #1 Button hit
/////////////////////////////////////////////////////////////////////
document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode == 49 && gameStarted && boardBuilt && !timedOut && !tipscreenshown) { //if the user presses 1, the game has been started already and the board built then player has pressed to win
        buttonPressed = true; //stops the rotating selector        
       $("#audioTickTock")[0].pause();
    }
//     if (e.keyCode == 49 && !prizesavailable && gameStarted) { //if there are no prizes left and user presses 1, reset to idle & hide no prize screen
//        idlegame(); 
//    }
    if (e.keyCode == 49 && !gameStarted) { //if user presses 1 & games hasnt started then start game        
        gameStarted = true;
        $("#hiddentrigger").click();      
     
    }   
     if (e.keyCode == 49 && tipscreenshown){ //if 1 is pressed & the tip screen has been shown then reset to idle
         //remove the emitter divs
        $(".emitterflash").remove();
        //make sure selector stops flashing
        clearTimeout(flashwinnerselector);
        flashwinnerselector = null;
        idlegame();       
        if(playaudio){
            $("#audioGameBell")[0].pause(); 
            $("#audioCheer")[0].pause(); 
        }
     }
      if (e.keyCode == 49 && timedOut){ //if the user timed out & presses button, rebuild the board & start again
        if(playaudio){
            $("#audioTimesUp")[0].pause();
            $("#audioTickTock")[0].pause();
        }
        //start the gradient again
        if(runGradient){
            backgroundgradient();
        }
        loadGameImages(); //load a new set of images/prizes to be played
        putGameImagesOnBoard();
        resetVariables();  
        gameStarted = true;     
        $("#prizemelogo").hide();
        $("#wanttoplay").css("transform", "scale(0)");
        $("#gameboard").show();
        $(".outer, .circle").css({
                "transform": "scale(0)"
                });
        $("#getready").css({
            "-webkit-transform":"scale(0)"
        });
        clearTimeout(idleTimeout);
        if(runGradient){
           backgroundgradient();
        }
        setTimeout(function () {
           BuildPrizes();
        }, 50); 
        //console.log("Timed Out ReStart Game");
      }
};

///////////////////////////////////////////
//Load a random list of prizes & nonprizes based on the backend algorithm
///////////////////////////////////////////
function loadGameImages(){
            $.ajax({
            url: "BuilderHandler.ashx",
            type: 'POST',
            data: "{}",
            success: function (response) { 
                if(response == "none"){
                    prizesavailable = false;
                }
                else{
                    prizesavailable = true;
                    gameimages = JSON.parse(response); 
                }                             
            },
            error: function (response) {
                console.log(response);
            }
        });
}
////////////////////////////////////////////////
//Places the game images into the circle divs
///////////////////////////////////////////////
function putGameImagesOnBoard(){
    var imgin = 0;
    $(".circle").each(function () {  
        var prizeid =  gameimages[imgin].id; 
        $(this).css("background-image", "url(" + gameimages[imgin].image + ")");
        $(this).attr("data-index", prizeid);
        $(this).attr("data-isnonprize", gameimages[imgin].isnonprize);
        imgin++;
     });
}

//preload images
function preload(sources) {
    if (sources.length) {
        var preloaderDiv = $('<div style="display: none;"></div>').prependTo(document.body);

        $.each(sources, function (i, source) {
            $("<img/>").attr("src", source).appendTo(preloaderDiv);

            if (i == (sources.length - 1)) {
                $(preloaderDiv).imagesLoaded(function () {
                    $(this).remove();
                });
            }
        });
    }
}

//get a list of random numbers to generate the images from
function generaterandom() {
    for (var n = 0; n < numcircles+1; n++) {
        var ran = Math.floor((Math.random() * imagelist.length) + 0);
        if (used.indexOf(ran) == -1) {
            used[used.length] = ran;
        }
        else {
            numcircles++;
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
//checks to see if the image is on the board & if it is, it checks for another
//also finds the image index in the circle having its background replaced 
//so we can remove that index from the list and add the new image index
//param ran is a random number
//param circle is the # of the circle having the image changed
//returns the unique random number
///////////////////////////////////////////////////////////////////////////
function getuniquerandomimage(ran, circle) {
    var currentimg = parseInt($(".circle.p" + circle).attr("data-index"));//index of the image being replaced
    var currentimglocation = imagesontheboard.indexOf(currentimg); //index of the images location in the imagesontheboard list
    while (imagesontheboard.indexOf(ran) != -1) {
        ran = Math.floor((Math.random() * imagelist.length) + 0);
    }
    if (currentimglocation != -1) {
        imagesontheboard[currentimglocation] = ran; //removes the index of the old image & adds the new image index to the imagesontheboard list
    }    
    return ran;
}

//******************************************************//
// Transition gradient*******************************//
//******************************************************//
function backgroundgradient(){
	var colors = new Array(
      [211,67,169],
	  [76,196,193],
	  [255,128,0],
	  [252,226,16],
	  [76,196,193],
	  [211,67,169]);
	
	var step = 0;
	//color table indices for: 
	// current color left
	// next color left
	// current color right
	// next color right
	var colorIndices = [0,1,2,3];
	
	//transition speed
	var gradientSpeed = 0.005;
	
	function updateGradient()
	{
	  if(gameStarted){
	    if ( $===undefined ) return;
	  
	    var c0_0 = colors[colorIndices[0]];
	    var c0_1 = colors[colorIndices[1]];
	    var c1_0 = colors[colorIndices[2]];
	    var c1_1 = colors[colorIndices[3]];
	
	    var istep = 1 - step;
	    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
	    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
	    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
	    var color1 = "rgb("+r1+","+g1+","+b1+")";
	
	    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
	    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
	    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
	    var color2 = "rgb("+r2+","+g2+","+b2+")";
	
	     $('#gameboard').css({
	       background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
		    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
	  
	      step += gradientSpeed;
	      if ( step >= 1 )
	      {
		    step %= 1;
		    colorIndices[0] = colorIndices[1];
		    colorIndices[2] = colorIndices[3];
		
		    //pick two new target color indices
		    //do not pick the same as the current one
		    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		
	      }
       }
	}
	
	bgInterval = setInterval(updateGradient,10);
}

///////////////////////////////////////
//Countdown
//FROM ROBIN NOGUIER'S PORTFOLIO
//////////////////////////////////////
function countdown(){
    // Create Countdown
    var Countdown = {
  
    // Backbone-like structure
    $el: $('.countdown'),
  
    // Params
    countdown_interval: null,
    total_seconds     : 0,
  
    // Initialize the countdown  
    init: function() {
    
    // DOM
	    this.$ = {    	
        seconds: this.$el.find('.bloc-time.sec .figure')
    };

    // Init countdown values
    this.values = {
        seconds: (finalcountdown/1000)+1,
    };
    
    // Initialize total seconds
    this.total_seconds = (finalcountdown/1000)+1;

    // Animate countdown     
        this.count();    
    
    },
  
    count: function() {
    
        var that    = this,       
            $sec_1  = this.$.seconds.eq(0),
            $sec_2  = this.$.seconds.eq(1);
             
            this.countdown_interval = setInterval(function() {
                if(playaudio && ticktock){            
                        $("#audioTickTock")[0].play();
                    }
                if(that.total_seconds > 0 && !buttonPressed) {
                    
                    --that.values.seconds;           
           
                    // Update DOM values
            

                    // Seconds
                    that.checkHour(that.values.seconds, $sec_1, $sec_2);

                    --that.total_seconds;
                }
                else {
                    clearInterval(that.countdown_interval);
                    if(playaudio && ticktock){            
                        $("#audioTickTock")[0].pause();
                    }
                }
        }, 1000);    
    },
  
    animateFigure: function($el, value) {
    
        var that         = this,
		        $top         = $el.find('.top'),
            $bottom      = $el.find('.bottom'),
            $back_top    = $el.find('.top-back'),
            $back_bottom = $el.find('.bottom-back');

    // Before we begin, change the back value
    $back_top.find('span').html(value);

    // Also change the back bottom value
    $back_bottom.find('span').html(value);

    // Then animate
    TweenMax.to($top, 0.8, {
        rotationX           : '-180deg',
        transformPerspective: 300,
	        ease                : Quart.easeOut,
        onComplete          : function() {

            $top.html(value);

            $bottom.html(value);

            TweenMax.set($top, { rotationX: 0 });
        }
    });

        TweenMax.to($back_top, 0.8, { 
            rotationX           : 0,
            transformPerspective: 300,
	            ease                : Quart.easeOut, 
            clearProps          : 'all' 
        });    
    },
  
        checkHour: function(value, $el_1, $el_2) {
    
            var val_1       = value.toString().charAt(0),
                val_2       = value.toString().charAt(1),
                fig_1_value = $el_1.find('.top').html(),
                fig_2_value = $el_2.find('.top').html();

            if(value >= 10) {

                // Animate only if the figure has changed
                if(fig_1_value !== val_1) this.animateFigure($el_1, val_1);
                if(fig_2_value !== val_2) this.animateFigure($el_2, val_2);
            }
            else {

                // If we are under 10, replace first figure with 0
                if(fig_1_value !== '0') this.animateFigure($el_1, 0);
                if(fig_2_value !== val_1) this.animateFigure($el_2, val_1);
            }    
        }
    };

    // Let's go !
    Countdown.init();
}

/////////////////////////////////////
//Flash circles on win screen
/////////////////////////////////////
function emitter(numbubbles, timebetween){
    var emitter = document.getElementById("emitter"),
    
    //the following variables make things configurable. Play around. 
    emitterSize = 100,
    dotQuantity = 45,
    dotSizeMax = 150,
    dotSizeMin = 10,
    speed = 1,
    gravity = 2;

    var containerlist = [];    
    var numstarorigins = numbubbles;// number of places dots are shot from on the winner screen
    var centerx = $("#gameboard").offset().left + $("#gameboard").width() /2 ;
    var centery = $("#gameboard").offset().top + $("#gameboard").height() /2 ;
    var xycoords = []; //places on the screen where to start the dots, need a set for each origin
    if(numbubbles == 1){
        xycoords = [[centerx,centery]];
    }
    if(numbubbles == 2){
        xycoords = [[centerx-450,centery],[centerx+430,centery]];
    }
    if(numbubbles == 3){
        xycoords = [[centerx-200,centery-200],[centerx,centery],[centerx+300,centery-200]];
    }
    if(numbubbles == 4){
        xycoords = [[centerx-450,centery],[centerx+430,centery],[centerx-450,centery],[centerx,centery]];
    }
    for(var h=0;h<numstarorigins;h++){    
        //we'll put all the dots into this container so that we can move the "explosion" wherever we please.
        var container = document.createElement("div");
        //setup the container with the appropriate styles
        container.className="emitterflash";
        container.style.cssText = "position:absolute; left:"+xycoords[h][0]+"px; top:"+xycoords[h][1]+"px; overflow:visible; z-index:5000; pointer-events:none;";
        document.body.appendChild(container);
        containerlist[containerlist.length] = container;
    }
    //just for this demo, we're making the emitter's size dynamic and we set xPercent/yPercent to -50 to accurately center it.
    TweenLite.set(emitter, {width:emitterSize, height:emitterSize, xPercent:-50, yPercent:-50});
    var f = 0;
    var explosion;
    (function winexplode(f) {        
        setTimeout(function () {
            //The "explosion" is just a TimelineLite instance that we can play()/restart() anytime. This helps ensure performance is solid (rather than recreating all the dots and animations every time the user clicks)
            
            if(f<containerlist.length){
                explosion = createExplosion(containerlist[f]);
                f++;
                winexplode(f); 
            }
        },timebetween);              
    })(f);
    

    function createExplosion(container) {
        var tl = new TimelineLite(),
            angle, length, dot, i, size;
        //create all the dots
        for (i = 0; i < dotQuantity; i++) {
        dot = document.createElement("div");
        dot.className = "dot";
        size = getRandom(dotSizeMin, dotSizeMax);
        container.appendChild(dot);
        angle = Math.random() * Math.PI * 2; //random angle
        //figure out the maximum distance from the center, factoring in the size of the dot (it must never go outside the circle), and then pick a random spot along that length where we'll plot the point. 
        length = Math.random() * (emitterSize / 2 - size / 2); 
        //place the dot at a random spot within the emitter, and set its size.
        TweenLite.set(dot, {
            x:Math.cos(angle) * length, 
            y:Math.sin(angle) * length, 
            width:size, 
            height:size, 
            xPercent:-50, 
            yPercent:-50,
            force3D:true
        });
        //this is where we do the animation...
            tl.to(dot, 1 + Math.random(), {
                opacity:0,
      
                /*physics2D:{
                angle:angle * 180 / Math.PI, //translate radians to degrees
                velocity:(50 + Math.random() * 250) * speed, //initial velocity
                gravity:100 * gravity //you could increase/decrease this to give gravity more or less pull
                }*/
      
                //if you'd rather not do physics, you could just animate out directly by using the following 2 lines instead of the physics2D:
                x:Math.cos(angle) * length * 24, 
                y:Math.sin(angle) * length * 24
            }, 0);
        }
        return tl;
    }

    //just pass this function an element and it'll move the explosion container to its center and play the explosion animation. 
    function explode(element) {
         var bounds = element.getBoundingClientRect();
         for(var h=0;h<containerlist.length;h++){
            TweenLite.set(containerlist[h], {x:bounds.left + bounds.width / 2, y:bounds.top + bounds.height / 2});
            explosion.restart();
        }
    }

    function getRandom(min, max) {
        return min + Math.random() * (max - min);
     }
}