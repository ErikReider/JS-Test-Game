class GameCube {
    /**
     * @param {Number} width the width of the cube
     * @param {Number} height The height of the cube
     * @param {String} color The color of the Cube
     * @param {Number} x X starting position
     * @param {Number} y Y starting position
     * @param {HTMLCanvasElement} canvas The canvas used
     * @param {Number} gravityX the X velocity of the Cube
     * @param {Number} gravityY the Y velocity of the Cube
     */
    constructor(width, height, color, x, y, canvas, gravityX, gravityY) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.gravityX = gravityX;
        this.gravityY = gravityY;
        this.update = (e => {
            this.context.fillStyle = this.color;
            this.context.strokeRect(this.x, this.y, this.width, this.height);
            this.context.lineWidth = 15;
            this.context.font = `${(this.height / 2) + "px"} Comic Sans MS`;
            this.context.fillText("hello", this.x, this.y);
            this.context.fillRect(this.x, this.y, this.width, this.height);
        });

        let xDirection = "right";
        let yDirection = "down";

        this.updatePos = (e => {
            let left = 0
            let right = this.canvas.width - this.width;
            let top = 0
            let bottom = this.canvas.height - this.height;
            //X
            if (this.x > right) {
                xDirection = "left";
            } else if (this.x < left) {
                xDirection = "right";
            }
            if (xDirection == "right") {
                this.x += this.gravityX;
            } else if (xDirection == "left") {
                this.x -= this.gravityX;
            }
            //Y
            if (this.y > bottom) {
                yDirection = "up";
            } else if (this.y < top) {
                yDirection = "down";
            }
            if (yDirection == "down") {
                this.y += this.gravityY;
            } else if (yDirection == "up") {
                this.y -= this.gravityY;
            }
        });
    }
    fullUpdate() {
        this.update();
        this.updatePos();
    }
}