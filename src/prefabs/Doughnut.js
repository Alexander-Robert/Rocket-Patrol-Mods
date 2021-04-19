// doughnut (player) prefab
class Doughnut extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, LEFT, RIGHT, FIRE, player, frame) {
        super(scene, x, y, texture, frame);

        //add Object to existing scene
        scene.add.existing(this);
        this.isFiring = false; //track doughnut firing status
        this.moveSpeed = 3; //pixels per frame
        this.sfxRocket = scene.sound.add('sfx_fire'); // add rocket sfx
        this.player = player //track which player this instance is
        this.LEFT = LEFT;
        this.RIGHT = RIGHT;
        this.FIRE = FIRE;
    }

    update() {
        this.spinSpeed = 3;
        // left/right movement
        if (this.LEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
            this.angle -= this.moveSpeed * this.spinSpeed;
        } else if (this.RIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
            this.angle += this.moveSpeed * this.spinSpeed;
        }
        //fire button
        if (Phaser.Input.Keyboard.JustDown(this.FIRE) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); //play sfx
        }
        // if fired, move the doughnut up
        if (this.isFiring && this.y >= borderUISize + this.height) {
            this.spinSpeed = 30;
            this.y -= this.moveSpeed;
        }

        if (this.y <= borderUISize + this.height) {
            this.spinSpeed = 3;
            this.reset();
        }
    }

    //reset doughnut to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize + borderPadding;
    }
}