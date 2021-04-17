class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

        //load button sprite sheet
        this.load.spritesheet('button', './assets/button-spritesheet.png',
            {
                frameWidth: 32,
                frameHeight: 32
            });
    }

    create() {
        //define settings to alter
        game.settings = {
            players: 1,
            spawnAmount: 3,
            spaceshipSpeed: 3,
            gameTimer: 60000
        }

        //menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        //show menu text
        this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding,
            'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2,
            'Use <--> arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding,
            'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 5,
            'HIGHSCORE: ' + game.highScore, menuConfig).setOrigin(0.5);

        //show options text
        this.add.text(borderUISize * 2, borderUISize - 10,
            'Players', menuConfig).setOrigin(0.5);
        this.add.text(borderUISize * 6, borderUISize - 10,
            'Guards', menuConfig).setOrigin(0.5);
        this.add.text(borderUISize * 10, borderUISize - 10,
            'Time', menuConfig).setOrigin(0.5);

        //show options numbers
        this.playerCount = this.add.text(borderUISize * 2, borderUISize * 3.5,
            game.settings.players, menuConfig).setOrigin(0.5);
        this.spawnCount = this.add.text(borderUISize * 6, borderUISize * 3.5,
            game.settings.spawnAmount, menuConfig).setOrigin(0.5);
        this.timeCount = this.add.text(borderUISize * 10, borderUISize * 3.5,
            (game.settings.gameTimer / 1000), menuConfig).setOrigin(0.5);

        //create array of button images
        this.buttons = [
            this.add.sprite(borderUISize * 2, borderUISize * 2, 'button'),
            this.add.sprite(borderUISize * 6, borderUISize * 2, 'button'),
            this.add.sprite(borderUISize * 10, borderUISize * 2, 'button'),
            this.add.sprite(borderUISize * 2, borderUISize * 5, 'button'),
            this.add.sprite(borderUISize * 6, borderUISize * 5, 'button'),
            this.add.sprite(borderUISize * 10, borderUISize * 5, 'button'),
            this.add.sprite(borderUISize * 14, borderUISize * 3.5, 'button')
        ];

        //initialize all buttons
        this.initializeButtons();

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings.spawnAmount = 3;
            game.settings.spaceshipSpeed = 3;
            game.settings.gameTimer = 60000;

            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            // medium mode
            game.settings.spawnAmount = 3;
            game.settings.spaceshipSpeed = 4;
            game.settings.gameTimer = 45000;
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings.spawnAmount = 5;
            game.settings.spaceshipSpeed = 5;
            game.settings.gameTimer = 5000; //30000
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }

        //update option numbers
        this.playerCount.text = game.settings.players;
        this.spawnCount.text = game.settings.spawnAmount;
        this.timeCount.text = (game.settings.gameTimer / 1000);
    }

    initializeButtons() {
        //set buttons to be interactive
        for (let i = 0; i < this.buttons.length; i++) {
            //align button directions
            this.buttons[i].angle += (this.buttons[i].y > borderUISize * 2) ? 90 : -90;
            this.buttons[this.buttons.length - 1].angle = 0; //TODO: make custom play button image
            //give each this.buttons[i] the correction click action
            switch (i) {
                case 0:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        if (game.settings.players < 4)
                            game.settings.players++;
                    };
                    break;
                case 1:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        if (game.settings.spawnAmount < 5)
                            game.settings.spawnAmount++;
                    };
                    break;
                case 2:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        if (game.settings.gameTimer < 60000)
                            game.settings.gameTimer += 5000;
                    };
                    break;
                case 3:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        if (game.settings.players > 1)
                            game.settings.players--;
                    };
                    break;
                case 4:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        if (game.settings.spawnAmount > 2)
                            game.settings.spawnAmount--;
                    };
                    break;
                case 5:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        if (game.settings.gameTimer > 15000)
                            game.settings.gameTimer -= 5000;
                    };
                    break;
                case 6:
                    this.buttons[i].click = function () {
                        //this.sound.play('sfx_select'); 
                        //this.scene.start('playScene');
                    };
                    break;
                default:
                    break;
            }
            //allows buttons to highlight and interact
            this.buttons[i].setInteractive({
                useHandCurson: true,
            });
            this.buttons[i].on('pointerdown', () => {
                this.buttons[i].setFrame(2);
                this.buttons[i].click();
            });
            this.buttons[i].on('pointerover', () => {
                this.buttons[i].setFrame(1);
            });
            this.buttons[i].on('pointerout', () => {
                this.buttons[i].setFrame(0);
            });
            this.buttons[i].on('pointerup', () => {
                this.buttons[i].setFrame(0);
            });
        }
    }
}