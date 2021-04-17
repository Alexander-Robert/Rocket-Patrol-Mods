class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load images/tile sprites
        this.load.image('p1', './assets/doughnut/player-1.png');
        this.load.image('p2', './assets/doughnut/player-2.png');
        this.load.image('p3', './assets/doughnut/player-3.png');
        this.load.image('p4', './assets/doughnut/player-4.png');
        this.load.image('street', './assets/street/street.png');
        
        //load spritesheets
        this.load.spritesheet('cop', './assets/cop/cop-spritesheet.png', {
            frameWidth: 61,
            frameHeight: 32,
        });
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }
    create() { //remember last things added in create are made first!!!!
        //place street
        this.street = this.add.tileSprite(0, 0,
            game.config.width, game.config.height, 'street').setOrigin(0, 0);

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


        //animation config
        this.walkAnimation = this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('cop', {
                start: 0,
                end: 7,
            }),
            frameRate: game.settings.guardSpeed * 4,
            repeat: -1,
        });

        //add (x(spawn amount)) amount of guards
        this.guards = new Array;
        for (let i = 0; i < game.settings.spawnAmount && i < 5; i++) {
            //cap the spawn amount to be 5. ySpacing prevents graphical errors if spawnAmount > 5
            let ySpacing = (game.settings.spawnAmount > 5) ? 5 : game.settings.spawnAmount;
            this.guards.push(new Guard(this, Phaser.Math.Between(0, game.config.width),
                (borderUISize * ((2 * ySpacing) - (i))) + (borderPadding * (2 * (2 - i))),
                'cop', 0, 10 * (i + 1)).setOrigin(0, 0));
            this.guards[i].play('walk');
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
        this.playerPropertyArray = [
            {
                image: 'p1',
                left: keyLEFT,
                right: keyRIGHT,
                fire: keyUP
            },
            {
                image: 'p2',
                left: keyA,
                right: keyD,
                fire: keyW
            },
            {
                image: 'p3',
                left: keyF,
                right: keyH,
                fire: keyT
            },
            {
                image: 'p4',
                left: keyJ,
                right: keyL,
                fire: keyI
            }
        ];

        //add doughnut(s) (players[1-4])
        this.doughnuts = new Array;
        for (let i = 0; i < game.settings.players; i++) {
            this.doughnuts.push(new Doughnut(this, game.config.width / (1.25 + i),
                game.config.height - borderUISize - borderPadding, 
                this.playerPropertyArray[i].image,
                this.playerPropertyArray[i].left, 
                this.playerPropertyArray[i].right, 
                this.playerPropertyArray[i].fire));
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

        this.toggleSpeed = true; //used to speed up guards past 30 seconds left

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
            for(let guard of this.guards){
                guard.stop(null,true);
            }
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
        
        //update while game is going
        if (!this.gameOver) {
            this.updateTime(this.guards);
            for (let doughnut of this.doughnuts)
                doughnut.update();
            //update all guards
            for (let guard of this.guards)
                guard.update();
        }

        //check collisions
        for (let doughnut of this.doughnuts) {
            for (let guard of this.guards) {
                if (this.checkCollision(doughnut, guard)) {
                    doughnut.reset();
                    this.guardExplode(guard);
                }
            }
        }
    }

    checkCollision(doughnut, guard) {
        //simple AABB checking
        if (doughnut.x < guard.x + guard.width &&
            doughnut.x + doughnut.width > guard.x &&
            doughnut.y < guard.y + guard.height &&
            doughnut.height + doughnut.y > guard.y) {
            return true;
        }
        else {
            return false;
        }
    }

    guardExplode(guard) {
        //temporarily hide guard
        guard.alpha = 0;
        //create explosion sprite at guard's position
        let boom = this.add.sprite(guard.x, guard.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            guard.reset();                         // reset guard position
            guard.alpha = 1;                       // make guard visible again
            boom.destroy();                       // remove explosion sprite
        });
        //score add and repaint
        this.p1Score += guard.points;
        game.settings.gameTimer += guard.points * 50;
        this.clock.delay += guard.points * 50;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    updateTime(guardArray) {
        this.timer = Math.ceil((game.settings.gameTimer - this.clock.getElapsed()) / 1000);
        this.clockRight.text = 'Time: ' + this.timer;

        if (this.toggleSpeed && this.timer < 30) {
            this.toggleSpeed = false;
            for (let guard of guardArray) {
                this.walkAnimation.frameRate = guard.moveSpeed * 4;
                guard.moveSpeed *= 2;
            }
        }
    }
}