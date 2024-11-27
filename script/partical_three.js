let particles = [];
let palette = []; // Array to store three random colors

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Define three random colors
  palette = generateDistinctColors(3);
  
  for (let i = 0; i < 400; i++) {
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
    this.color = random(palette);
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

// Function to generate 'n' distinct RGB colors
function generateDistinctColors(n) {
    let colors = [];
    while (colors.length < n) {
      let c = color(random(100, 255), random(100, 255), random(100, 255)); // Generate a random bright color
      let isDistinct = true;
  
      // Check against existing colors in the palette
      for (let existing of colors) {
        if (colorDistance(c, existing) < 150) { // Ensure a minimum distance of 150
          isDistinct = false;
          break;
        }
      }
  
      if (isDistinct) colors.push(c); // Add the color if sufficiently distinct
    }
    return colors;
}
  
// Calculate the Euclidean distance between two colors
function colorDistance(c1, c2) {
    let r1 = red(c1), g1 = green(c1), b1 = blue(c1);
    let r2 = red(c2), g2 = green(c2), b2 = blue(c2);
    return dist(r1, g1, b1, r2, g2, b2);
}



