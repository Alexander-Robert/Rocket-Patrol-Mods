// Rocket (player) prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, LEFT, RIGHT, FIRE, frame) {
        super(scene, x, y, texture, frame);

        //add Object to existing scene
        scene.add.existing(this);
        this.isFiring = false; //track rocket firing status
        this.moveSpeed = game.settings.spaceshipSpeed; //pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        this.LEFT = LEFT;
        this.RIGHT = RIGHT;
        this.FIRE = FIRE;
    }

    update() {
        // left/right movement
        if (this.LEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (this.RIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
        //fire button
        if (Phaser.Input.Keyboard.JustDown(this.FIRE) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); //play sfx
        }
        // if fired, move the rocket up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    //reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}