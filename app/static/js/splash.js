
let rotateImageIndex = 0;
const availableCenturyImages = ["14", "15", "16", "17", "18", "19"];

/**
 * Preloads the image and than replaces the current image
 * in the frame.
 * @param {*} url 
 * @param {*} frameImageFront 
 * @param {*} frameImageBack 
 * @param {*} useBoxFrameImageFront 
 */
let preloadImg = function (url, frameImageFront, frameImageBack, useBoxFrameImageFront) {
    let imgCache = new Image();

    imgCache.onload = function() {
        frameImageBack.attr("href", url)
        rotateImageIndex = (rotateImageIndex + 1) % availableCenturyImages.length;
        useBoxFrameImageFront.classed("crossfade", true);

        setTimeout(() => {
            frameImageFront.attr("href", url)
            useBoxFrameImageFront.classed("crossfade", false);
            setTimeout(() => { rotateImages(); }, 1000);
        }, 1500);
    };
    imgCache.src = url;
}

/**
 * Rotate the images in the frame.
 */
var rotateImages = function () {
    let useBoxFrameImageFront = d3.select(`#use-splash-frame-front`);
    let frameImageBack = d3.select(`#image-splash-frame-back`)
    let frameImageFront = d3.select(`#image-splash-frame-front`)

    let imgName = availableCenturyImages[rotateImageIndex];
    let url = `/static/img/century/${imgName}.jpg`

    preloadImg(url, frameImageFront, frameImageBack, useBoxFrameImageFront);
}


filterJSAddWindowLoadHook(rotateImages);