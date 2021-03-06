class Guard extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add Object to existing scene
        this.points = pointValue; //store pointValue
        this.moveSpeed = 3;       //pixels per frame
        this.bloated = 0;         //bloated behavior for eating doughnuts
        this.loop = 0;            //tracker on how many time the character as looped (reset() method)
        //randomly assign the direction of the guard during construction
        this.directions = {
            LEFT: "left",
            RIGHT: "right"
        }
        this.direction = (Phaser.Math.Between(0,1) == 0) ? this.directions.LEFT : this.directions.RIGHT;
        this.setFlipX(this.direction == this.directions.RIGHT);
    }

    update() {
        switch(this.direction){
            //move guard left
            case this.directions.LEFT:
                this.x -= this.moveSpeed;
        // wrap around from left to right edge
        if (this.x <= 0 - this.width)
            return this.reset();
                break;
            //move gaurd left
            case this.directions.RIGHT:
                this.x += this.moveSpeed;
        // wrap around from right to left edge
        if (this.x >= game.config.width - this.width + borderUISize)
            return this.reset();
                break;
            default:
                break;
        }
        return false;
    }

    // position reset
    reset() {
        if(this.direction == this.directions.LEFT)
        this.x = game.config.width;
        if(this.direction == this.directions.RIGHT)
        this.x = 0 - this.width;
        this.loop++;
        if((this.loop % 3 == 0) && this.loop != 0)
            return true;
        return false;
    }
}