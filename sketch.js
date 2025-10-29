// Elementos DOM
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");

//ml5 variables
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
let mouthOpen = false;

//variables de contenido
const threats = [
  "Otra noche… y esos dientes siguen pidiendo auxilio",
  "Cepíllate… o te arranco la sonrisa yo mismo",
  "Tienes más placa que un cementerio…",
  "¿No hueles eso?... Son tus encías muriendo",
  "Qué bonitos dientes… sería una pena perderlos",
  "El hilo dental no te salvará… pero al menos lo intentará",
  "Lávate los dientes… o te los lavo con mis garras",
  "¿Sabes qué colecciono?... Sonrisas descuidadas",
  "Sigue sin cepillarte… necesito más material para mi collar",
  "Duermes con la boca abierta… y yo miro dentro",
  "No es aliento… son tus dientes pudriéndose",
];
const shouting = [
  "¡No pares o te buscaré en sueños!",
  "¡Sigue! ¡Que no se escape ni una muela!",
  "¡Cepilla más fuerte o vendré por tus dientes!",
  "¡No te detengas! ¡Maldita sea!",
  "¡Como pares me acerco al espejo!",
  "¡Más, más! ¡Que brille hasta la raíz!",
  "¡No pares! ¡Me gusta el sabor del sarro!",
  "¡Cepilla otra vez esa esquina, ahora mismo!",
  "¡No lo dejes! ¡Tengo paciencia… por ahora!",
  "¡Más espuma! ¡Que tiemble tu dentista!",
  "¡Sigue! ¡El brillo me vuelve loco!",
];

//variables de sonido
let tensionSound;
let horrorSound;
let laughSound;

//variables de tiempo
let timer = 0;
let lastTimer = -1;
let lastInterval = 0;
let lastPhraseChange = 0;
let phraseInterval = 3; //3sg para cambiar frase
let posTxtRandomX = 300;
let posTxtRandomY = 300;

let changePhrase = false;
let phraseIndex = 0;

// variables presencia oscura
let offX = 0;
let offY = 100;
let offSize = 200;
let offColor = 300;
let speed = 0.01;
let phantom;

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
  bebasFont = loadFont("fonts/BebasNeue-Regular.ttf");
  tensionSound = loadSound("sounds/suspense.mp3");
  horrorSound = loadSound("sounds/scary.mp3");
  laughSound = loadSound("sounds/demonic-laughter.mp3");
  phantom = loadImage("img/phantom.png");
}

function setup() {
  createResponsiveCanvas();

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);

  tensionSound.setVolume(0.006);
}

function draw() {
  frameRate(24);
  background(220);
  updateTimer();
  mouthOpen = isMouthOpen();

  image(video, 0, 0, width, height);

  // drawEyes();

  if (mouthOpen) {
    flickeringLightFilter();
    tensionSound.stop();
    horrorSound.loop();
    laughSound.loop();
    drawText(shouting, width - 100, height - 100, 200, 19, true);
  } else {
    nocturnFilter();
    horrorSound.stop();
    laughSound.stop();
    tensionSound.loop();
    drawPhantom();
  }
}

function drawText(
  textArray,
  posX = 0,
  posY = 0,
  paragraphWidth = width,
  txtSize = 14,
  randomPosition = false
) {
  if (timer % phraseInterval === 0 && timer !== lastPhraseChange) {
    lastPhraseChange = timer;
    phraseIndex < textArray.length ? phraseIndex++ : (phraseIndex = 0);
    randomPosition && (posTxtRandomX = random(100, posX));
    randomPosition && (posTxtRandomY = random(100, posY));
  }
  textFont(terrorFont);
  textSize(txtSize);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  randomPosition
    ? text(textArray[phraseIndex], posTxtRandomX, posTxtRandomY, paragraphWidth)
    : text(
        textArray[phraseIndex],
        posX - paragraphWidth / 2,
        posY,
        paragraphWidth
      );
}

function drawPhantom() {
  let size = map(noise(offSize), 0, 1, 305, 455);
  let posX = map(noise(offX), 0, 1, -5, width - size + 5);
  let posY = map(noise(offY), 0, 1, -5, height - size + 5);
  imageMode(CENTER);
  image(phantom, posX, posY, size, size);
  imageMode(CORNER);

  drawText(threats, posX, posY, 100);

  offX += speed;
  offY += speed;
  offSize += speed * 2;
  offColor += speed;
}

function updateTimer() {
  if (millis() - lastInterval >= 1000) {
    lastTimer = timer;
    timer++;
    lastInterval = millis();
  }
}

function nocturnFilter() {
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

function flickeringLightFilter() {
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
      let leftEye = createVector(
        scaleX(f.leftEye.centerX),
        scaleY(f.leftEye.centerY)
      );
      let rightEye = createVector(
        scaleX(f.rightEye.centerX),
        scaleY(f.rightEye.centerY)
      );
      let leftEyeWidth = scaleX(f.leftEye.width);
      let rightEyeWidth = scaleX(f.rightEye.width);

      // Dibujar círculos
      noFill();
      stroke(0, 255, 0);
      strokeWeight(2);
      ellipse(leftEye.x, leftEye.y, leftEyeWidth * 1.5, leftEyeWidth * 1.5); // ojo izquierdo
      ellipse(rightEye.x, rightEye.y, rightEyeWidth * 1.5, rightEyeWidth * 1.5); // ojo derecho
    }
  }
}

function isMouthOpen() {
  if (faces.length > 0 && faces[0].lips) {
    let lips = faces[0].lips;
    let topLeftLip = createVector(scaleX(lips.x), scaleY(lips.y));
    let bottomRightLip = createVector(
      scaleX(lips.x + lips.width),
      scaleY(lips.y + lips.height)
    );
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

    if (lipDistance > 90) {
      return true;
    } else if (lipDistance < 85) {
      return false;
    }
  }
}

function trigger(message) {
  console.log(message, ":D");
}

function gotFaces(results) {
  faces = results;
}
