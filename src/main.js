let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 5;

//initialize high score
game.highScore = 0;

// reserve keyboard bindings
let keyDOWN, 
    keyUP, keyLEFT, keyRIGHT,
    keyW, keyA, keyD,
    keyT, keyF, keyH,
    keyI, keyJ, keyL;


/*
I recived help in debugging from Anya Osborne (TA), Colin O'Rourke, and Ardent:
    Anya Osborne: Helped debug issues with switching the explosion animation from a spritesheet to an atlas
    Colin O'Rourke: Helped debug displaing high score, gave me a better understanding of how bindings
should be scoped given their functionality and needed accessibility
    Ardent: Helped debug giving/recieving additional parameters in the rocket class and animating the spaceship objects
*/
//--------------------------------------------------------------------------------------------
/*
POINTS BREAKDOWN:
Implemented Mods:
-- Technical
Track a high score that persists across scenes and display it in the UI (5)
Implement the speed increase that happens after 30 seconds in the original game (5)
Randomize each spaceship's movement direction at the start of each play (5)
Allow the player to control the Rocket after it's fired (5)
Create 4 new explosion SFX ("nom nom") and randomize which one plays on impact (10)
Display the time remaining (in seconds) on the screen (10)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
Implement a simultaneous two-player mode (30)
-- ART
Create a new animated sprite for the Spaceship enemies (guards) (10)
Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20) 
-- CUSTOM 
    (For the custom mods I didn't have any specific point values assigned to it because I didn't ask.
    But assuming I didn't double dip at all the score should still be over 100.
    So attribute however many points you think is fair for these mods if I need them for the 100 points.)
custom difficulty, allows player to choose (number of spaceships(1-5), number of players(1-4), amount of time (15 - 60 seconds))
spaceship behavior (bloated guard)
implement mouse control for selecting the different variables for custom mode
easy, medium and hard difficulty
individual score counters per player

Total: 110 + (point amount you choose for custom mods)
*/