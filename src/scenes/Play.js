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
        //load atlases
        this.load.atlas('explosion', './assets/cop/explode-sheet.png', 
            'assets/cop/explode.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        this.load.atlas('fat', 'assets/cop/fat-spritesheet.png',
            'assets/cop/fat-sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }
    create() { //remember last things added in create are made first!!!!
        //place street
        this.street = this.add.tileSprite(0, 0,
            game.config.width, game.config.height, 'street').setOrigin(0, 0);

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
        //guards is an array of objects, the objects are the guard sprite from Guard class, and an array of fat sprites
        this.guards = new Array;
        this.fatLabels = ['fat1', 'fat2', 'fat3'];

        for (let i = 0; i < game.settings.spawnAmount && i < 5; i++) {
            //cap the spawn amount to be 5. ySpacing prevents graphical errors if spawnAmount > 5
            let ySpacing = (game.settings.spawnAmount > 5) ? 5 : game.settings.spawnAmount;
            this.guards.push({
                sprite: new Guard(this, Phaser.Math.Between(0, game.config.width),
                    (borderUISize * ((1.5 * ySpacing) - (i))) + (borderPadding * (5 * (2 - i))),
                    'cop', 0, 10 * (i + 1)).setOrigin(0, 0),
                fat: []
            });
            //create fatImages
            for (let j = 0; j < this.fatLabels.length; j++) {
                //add each fat image to the array
                this.guards[i].fat[j] = this.add.sprite(
                    this.guards[i].sprite.x + (this.guards[i].sprite.width / 2),
                    this.guards[i].sprite.y + (this.guards[i].sprite.height / 2),
                    'fat', this.fatLabels[j]);
                //flip fat image to the correct direction
                this.guards[i].fat[j].flipX = (this.guards[i].sprite.direction == 'right');
                //make fat invisible initially
                this.guards[i].fat[j].alpha = 0;
            }
            //set each sprite image depth above the fat images
            this.guards[i].sprite.setDepth(this.guards[i].fat[this.guards[i].fat.length - 1].depth + 1);
            //play the walking animation for the gaurd's sprite
            this.guards[i].sprite.play('walk');
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
        }
        this.scores = {
            pointAmount:[],
            scoreBox: []
        };

        //add doughnut(s) (players[1-4]) and add individual scores
        this.doughnuts = new Array;
        for (let i = 0; i < game.settings.players; i++) {
            this.doughnuts.push(new Doughnut(this, game.config.width / (1.25 + i),
                game.config.height - borderUISize + borderPadding,
                this.playerPropertyArray[i].image,
                this.playerPropertyArray[i].left,
                this.playerPropertyArray[i].right,
                this.playerPropertyArray[i].fire,
                i)); //i is the player ID number
            //initialize scores
            this.scores.pointAmount.push(0);
            this.scores.scoreBox.push(this.add.text((borderUISize + borderPadding) + (i * 100), 
            borderPadding, this.scores.pointAmount[i], scoreConfig));
            this.add.image((borderUISize + borderPadding) + (i * 100) + 70,
            borderPadding + 18, this.playerPropertyArray[i].image);
        }

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 4,
                first: 0
            }),
            duration: 10,
            frameRate: 10
        });

        //initialize timer
        this.timer = 0;

        this.toggleSpeed = true; //used to speed up guards past 30 seconds left

        //GAME OVER flag
        this.gameOver = false;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            for (let guard of this.guards) {
                guard.sprite.stop(null, true);
            }
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', 
            scoreConfig).setOrigin(0.5).setDepth(100);
            this.add.text(game.config.width / 2, game.config.height / 2 + 128, 'Press ↓ to Restart or ← for Menu',
                scoreConfig).setOrigin(0.5).setDepth(100);
            this.clockRight.text = 'Time: ' + 0;
            let winnerString = "";
            for(let i = 0; i < this.scores.pointAmount.length; i++){
                if (this.scores.pointAmount[i] > game.highScore){
                    game.highScore = this.scores.pointAmount[i];
                    winnerString = " player " + (i+1) + " wins!";
                }
            }
            this.add.text(game.config.width / 2, game.config.height / 2 + 64,
                'HIGHSCORE: ' + game.highScore + winnerString,
                scoreConfig).setOrigin(0.5).setDepth(100);
            this.gameOver = true;
        }, null, this);

        //display clock
        this.clockRight = this.add.text(game.config.width / 2 + borderUISize * 4.5,
            borderPadding, 'Time: ' + (game.settings.gameTimer / 1000), scoreConfig);
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
            //update all doughnuts
            for (let doughnut of this.doughnuts)
                doughnut.update();
            //update all guards
            for (let guard of this.guards) {
                //update and check if the guard should lose weight
                if((guard.sprite.update()) && (guard.sprite.bloated != 0))
                    this.loseWeight(guard);
                //anchor fat images to guards
                for (let fatImages of guard.fat) {
                    fatImages.x = guard.sprite.x + (guard.sprite.width / 2);
                    fatImages.y = guard.sprite.y + (guard.sprite.height / 2);
                }
            }
        }

        //check collisions
        for (let doughnut of this.doughnuts) {
            for (let guard of this.guards) {
                if (this.checkCollision(doughnut, guard.sprite)) {
                    doughnut.reset();
                    this.getFatter(doughnut, guard);
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

    //check if guard has looped enough to lose weight
    loseWeight(guard) {
        //hide previous fat image
        guard.fat[guard.sprite.bloated - 1].alpha = 0;
        guard.sprite.bloated--;
        guard.sprite.moveSpeed += 0.25;
        //display skinnier image
        if (guard.sprite.bloated != 0)
            guard.fat[guard.sprite.bloated - 1].alpha = 1;
        else
            guard.fat[0].alpha = 0;
    }

    //updates the gaurds image to be fatter or explode; awards individual points
    getFatter(doughnut, guard) {
        let pointsIncrement = 0;
        let timeIncrement = 0;
        //check if guard should get fat or explode
        //get fatter
        if (guard.sprite.bloated < 3) {
            //hide previous fat image
            if (guard.sprite.bloated != 0)
                guard.fat[guard.sprite.bloated - 1].alpha = 0;
            guard.sprite.bloated++;
            //display fatter image
            guard.fat[guard.sprite.bloated - 1].alpha = 1;
            //assign points based on the size of the guard and the depth (saved in guard.sprite.points)
            pointsIncrement = guard.sprite.bloated * 10 + guard.sprite.points;
            timeIncrement = guard.sprite.points;
            guard.sprite.moveSpeed -= 0.25;
            this.playRandomSound();
        }
        else { //explode guard
            //temporarily hide guard
            guard.sprite.alpha = 0;
            //temporarily hide guard's fat
            guard.fat[guard.fat.length - 1].alpha = 0;
            guard.sprite.bloated = 0;
            //create explosion sprite at guard's position
            let boom = this.add.sprite(guard.sprite.x + (guard.sprite.width / 2), 
            guard.sprite.y + (guard.sprite.height / 2), 'explosion').setOrigin(0.5, 0.5);
            boom.anims.play('explode');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                guard.sprite.reset();                         // reset guard position
                guard.sprite.moveSpeed = game.settings.guardSpeed;
                guard.sprite.alpha = 1;                       // make guard visible again
                boom.destroy();                       // remove explosion sprite
            });
            
            //play death sound effect
            this.sound.play("sfx_death");

            //assign points based on the depth (saved in guard.sprite.points)
            pointsIncrement = guard.sprite.points * 3;
            timeIncrement = guard.sprite.points * 2;
        }
        //add to individual score and timer
        console.log(doughnut.player);
        this.scores.pointAmount[doughnut.player] += pointsIncrement;
        this.scores.scoreBox[doughnut.player].text = this.scores.pointAmount[doughnut.player];
        game.settings.gameTimer += (timeIncrement * 50) / game.settings.players;
        this.clock.delay += (timeIncrement * 50) / game.settings.players;
    }

    playRandomSound() {
        switch(Math.floor(Math.random() * 4)) {
            case 0:
                this.sound.play('sfx_eating1');
                break;
            case 1:
                this.sound.play('sfx_eating2');
                break;
            case 2:
                this.sound.play('sfx_eating3');
                break;
            case 3:
                this.sound.play('sfx_eating4');
                break;
            default:
                console.log('Error: Invalid Sound');
        }
    }

    updateTime(guardArray) {
        this.timer = Math.ceil((game.settings.gameTimer - this.clock.getElapsed()) / 1000);
        this.clockRight.text = 'Time: ' + this.timer;

        if (this.toggleSpeed && this.timer < 30) {
            this.toggleSpeed = false;
            for (let guard of guardArray) {
                this.walkAnimation.frameRate = guard.sprite.moveSpeed * 4;
                guard.sprite.moveSpeed *= 2;
            }
        }
    }
}