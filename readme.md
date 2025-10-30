# 🦷 Laboratori HealthySmile — *Cepíllate o...*

**Laboratori HealthySmile** es una aplicación interactiva creada para fomentar el hábito del cepillado dental entre niños y niñas… ambientada para halloween.  
A través de la cámara y reconocimiento facial con **ml5.js**, la app detecta si el usuario abre la boca y responde con luces, sonidos y frases que retan (o más bien amenazan) a seguir cepillándose los dientes.

---

## 🚀 Características principales

- **Interacción con cámara en tiempo real** mediante `ml5.faceMesh`.
- **Detección de apertura de boca** para activar efectos visuales y de sonido.
- **Filtros de luz y color dinámicos** con *p5.js*.
- **Ambiente sonoro reactivo** con *p5.sound*.
- **Mensajes** con humor negro.
- **Modo "fantasmal"** cuando la boca está cerrada.
- **Versión de escritorio** desarrollada con **Electron**, adaptable a pantalla 1080p.

---

## 🧩 Tecnologías utilizadas

| Tecnología | Función |
|-------------|----------|
| **p5.js** | Dibujo, animaciones y gestión del canvas. |
| **ml5.js** | Reconocimiento facial (FaceMesh). |
| **p5.sound** | Control y reproducción de audio. |
| **Electron** | Empaquetado como aplicación de escritorio. |
| **HTML + CSS** | Interfaz gráfica y diseño adaptable. |
| **JavaScript (ES6)** | Lógica general del programa. |

---

## ⚙️ Estructura del proyecto


├── index.html → interfaz principal
├── style.css → estilos visuales y diseño adaptable
├── sketch.js → código principal p5 + lógica ml5
├── main.js → configuración de la app Electron
├── package.json → dependencias y configuración del proyecto
├── fonts/
│ └── HelpMe.ttf
├── sounds/
│ ├── suspense.mp3
│ ├── scary.mp3
│ └── demonic-laughter.mp3
├── img/
│ ├── phantom.png
│ ├── phantom_grita.png
│ ├── cara_cruces.png
│ ├── cara_phantom.png
│ ├── muela.png
│ └── ojo_cruz.png
└── README.md


---

## 🧠 Funcionamiento

1. Al pulsar el botón **Iniciar**, se inicia el programa de detección facial y ambientación. 
2. Cuando la boca **permanece cerrada**, la atmósfera es oscura y aparece una “presencia” que susurra amenazas.    
3. Cuando el usuario **abre la boca**, se inicia el “modo locura”: luces parpadeantes, risas demoníacas y frases que amenazan para seguir cepillando. 
4. Al pulsar **Parar**, la aplicación detiene todos los sonidos y vuelve al estado inicial.

---

## 🧱 Ejecución como aplicación de escritorio (Electron)

1. Instala dependencias:
   ```bash
   npm install

    Ejecuta la app:

    npm start

Se abrirá una ventana a 1080p con la aplicación lista para usar.


## 📜 Créditos y recursos

### 🎵 Sonidos

- **“Suspense”**, **“Scary”** y **“Demonic Laughter”** obtenidos de [Pixabay](https://pixabay.com/sound-effects/) bajo la **Pixabay License**.  
  Uso libre, incluso comercial, sin atribución obligatoria.  
  Autor original: *Pixabay / Lexin Music*.

### 🔠 Tipografía

- **“Help Me”**, diseñada por *Jonathan S. Harris*, obtenida de [Dafont](https://www.dafont.com/help-me.font).  
  Licencia: **Uso gratuito para proyectos personales**.

---

## 🧛 Créditos generales

Proyecto educativo desarrollado para el **Laboratori HealthySmile**.  
Inspirado en el aprendizaje a través del juego, la interacción y el humor visual.  

**Ilustraciones y diseño gráfico:** *Esther Lecina Sesén* 
**Autor/a:** Esther Lecina Sesén  
**Año:** 2025  
**Licencia:** Uso educativo y no comercial.

---

## 🪞 Nota sobre privacidad

Esta aplicación utiliza la cámara del dispositivo únicamente para **detectar la posición de la boca en tiempo real**.  
No captura ni almacena imágenes, datos biométricos o personales.

