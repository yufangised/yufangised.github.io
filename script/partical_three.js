let particles = [];
let colors;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Define three random colors
  colors = [
    color(random(255), random(255), random(255)),
    color(random(255), random(255), random(255)),
    color(random(255), random(255), random(255))
  ];

  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(20, 20, 50, 25); // Slightly transparent background for a trail effect
  for (let particle of particles) {
    particle.update();
    particle.show();
    particle.interact(mouseX, mouseY);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0);
    this.size = random(5, 15);

    // Assign a random color from the predefined set
    this.color = random(colors);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(5);
    this.acc.mult(0); // Reset acceleration for the next frame

    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  interact(mx, my) {
    let mouse = createVector(mx, my);
    let dir = p5.Vector.sub(mouse, this.pos);
    let distance = dir.mag();
    dir.normalize();

    if (distance < 100) { // Interactive range
      let strength = map(distance, 0, 100, 2, 0); // Stronger closer to the mouse
      dir.mult(strength);
      this.acc.add(dir);
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
