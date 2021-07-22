"use strict";

const video = document.querySelector("#videoElement");
const canva = document.querySelector("#canvas1");
const ctx = canva.getContext("2d");
const gallery = document.querySelector("#picList");

const WIDTH = 640;
const HEIGHT = 480;

let state = 0;

const getVideo = () => {
  const constraints = {
    audio: false,
    video: {
      width: WIDTH,
      height: HEIGHT,
    },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      video.srcObject = mediaStream;
      video.onloadedmetada = (e) => {
        video.play();
      };
    })
    .catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
};

const paintCanvas = () => {
  canva.width = WIDTH;
  canva.height = HEIGHT;

  const draw = () => {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
    let pixels = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1;
    switch (state) {
      case 0:
        break;
      case 1:
        pixels = redEffect(pixels);
        break;
      case 2:
        pixels = rgbSplit(pixels);
        break;
      case 3:
        ctx.globalAlpha = 0.1;
        break;
    }
    ctx.putImageData(pixels, 0, 0);

    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
};

const redEffect = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = Math.min(pixels.data[i] + 100, 255);
    pixels.data[i + 1] = pixels.data[i + 1] * 0.5;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
};

const rgbSplit = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i];
    pixels.data[i + 500] = pixels.data[i + 1];
    pixels.data[i - 500] = pixels.data[i + 2];
  }
  return pixels;
};

const takePhoto = () => {
  // convert the current content of canvas to a jpeg image
  const data = canva.toDataURL("image/jpeg");
  // create a new element with anchor tag and link to image
  const link = document.createElement("a");
  link.href = data;
  // set attibute/default name to be set when downloading
  link.setAttribute("download", `${Date.now()}`);
  // content shown on node
  link.innerHTML = `<img src=${data} alt="Snapped Photo" />`;
  // insert the anchor element as first child of parent div
  gallery.insertBefore(link, gallery.firstChild);
};

document.querySelectorAll(".changer").forEach((element, index) => {
  element.addEventListener("click", () => {
    state = index;
  });
});
document.querySelector("#picClick").addEventListener("click", takePhoto);

video.addEventListener("canplay", paintCanvas);
getVideo();
