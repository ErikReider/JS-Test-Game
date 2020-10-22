/**@type {HTMLCanvasElement} */
let canvas;
/**@type {CanvasRenderingContext2D} */
var ctx;
/**@type {HTMLCanvasElement} */
let backgroundCanvas;
/**@type {CanvasRenderingContext2D} */
var backgroundCtx;

/**@type {Player} */
/** @type {Player} */
let player;
/** @type {Camera}*/
let camera;

let fpsWorker = new Worker("./js/fpsMeterWorker.js");

/**@type {Array} */
var listOfCollisions = [];

let raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

const GAMEFPS = 200;
const interval = 1000 / GAMEFPS;
let lastTime = performance.now();
let currentTime = 0;
let delta = 0;

let patternDirt, patternGrass;

function run() {
    raf(run);
    currentTime = performance.now();
    delta = (currentTime - lastTime);
    if (delta <= interval) {
        return;
    }
    while (delta > interval) {
        tick();
        delta -= interval;
    }
    lastTime = currentTime - delta;
}

function initElements() {
    backgroundCanvas = document.getElementById("backgroundCanvas");
    backgroundCtx = backgroundCanvas.getContext("2d");
    backgroundCtx.imageSmoothingEnabled = false;

    camera = new Camera();

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    healthBar = document.getElementById("HealthBarContent");
}

onload = (() => {
    initElements();
    let image = new Image();
    image.src = "./assets/sprite.png";
    onresize();
    player = new Player(ctx,
        70, 70,
        image, 50,
        Math.ceil(window.innerWidth / 2 - 35), 0,
        100, 5
    );

    for (let index = 0; index < 10; index++) {
        new Enemy(ctx,
            70, 70,
            image, 50,
            mapSize * Math.random(), 0,
            25, 20
        );
    }

    let img = new Image();
    img.onload = (() => {
        patternDirt = backgroundCtx.createPattern(img, "repeat");
        backgroundCtx.fillStyle = patternDirt;
        let imgStroke = new Image();
        imgStroke.onload = (() => {
            patternGrass = backgroundCtx.createPattern(imgStroke, "repeat");
            backgroundCtx.strokeStyle = patternGrass;
            backgroundCtx.lineWidth = groundStrokeWidth;
            init();
        });
        imgStroke.src = "./assets/grass.jpg";
    });
    img.src = "./assets/dirt.png";
});

onresize = (() => {
    mapSize = window.innerWidth * mapScale;
    devSetMapWidth(mapSize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    backgroundCtx.fillStyle = patternDirt;
    backgroundCtx.strokeStyle = patternGrass;
    backgroundCtx.lineWidth = 10;
});

function init() {
    raf(run);
    generateMap();
    initDevInfo(true);
    onresize();
    devFPSInit();
}

function tick() {
    listOfCollisions.forEach(element => {
        element.clear();
    });
    player.update();
    // fill2(map);
    // drawImage(ctx,"grass", new NumberRange(0, canvas.width), new NumberRange(canvas.height - 50, canvas.height));
    // ctx.drawImage(backgroundCanvas, 0, 0);
    listOfCollisions.forEach(element => {
        element.update();
    });
    // maxText.innerText = "Y: " + player.y;
    backgroundCtx.clearRect(0, 0, backgroundCtx.canvas.width, backgroundCtx.canvas.height);
    backgroundCtx.translate(camera.pos.x * -1, 0);
    backgroundCtx.fill(groundPath);
    backgroundCtx.stroke(groundPath);
    backgroundCtx.setTransform(1, 0, 0, 1, 0, 0);
    // drawLines(curvePoints);
    // fpsWorker.postMessage(null);

}