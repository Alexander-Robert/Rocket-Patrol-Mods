let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4; //pixels per frame

//initialize high score
game.highScore = 0;

// reserve keyboard bindings
let keyDOWN, 
    keyUP, keyLEFT, keyRIGHT,
    keyW, keyA, keyD,
    keyT, keyF, keyH,
    keyI, keyJ, keyL;