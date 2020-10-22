/**@type {HTMLDivElement} */
var box;
/**@type {HTMLDivElement} */
var floor;
/**@type {HTMLDivElement} */
var pipe;

/**@type {HTMLSpanElement} */
let fpsSpan;
/**@type {Number} */
let fps, number = 0;

var gravspeed = 0; //0
// var gravspeed = 5; //0
var gravity = 0;
// var gravity = 5;
var xSpeed = 0;

let starty = true;

onload = () => {
    // customElements.define("cube-element", Cube);
    box = document.getElementById("boxy");
    fpsSpan = document.getElementById("Framerate");

    floor = document.getElementById("floor");

    pipe = document.getElementById("obsticle");

    window.requestAnimationFrame(run);
}

const FPS = 120;
const interval = 1000 / FPS;
let lastTime = Date.now();
let currentTime = 0;
let delta = 0;

function run() {
    // gravspeed += gravity;
    window.requestAnimationFrame(run);

    currentTime = Date.now();
    delta = (currentTime - lastTime);

    if (delta <= interval) {
        return;
    }

    while (delta > interval) {
        yeet();
        delta -= interval;
    }

    lastTime = currentTime - delta;
}

function yeet() {
    box.style.top = (parseFloat(box.offsetTop) + gravspeed) + "px";
    box.style.left = (parseFloat(box.offsetLeft) + xSpeed) + "px";

    if (box.offsetLeft <= 0) {
        box.style.left = 0 + "px";
    }
    if (box.offsetTop <= 0) {
        box.style.top = 0 + "px";
    }
    if (box.offsetLeft >= document.body.clientWidth - box.clientWidth) {
        box.style.left = document.body.clientWidth - box.clientWidth + "px";
    }
    if (box.offsetTop + box.clientHeight >= floor.offsetTop) {
        box.style.top = floor.offsetTop - box.clientHeight + "px";
    }

    // onkeydown = (e => {
    //     switch (e.keyCode) {
    //         case 32:
    //         case 87:
    //             //W
    //             gravspeed = -5;
    //             // gravity = -0.01;
    //             break;
    //         case 65:
    //             //A
    //             // xSpeed = -9.82
    //             xSpeed = -5;
    //             break;
    //         case 83:
    //             //S
    //             gravspeed = 5;
    //             break;
    //         case 68:
    //             //D
    //             // xSpeed = 9.82;
    //             xSpeed = 5;
    //             break;
    //     }
    // });
    // onkeyup = (e => {
    //     switch (e.keyCode) {
    //         case 32:
    //         case 87:
    //             //W
    //             // gravspeed = 5;
    //             gravspeed = 0;
    //             // gravity = 1;
    //             break;
    //         case 65:
    //             //A
    //             xSpeed = 0;
    //             break;
    //         case 83:
    //             //S
    //             gravspeed = 0;
    //             break;
    //         case 68:
    //             //D
    //             xSpeed = 0;
    //             break;
    //     }
    // });

    if (isColliding(box, pipe)) {
        console.log("true");

        collision(box, pipe);
    }
}

/**
 * @param {HTMLElement} a 
 * @param {HTMLElement} b 
 */
function isColliding(a, b) {
    return !(
        a.offsetLeft + a.clientWidth <= b.offsetLeft ||
        a.offsetLeft >= b.offsetLeft + b.clientWidth ||
        a.offsetTop + a.clientHeight <= b.offsetTop ||
        a.offsetTop >= +b.offsetTop + b.clientHeight);
}

/**
 * @param {HTMLElement} mainObj 
 * @param {HTMLElement} obj 
 */
function collision(mainObj, obj) {
    //obj is the collision object
    let mainLeft = mainObj.offsetLeft;
    let mainRight = mainObj.offsetLeft + mainObj.clientWidth;
    let mainTop = mainObj.offsetTop;
    let mainBottom = mainObj.offsetTop + mainObj.clientHeight;

    let objLeft = obj.offsetLeft;
    let objRight = obj.offsetLeft + obj.clientWidth;
    let objTop = obj.offsetTop;
    let objBottom = obj.offsetTop + obj.clientHeight;

    if (mainObj.offsetLeft + mainObj.clientWidth > obj.offsetLeft && mainObj.offsetLeft < obj.offsetLeft) { // on obj's left side
        mainObj.style.left = obj.offsetLeft - mainObj.clientWidth + "px";
    }
    if (mainObj.offsetLeft < obj.offsetLeft + obj.width && mainObj.offsetLeft + mainObj.clientWidth > obj.offsetLeft + obj.clientWidth) { // on obj's right side
        mainObj.style.left = obj.offsetLeft + obj.clientWidth + "px";
    }

    if (mainObj.offsetTop + mainObj.clientHeight > obj.offsetTop && mainObj.offsetTop < obj.offsetTop) { // on obj's left side
        mainObj.style.top = obj.offsetTop - mainObj.clientHeight + "px";
    }
    if (mainObj.offsetTop < obj.offsetTop + obj.clientHeight && mainObj.offsetTop + mainObj.clientHeight > obj.offsetTop + obj.clientHeight) { // on obj's right side
        mainObj.style.top = obj.offsetTop + obj.clientHeight + "px";
    }






    // let crash = true;

    // if(mainBottom >= objTop && mainRight >= objLeft && mainLeft <= objRight){
    //     mainObj.s tyle.top = objTop - mainObj.clientHeight + "px";
    // }
    // if(mainRight >= objLeft && mainBottom >= objTop){

    // }

    // if (mainBottom > objTop && mainBottom <= objBottom) {
    //     if (mainRight >= objLeft && mainRight < objRight) {
    //         mainObj.style.left = objLeft - mainObj.clientWidth + "px";
    //     } else if (mainLeft <= objRight && mainLeft > objLeft) {
    //         mainObj.style.left = objRight + "px";
    //     }
    // } else if (mainBottom >= objTop) {
    //     mainObj.style.top = objTop - mainObj.clientHeight + "px";
    // }
    // if (((mainBottom < objTop) || (mainTop > objBottom) || (mainRight < objLeft) || (mainLeft > objRight))) {
    //     // console.log("sadas");
    // }

    // // console.log("mainBottom " + mainBottom);
    // // console.log("objBottom " + objBottom);

    // if ((mainBottom > objTop && mainTop < objBottom) && (mainRight > objLeft && mainLeft < objRight) && mainRight < objRight && mainBottom <= objBottom && mainTop >= objTop) {
    //     mainObj.style.left = objLeft - mainObj.clientWidth + "px";
    //     // console.log("dfsd");
    // } else if ((mainBottom > objTop && mainTop < objBottom) && (mainRight > objLeft && mainLeft < objRight) && mainLeft > objLeft && mainBottom <= objBottom && mainTop >= objTop) {
    //     mainObj.style.left = objRight + "px";
    //     // console.log("sdfsd");
    // }

    // if ((mainBottom > objTop) && (mainBottom < objBottom) && mainRight > objLeft && mainLeft < objRight) {
    //     mainObj.style.top = objTop - mainObj.clientHeight + "px";
    //     // console.log("hello");

    // } else if (mainBottom <= objBottom && mainTop >= objTop) {
    //     // console.log("hello222");

    // }
    // return crash;
}