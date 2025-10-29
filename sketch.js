// Elementos DOM
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");

//ml5 variables
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
let mouthOpen = false;

// Crear y centrar canvas dentro de #sketch-holder
function createResponsiveCanvas() {
  const holder = document.getElementById("sketch-holder");
  const maxW = Math.min(holder.clientWidth, 720); // límite de ancho
  const w = Math.max(320, maxW);
  const h = Math.round(w * 0.75); // relación 4:3  //relación 16:10 (0.62)
  const c = createCanvas(w, h);
  // const c = createCanvas(640, 480);
  c.parent("sketch-holder");
  pixelDensity(1);
}

// Escalar coordenadas del punto detectado al tamaño del canvas
function scaleX(x) {
  return x * (width / video.width);
}

function scaleY(y) {
  return y * (height / video.height);
}

function preload() {
  faceMesh = ml5.faceMesh(options);
  terrorFont = loadFont("fonts/HelpMe.ttf");

  // fonts[0] = loadFont("fonts/BebasNeue-Regular.ttf");
  // fonts[1] = loadFont("fonts/Kanit-Black.ttf");
  // fonts[2] = loadFont("fonts/Roboto-Regular.ttf");
}

function setup() {
  createResponsiveCanvas();

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  frameRate(24);
  background(220);
  mouthOpen = isMouthOpen();
  
  image(video, 0, 0, width, height);
  
  // drawEyes();
  mouthOpen  ? flickeringLightFilter() : nocturnFilter();

  drawText();
}

function drawText() {
  // textFont(terrorFont);
  textSize(14);
  fill(255);
  noStroke();
  textAlign(LEFT, BOTTOM);
  text("Sun and Moon icons designed by Freepik", 10, height - 10);
}


function nocturnFilter(){
loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    let gray = 0.3 * r + 0.59 * g + 0.11 * b;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
  }
  updatePixels();

  blendMode(MULTIPLY);
  noStroke();
  fill(80, 45, 45, 180); // rojo oscuro semitransparente
  rect(0, 0, width, height);
  blendMode(BLEND);
}

function flickeringLightFilter(){
  // 1️⃣ Filtro gris + ruido en una sola lectura
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    let gray = 0.3 * r + 0.59 * g + 0.11 * b;
    let n = random(-25, 25); // ruido
    gray = constrain(gray + n, 0, 255);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
  }
  updatePixels();

  // 2️⃣ Filtro rojo 
  blendMode(MULTIPLY);
  noStroke();
  fill(0, 0, 120, random(120, 180)); // parpadeo leve
  rect(0, 0, width, height);
  blendMode(BLEND);
}

function drawEyes() {
  if (faces.length > 0) {
    const f = faces[0];

    if (f.leftEye && f.rightEye) {
      // Escalar coordenadas al tamaño del canvas
      let leftEye = createVector(scaleX(f.leftEye.centerX), scaleY(f.leftEye.centerY));
      let rightEye = createVector(scaleX(f.rightEye.centerX), scaleY(f.rightEye.centerY));
      let leftEyeWidth= scaleX(f.leftEye.width);
      let rightEyeWidth = scaleX(f.rightEye.width);

      // Dibujar círculos
      noFill();
      stroke(0, 255, 0);
      strokeWeight(2);
      ellipse(leftEye.x, leftEye.y, leftEyeWidth * 1.5, leftEyeWidth * 1.5); // ojo izquierdo
      ellipse(rightEye.x, rightEye.y, rightEyeWidth  * 1.5, rightEyeWidth  * 1.5); // ojo derecho
    }
  }
}

function isMouthOpen(){
  if (faces.length > 0 && faces[0].lips) {
    let lips = faces[0].lips;
    let topLeftLip = createVector(scaleX(lips.x), scaleY(lips.y));
    let bottomRightLip = createVector(scaleX(lips.x + lips.width), scaleY(lips.y + lips.height));
    // let centerLip = createVector(scaleX(lips.centerX), scaleY(lips.centerY));
    // noFill();
    // stroke(0, 255, 0);

    // ellipse(topLeftLip.x, topLeftLip.y, 10, 10);
    // ellipse(bottomRightLip.x, bottomRightLip.y, 10, 10);
    // ellipse(centerLip.x, centerLip.y, 10, 10);

    let lipDistance = dist(
      topLeftLip.x,
      topLeftLip.y,
      bottomRightLip.x,
      bottomRightLip.y
    );
    
    if (lipDistance > 100) {
      return true;
    } else if(lipDistance < 95) {
      return false;
    }
  }
}

function trigger(message){
  console.log(message, ":D");
}

function gotFaces(results) {
  faces = results;
}
