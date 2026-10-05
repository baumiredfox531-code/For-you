var C = document.getElementById("c");
var Ctx = C.getContext("2d");
var Cw;
var Ch;
var canvasScale;

var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cw = c.width = 400,
  cx = cw / 2;
var ch = c.height = 400,
  cy = ch / 2;
var rad = Math.PI / 180;
var frames = 0;
var stopped = true;
var requestId;
var animationStart;
var animationDuration = 6000;
var message = document.querySelector(".flower-note");
var messageTimer;
var Rx = 150,
  Ry = 150,
  kx = 3,
  ky = 4,
  x, y, x1, y1, x2, y2, t;
var petals = 7;

ctx.strokeStyle ="#8800ffff";
ctx.globalAlpha = .55;
ctx.lineWidth = .4;

function resizeCanvas() {
  var previousCanvas;
  if (stopped && C.width && C.height) {
    previousCanvas = document.createElement("canvas");
    previousCanvas.width = C.width;
    previousCanvas.height = C.height;
    previousCanvas.getContext("2d").drawImage(C, 0, 0);
  }

  Cw = C.width = window.innerWidth;
  Ch = C.height = window.innerHeight;
  canvasScale = Math.min(.75, Cw / 520, Ch / 520);
  Ctx.setTransform(canvasScale, 0, 0, canvasScale, Cw / 2, Ch / 2);

  if (previousCanvas) {
    var imageScale = Math.max(Cw / previousCanvas.width, Ch / previousCanvas.height);
    var imageWidth = previousCanvas.width * imageScale;
    var imageHeight = previousCanvas.height * imageScale;
    Ctx.setTransform(1, 0, 0, 1, 0, 0);
    Ctx.drawImage(previousCanvas, (Cw - imageWidth) / 2, (Ch - imageHeight) / 2, imageWidth, imageHeight);
    Ctx.setTransform(canvasScale, 0, 0, canvasScale, Cw / 2, Ch / 2);
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function Draw(timestamp) {
  if (stopped) return;

  var progress = Math.min((timestamp - animationStart) / animationDuration, 1);
  frames = progress * 360;
  Ctx.setTransform(1, 0, 0, 1, 0, 0);
  Ctx.clearRect(0, 0, Cw, Ch);
  Ctx.setTransform(canvasScale, 0, 0, canvasScale, Cw / 2, Ch / 2);
  t = frames * rad;
  rx = Rx * Math.abs(Math.cos(t)) + 50;
  ry = Ry * Math.abs(Math.sin(t)) + 50;

  x = cx + rx * Math.sin(kx * t + Math.PI / 2);
  y = cy + ry * Math.sin(ky * t + Math.PI / 2);

  x1 = cx + rx * Math.sin(kx * t + Math.PI);
  y1 = cy - ry * Math.sin(ky * t + Math.PI);

  x2 = cx + rx * Math.sin(kx * t);
  y2 = cy - ry * Math.sin(ky * t);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x1, y1, x2, y2);
  ctx.stroke();
  ctx.globalCompositeOperation = "lighter";

  var img = c;
  //Ctx[i].fillRect(-cw, -ch, cw, ch);

  for (var i = 0; i < petals; i++) {
    Ctx.globalCompositeOperation = "source-over";
    Ctx.drawImage(img, -200, -400);
    Ctx.rotate(2 * Math.PI / petals);
  }

  if (progress < 1) {
    requestId = window.requestAnimationFrame(Draw);
  } else {
    stopped = true;
    requestId = undefined;
    messageTimer = window.setTimeout(function() {
      message.classList.add("is-visible");
    }, 350);
  }
}

function start() {
  window.clearTimeout(messageTimer);
  message.classList.remove("is-visible");
  window.cancelAnimationFrame(requestId);
  ctx.clearRect(0, 0, cw, ch);
  frames = 0;
  stopped = false;
  animationStart = performance.now();
  requestId = window.requestAnimationFrame(Draw);
}
window.addEventListener("load", function() {
  start();
}, false);

C.addEventListener("click", function() {
  start();
}, false);