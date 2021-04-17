class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }
    create() { //remember last things added in create are made first!!!!
        //place starfield
        this.starfield = this.add.tileSprite(0, 0,
            game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding,
            game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        //white borders around game screen
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize,
            game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0,
            borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);


        //add (x(spawn amount)) amount of spaceships
        this.ships = new Array;
        for (let i = 0; i < game.settings.spawnAmount && i < 5; i++) {
            let ySpacing = (game.settings.spawnAmount > 5) ? 5 : game.settings.spawnAmount;
            this.ships.push(new Spaceship(this, Phaser.Math.Between(0, game.config.width),
                (borderUISize * ((2 * ySpacing) - (i))) + (borderPadding * (2 * (2 - i))),
                'spaceship', 0, 10 * (i + 1)).setOrigin(0, 0));
        }

        // define keys
        //restart key
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //player 1 controls
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //player 2 controls
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        //player 3 controls
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        //player 4 controls
        keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        //define key inputs for different players
        this.keyInputArray = [
            {
                left: keyLEFT,
                right: keyRIGHT,
                fire: keyUP
            },
            {
                left: keyA,
                right: keyD,
                fire: keyW
            },
            {
                left: keyF,
                right: keyH,
                fire: keyT
            },
            {
                left: keyJ,
                right: keyL,
                fire: keyI
            }
        ];

        //add rocket(s) (players[1-4])
        this.rockets = new Array;
        for (let i = 0; i < game.settings.players; i++) {
            this.rockets.push(new Rocket(this, game.config.width / (1.25 + i),
                game.config.height - borderUISize - borderPadding, 'rocket',
                this.keyInputArray[i].left, this.keyInputArray[i].right, this.keyInputArray[i].fire).setOrigin(0.5, 0));
        }

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });

        //initialize timer
        this.timer = 0;

        this.toggleSpeed = true; //used to speed up spaceships past 30 seconds left

        //initialize scores
        this.p1Score = 0;

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2,
            this.p1Score, scoreConfig);

        //GAME OVER flag
        this.gameOver = false;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 128, 'Press ↓ to Restart or ← for Menu',
                scoreConfig).setOrigin(0.5);
            this.clockRight.text = 'Time: ' + 0;
            if (this.p1Score > game.highScore)
                game.highScore = this.p1Score;
            this.add.text(game.config.width / 2, game.config.height / 2 + 64,
                'HIGHSCORE: ' + game.highScore, scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //display clock
        this.clockRight = this.add.text(game.config.width / 2 + borderUISize * 4.5,
            borderUISize + borderPadding * 2, 'Time: ' + (game.settings.gameTimer / 1000), scoreConfig);
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll background
        this.starfield.tilePositionX -= starSpeed;
        
        //update while game is going
        if (!this.gameOver) {
            this.updateTime(this.ships);
            for (let rocket of this.rockets)
                rocket.update();
            //update all shaceships
            for (let ship of this.ships)
                ship.update();
        }

        //check collisions
        for (let rocket of this.rockets) {
            for (let ship of this.ships) {
                if (this.checkCollision(rocket, ship)) {
                    rocket.reset();
                    this.shipExplode(ship);
                }
            }
        }
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        }
        else {
            return false;
        }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        //score add and repaint
        this.p1Score += ship.points;
        game.settings.gameTimer += ship.points * 50;
        this.clock.delay += ship.points * 50;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    updateTime(shipArray) {
        this.timer = Math.ceil((game.settings.gameTimer - this.clock.getElapsed()) / 1000);
        this.clockRight.text = 'Time: ' + this.timer;

        if (this.toggleSpeed && this.timer < 30) {
            this.toggleSpeed = false;
            for (let ship of shipArray) {
                ship.moveSpeed *= 2;
            }
        }
    }
}