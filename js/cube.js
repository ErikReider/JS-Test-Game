var lastCameraX = 0;

class Cube {
    /**
     * @param {CanvasRenderingContext2D} ctx 2D canvas context
     * @param {Number} width Width
     * @param {Number} height Height
     * @param {HTMLImageElement} image Image element
     * @param {Number} mass Weight in kg. 0 or undefined or null = 50
     * @param {Number} x Start X
     * @param {Number} y Start Y
     */
    constructor(ctx, width, height, image, mass, x, y, type, health, damage) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.image = image;
        this.mass = mass || 50;
        this.x = x;
        this.initX = x;
        this.realX = x;
        this.y = y;
        this.initY = y;
        this.realY = y;
        this.baseHorizontalSpeed = 2;
        this.xSpeedLeft = 0;
        this.xSpeedRight = 0;
        this.initGravity = 0.0982;
        this.gravity = this.initGravity;
        this.gravitySpeed = 0;
        this.type = type;
        this.health = health;
        this.damage = damage;
    }

    collisionCanvas() {
        let nowX = camera.pos.x + this.x - (this.type === "enemy" ? this.baseHorizontalSpeed : 0);
        let nowY = this.y;
        if (this.x <= 0 && this.type !== "enemy") {
            this.x = 0;
        }
        if (nowY <= 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
        if (this.x >= this.ctx.canvas.width - this.width && this.type !== "enemy") {
            this.x = this.ctx.canvas.width - this.width;
        }
        if (backgroundCtx.isPointInPath(groundPath, parseInt(nowX + this.width / 2), parseInt(nowY + this.height + groundStrokeWidth / 2))) {
            let index = indexOfClosest(allCurvePoints, parseInt(nowX + this.width / 2));
            this.gravitySpeed = 0;
            this.y = parseInt((allCurvePoints[index + 1] || 0) - this.height - groundStrokeWidth / 2);
        }
        if (this.y + this.height /* + floorOffset */ >= this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.height /* - floorOffset */;
            this.gravitySpeed = 0;
        }
    }

    clear() {
        // this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawHitbox() {
        this.ctx.strokeStyle = "blue";
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.stroke();

        this.ctx.fillStyle = "red";

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 2 * Math.PI, 0, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width, this.y, 5, 2 * Math.PI, 0, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y + this.height, 5, 2 * Math.PI, 0, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width, this.y + this.height, 5, 2 * Math.PI, 0, false);
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class Enemy extends Cube {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} width 
     * @param {Number} height 
     * @param {HTMLImageElement} image 
     * @param {Number} mass 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(ctx, width, height, image, mass, x, y, health, damage) {
        super(ctx, width, height, image, mass, x, y, "enemy", health, damage);
        this.imageOffset = 0;
        this.upKeyValue = false;
        this.rightKeyValue = false;
        this.leftKeyValue = false;
        this.spriteOrientation = 1;
        this.lastAttack = 0;
        listOfCollisions.push(this);
    }

    attack() {
        if (performance.now() - this.lastAttack > 1000) {
            this.lastAttack = performance.now();
            if (parseInt(Math.random() * 10) < 7) {
                console.log("Attack");
                player.takeDamage(this.damage);
            }
        }
    }

    update() {
        if (camera.pos.x !== 0) {
            if (lastCameraX - camera.pos.x < 0) {
                this.x += this.baseHorizontalSpeed * -1;
            } else if (lastCameraX - camera.pos.x > 0) {
                this.x += this.baseHorizontalSpeed * 1;
            }
            this.realX = this.x;
        }
        this.gravitySpeed += this.gravity;
        this.y += this.gravitySpeed;
        this.gravity = this.initGravity;
        this.realY = this.y;
        this.collisionCanvas();
        this.ctx.save();
        if (this.spriteOrientation == -1) {
            this.ctx.translate(this.width, 0);
        }
        this.ctx.scale(this.spriteOrientation, 1);
        this.ctx.drawImage(
            //Image
            this.image,
            this.imageOffset, 0,
            this.image.width / 4, this.image.height,
            //Where
            this.x * this.spriteOrientation, this.y,
            this.width, this.height
        );
        this.ctx.restore();
        this.ctx.font = "16px Arial";
        // this.drawHitbox();
        // this.ctx.fillText(`X: ${parseInt(this.x)} Y: ${parseInt(this.y)}`, this.x, this.y);
    }
}

class Player extends Cube {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} width 
     * @param {Number} height 
     * @param {HTMLImageElement} image 
     * @param {Number} mass 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(ctx, width, height, image, mass, x, y, health, damage) {
        super(ctx, width, height, image, mass, x, y, "player", health, damage);
        this.imageOffset = 0;
        this.upKeyValue = false;
        this.rightKeyValue = false;
        this.leftKeyValue = false;
        this.spriteOrientation = 1;
        this.health = 100;
        camera.pos.x = 0;

        this.cameraMoving = false;

        this.testBool = false;

        onkeydown = (e => {
            if (e.key === "w" || e.key === "W" || e.key === "ArrowUp" || e.key === " ") {
                //Up
                if (!this.upKeyValue) {
                    if (Math.floor(this.gravitySpeed) == 0) {
                        this.jumpYStart = this.y;
                        this.gravity = -6;
                        this.upKeyValue = true;
                        this.wait = false;
                    }
                }
            }
            if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
                //Left
                this.xSpeedLeft = -1 * this.baseHorizontalSpeed;
                if (!this.leftKeyValue) {
                    this.leftSpiteInterval = setInterval(() => {
                        if (555 <= this.imageOffset) {
                            this.imageOffset = 0;
                        } else {
                            this.imageOffset = this.imageOffset + 185;
                        }
                    }, 100);
                    this.leftKeyValue = true;
                    this.spriteOrientation = -1;
                    // playerMoving = 1;
                }
            }
            if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
                //Down
            }
            if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
                //Right
                this.xSpeedRight = this.baseHorizontalSpeed;
                if (!this.rightKeyValue) {
                    this.rightSpiteInterval = setInterval(() => {
                        if (555 == this.imageOffset) {
                            this.imageOffset = 0;
                        } else {
                            this.imageOffset = this.imageOffset + 185;
                        }
                    }, 100);
                    this.rightKeyValue = true;
                    this.spriteOrientation = 1;
                    // playerMoving = -1;
                }
            }
        });

        onkeyup = (e => {
            if (e.key === "w" || e.key === "W" || e.key === "ArrowUp" || e.key === " ") {
                //W
                this.upKeyValue = false;
                this.gravity = this.initGravity;
            }
            if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
                //A
                this.xSpeedLeft = 0;
                clearInterval(this.leftSpiteInterval);
                this.leftKeyValue = false;
                this.imageOffset = 0;
                // playerMoving = 0;
            }
            if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
                //S
            }
            if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
                //D
                this.xSpeedRight = 0;
                clearInterval(this.rightSpiteInterval);
                this.rightKeyValue = false;
                this.imageOffset = 0;
                // playerMoving = 0;
            }
        });
    }

    takeDamage(damage) {
        setHealthBar(damage);
    }

    update() {
        lastCameraX = camera.pos.x;
        // this.updateVisiblePointsArray();
        let leftRightSpeed = (this.xSpeedLeft + this.xSpeedRight);
        if (camera.pos.x + leftRightSpeed < 0 || this.x < this.initX ||
            camera.pos.x + leftRightSpeed + this.ctx.canvas.width > mapSize || this.x + camera.pos.x > mapSize - this.initX) {
            this.x += leftRightSpeed;
            this.cameraMoving = false;
        } else {
            camera.pos.x += leftRightSpeed;
            this.cameraMoving = true;
        }
        this.realX = this.x + camera.pos.x;

        // this.collisionX(this);
        this.gravitySpeed += this.gravity;
        this.y += this.gravitySpeed;
        this.gravity = this.initGravity;
        this.realY = this.y + camera.pos.y;
        // this.collisionY(this);

        this.collisionCanvas();

        this.ctx.save();
        if (this.spriteOrientation == -1) {
            this.ctx.translate(this.width, 0);
        }
        this.ctx.scale(this.spriteOrientation, 1);
        this.ctx.drawImage(
            //Image
            this.image,
            this.imageOffset, 0,
            this.image.width / 4, this.image.height,
            //Where
            this.x * this.spriteOrientation, this.y,
            this.width, this.height
        );
        this.ctx.restore();

        devSetPlayerCoords(this.x, this.y);
        devSetCameraCoords(camera.pos.x, camera.pos.y);
        // devSetRealPlayerCoords(this.realX, this.realY);

        // this.drawHitbox();

        // this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        for (let index = 0; index < listOfCollisions.length; index++) {
            if (!this.testBool) {
                console.log(listOfCollisions[index])
            }
            let bool = this.isColliding(this, listOfCollisions[index]);
            devSetPlayerColliding(bool);
        }
        this.testBool = true;
    }

    updateVisiblePointsArray() {
        // let length = visiblePoints.length - 1;
        // if (visiblePoints[length - 1] <= camera.pos.x + this.x) {
        //     visiblePoints[length + 1] = (allCurvePoints[length + 1]);
        //     visiblePoints[length + 2] = (allCurvePoints[length + 2]);
        // }
        // minText.innerText = "items: " + visiblePoints.length;
    }

    /**
     * @param {Player} player 
     * @param {Enemy} collidedWith 
     */
    isColliding(player, collidedWith) {
        let isX = false;
        let isY = false;
        if (player.x + player.width > collidedWith.x && player.x < collidedWith.x) { // on obj's left side
            // collidedWith.attack();
            // return true;
            isX = true;
        }
        if (player.x < collidedWith.x + collidedWith.width && player.x + player.width > collidedWith.x + collidedWith.width) { // on obj's right side
            // collidedWith.attack();
            // return true;
            isX = true;
        }

        if (player.y + player.height > collidedWith.y && player.y < collidedWith.y) { // on obj's left side
            // console.log("onBottom")
            isY = true;
        }
        if (player.y < collidedWith.y + collidedWith.height && player.y + player.height > collidedWith.y + collidedWith.height) { // on obj's right side
            // console.log("onTOP")
            isY = true;
        }

        if (isX && isY) {
            collidedWith.attack();
            return true;
        }

        return false;
        // if (!(player.x + 10 < collidedWith.x) || !(player.x + 10 > collidedWith.x + collidedWith.width)) {
        //     if (player.x + player.width > collidedWith.x && player.x < collidedWith.x) { // on obj's left side
        //         return true;
        //     }
        //     if (player.x < collidedWith.x + collidedWith.width && player.x + player.width > collidedWith.x + collidedWith.width) { // on obj's right side
        //         return true;
        //     }
        //     return false;
        // }
        // return null;
    }

    collisionX(player) {
        // listOfCollisions.forEach(obj => {
        //     if (player.x + player.width > obj.x && player.x < obj.x) { // on obj's left side
        //         player.x = obj.x - player.width;
        //         // player.lastX = obj.x - player.width;
        //     }
        //     if (player.x < obj.x + obj.width && player.x + player.width > obj.x + obj.width) { // on obj's right side
        //         player.x = obj.x + obj.width;
        //         // player.lastX = obj.x + obj.width;
        //     }
        // });
    }

    collisionY(player) {
        // listOfCollisions.forEach(obj => {
        //     if (player.y + player.height > obj.y && player.y < obj.y) { // on obj's left side
        //         player.y = obj.y - player.height;
        //         // player.lastY = obj.y - player.height;
        //         player.gravitySpeed = 0;
        //     }
        //     if (player.y < obj.y + obj.height && player.y + player.height > obj.y + obj.height) { // on obj's right side
        //         player.y = obj.y + obj.height;
        //         // player.lastY = obj.y + obj.height;
        //         player.gravitySpeed = 0;
        //     }
        // });
    }
}