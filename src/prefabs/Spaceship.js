class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add Object to existing scene
        this.points = pointValue; //store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;       //pixels per frame
        //randomly assign the direction of the spaceship during construction
        this.directions = {
            LEFT: "left",
            RIGHT: "right"
        }
        this.direction = (Phaser.Math.Between(0,1) == 0) ? this.directions.LEFT : this.directions.RIGHT; 
    }

    create(){
        this.x = game.config.width / 2;
    }

    update() {
        switch(this.direction){
            //move spaceship left
            case this.directions.LEFT:
                this.x -= this.moveSpeed;
        // wrap around from left to right edge
        if (this.x <= 0 - this.width)
            this.reset();
                break;
            //move spaceship left
            case this.directions.RIGHT:
                this.x += this.moveSpeed;
        // wrap around from right to left edge
        if (this.x >= game.config.width - this.width + borderUISize)
            this.reset();
                break;
            default:
                break;
        }
    }

    // position reset
    reset() {
        if(this.direction == this.directions.LEFT)
            this.x = game.config.width;
        if(this.direction == this.directions.RIGHT)
            this.x = 0 - this.width;
    }
}