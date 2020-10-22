class Vector2D {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * @param {Array} array 
 * @param {Number} refNumber
 */
function indexOfClosest(array, refNumber) {
    let closest = Number.MAX_SAFE_INTEGER;
    let index = 1;
    for (let i = 0; i < array.length; i += 2) {
        let dist = Math.abs(refNumber - array[i]);
        if (dist < closest) {
            index = i;
            closest = dist;
        }
    }
    // maxText.innerText = "Index: " + index;
    return index;
}

function arrayTimeComarison() {
    let array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    array1 += array1;
    let start1;
    let array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    array2 += array2;
    let start2;

    start1 = performance.now();
    console.log("[] start");
    array1[array1.length] = 20;
    console.log("[] end: " + (Math.abs(start1 - performance.now())) + " " + array1);

    start2 = performance.now();
    console.log("push start");
    array2[array2.length] = 20;
    console.log("push end: " + (Math.abs(start1 - performance.now())) + " " + array2);
}

function combineArrays(array1, array2) {
    let arrayFinal = [];
    let length = Math.ceil((array1.length + array2.length) / 2);
    for (let index = 0; index < length; index++) {
        if (array1[index] !== undefined) {
            arrayFinal.push(array1[index]);
        }
        if (array2[index] !== undefined) {
            arrayFinal.push(array2[index]);
        }
    }
    return arrayFinal;
};

class NumberRange {
    constructor(start, end) {
        this.set(start, end);
    }

    set(start, end) {
        this.start = start;
        this.end = end;
    }
}
var textureJSON;

function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

/**
 * @param {String} name 
 * @param {NumberRange} widthRange 
 * @param {NumberRange} heightRange 
 */
function initBackground(topName, underName, widthRange, heightRange, size) {
    return new Promise((promise) => {
        fetch("./textures.json").then(res => res.json()).then(object => {
            textureJSON = object;
            let item = object.sky;
            if (!item) throw "Name not a texture";
            backgroundCanvas = document.createElement("canvas");
            backgroundCanvas.width = canvas.width;
            backgroundCanvas.height = canvas.height;
            backgroundCanvasContext = backgroundCanvas.getContext("2d");
            backgroundCanvasContext.imageSmoothingEnabled = false;
            for (let indexWidth = 0; indexWidth < canvas.width / size; indexWidth++) {
                for (let indexHeight = 0; indexHeight < canvas.height / size; indexHeight++) {
                    backgroundCanvasContext.drawImage(textureImage,
                        item.x * 16 - 16, item.y * 16 - 16,
                        16, 16,
                        indexWidth * size, indexHeight * size,
                        size, size
                    );
                }
            }
        }).then(() => {
            floorOffset = heightRange.end - heightRange.start;
            for (let indexWidth = 0; indexWidth < (widthRange.end - widthRange.start) / size; indexWidth++) {
                for (let indexHeight = 0; indexHeight < (heightRange.end - heightRange.start) / size; indexHeight++) {
                    let item = indexHeight == 0 ? textureJSON[topName] : textureJSON[underName];
                    backgroundCanvasContext.drawImage(textureImage,
                        item.x * 16 - 16, item.y * 16 - 16,
                        16, 16,
                        indexWidth * size, indexHeight * size + heightRange.start,
                        size, size
                    );
                }
            }
        }).then(() => promise(true));
    });
}