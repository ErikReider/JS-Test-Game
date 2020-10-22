/**@type {HTMLSpanElement} */
var fpsSpan;
/**@type {HTMLCanvasElement} */
var fpsCanvas;
/**@type {CanvasRenderingContext2D} */
var fpsContext;

/**@type {HTMLSpanElement} */
var mapWidthSpan;

/**@type {HTMLSpanElement} */
var playerXSpan;
/**@type {HTMLSpanElement} */
var playerYSpan;
/**@type {HTMLSpanElement} */
var playerRealXSpan;
/**@type {HTMLSpanElement} */
var playerRealYSpan;

/**@type {HTMLSpanElement} */
var cameraXSpan;
/**@type {HTMLSpanElement} */
var cameraYSpan;

/**@type {HTMLSpanElement} */
var playerCollidingSpan;

/**@type {HTMLSpanElement} */
var mappedCord1;
/**@type {HTMLSpanElement} */
var mappedCord2;

var FPSTimes = [];
let fpsGraphArray = [];
const fpsGraphRefresh = 15;
let fpsGraphPointWidth = 0;
let fpsGraphPointHeight = 0;

let devActive = false;

function initDevInfo(bool) {
    devActive = bool;
    if (!bool) return;
    fpsSpan = document.getElementById("FPS");
    fpsCanvas = document.getElementById("FPSCanvas");
    fpsContext = fpsCanvas.getContext("2d");
    fpsContext.strokeStyle = "red";
    fpsContext.lineWidth = 2;
    fpsGraphPointWidth = fpsCanvas.width / fpsGraphRefresh;
    fpsGraphPointHeight = fpsCanvas.height / GAMEFPS;

    mapWidthSpan = document.getElementById("MapWidth");

    playerXSpan = document.getElementById("PlayerX");
    playerYSpan = document.getElementById("PlayerY");
    playerRealXSpan = document.getElementById("PlayerRealX");
    playerRealYSpan = document.getElementById("PlayerRealY");

    cameraXSpan = document.getElementById("CameraX");
    cameraYSpan = document.getElementById("CameraY");

    playerCollidingSpan = document.getElementById("PlayerColliding");

    mappedCord1 = document.getElementById("MappedCord1");
    mappedCord2 = document.getElementById("MappedCord2");
}

function devFPSInit() {
    if (!devActive) return;
    raf(fpsRefresh);
    setInterval(() => {
        let fps = FPSTimes.length;
        fpsSpan.innerHTML = "FPS: " + fps;
        updateFPSGraph(fps);
    }, 50);

}

function fpsRefresh() {
    const now = performance.now();
    while (FPSTimes.length > 0 && FPSTimes[0] <= now - 1000) {
        FPSTimes.shift();
    }
    FPSTimes.push(now);
    raf(fpsRefresh);
}

function updateFPSGraph(fps) {
    if (fpsGraphArray.length > fpsGraphRefresh) {
        fpsGraphArray.shift();
    }
    fpsGraphArray[fpsGraphArray.length] = fps;
    fpsContext.clearRect(0, 0, fpsCanvas.width, fpsCanvas.height);
    fpsContext.beginPath();
    for (let index = 0, length = fpsGraphArray.length; index < length; index++) {
        let x = fpsGraphPointWidth * index;
        let y = fpsCanvas.height - fpsGraphPointHeight * fpsGraphArray[index];
        // fpsContext.arc(x, y, 5, 0, 2 * Math.PI, true);
        // fpsContext.fill();
        fpsContext.lineTo(x, y);
        fpsContext.stroke();
    }
}

function devSetMapWidth(width) {

    if (!mapWidthSpan || !devActive) return;
    mapWidthSpan.innerHTML = "Map W: " + width + "px";
}

function devSetPlayerCoords(x, y) {
    if (!playerXSpan || !playerYSpan || !devActive) return;
    playerXSpan.innerHTML = "Player X: " + parseInt(x) + "px";
    playerYSpan.innerHTML = "Player Y: " + parseInt(y) + "px";
}

function devSetRealPlayerCoords(x, y) {
    if (!playerXSpan || !playerYSpan || !devActive) return;
    playerRealXSpan.innerHTML = "Real Player X: " + parseInt(x) + "px";
    playerRealYSpan.innerHTML = "Real Player Y: " + parseInt(y) + "px";
}

function devSetCameraCoords(x, y) {
    if (!cameraXSpan || !cameraYSpan || !devActive) return;
    cameraXSpan.innerHTML = "Camera X: " + parseInt(x) + "px";
    cameraYSpan.innerHTML = "Camera Y: " + parseInt(y) + "px";
}

/*TODO: broken right now */
function devSetPlayerColliding(bool) {
    if (!devActive) return;
    if (!bool) bool = false;
    playerCollidingSpan.innerHTML = "Player Colliding: " + bool;
}

/**@param {Array} map */
function mappedCoords(map) {
    if (!map || !mappedCord1 || !mappedCord2) return;
    mappedCord1.innerText = map[0];
    mappedCord2.innerText = map[map.length - 1];
}