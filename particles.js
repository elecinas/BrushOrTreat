class Particle {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.size = random(20, 80);
    this.alpha = 255;
    this.life = 255;
    this.img = img;
    this.rot = random(TWO_PI);
    this.rotSpeed = random(-0.02, 0.02);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98); //desacelera
    this.life -= 3; //van desapareciendo
    this.alpha = this.life; //opacidad depende de vida
    this.rot += this.rotSpeed;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);

    if (this.img) {
      tint(200, 100, 100, this.alpha * 0.9); // tono rojizo
      imageMode(CENTER);
      image(this.img, 0, 0, this.size, this.size);
      noTint();
    } else {
      noStroke();
      fill(180, 0, 30, this.alpha);
      ellipse(0, 0, this.size);
    }

    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 20;
  }

  addParticle(x, y, img) {
    if (this.particles.length < this.maxParticles) {
      this.particles.push(new Particle(x, y, img));
    }
  }
  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.update();
      particle.show();
      if (particle.isDead()) this.particles.splice(i, 1);
    }
  }
}
