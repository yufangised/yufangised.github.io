let curves = [];
let palette = []; // Array to store three random colors

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  colorMode(RGB, 255); // Set the color mode to RGB
  
  // Generate a palette of three distinct random colors
  palette = generateDistinctColors(3);

  // Create multiple curves with random properties
  initializeCurves();
}

function draw() {
  background(20);

  // Display and update all curves
  for (let curve of curves) {
    curve.drift();
    curve.attractToMouse(mouseX, mouseY);
    curve.update();
    curve.display();
  }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initializeCurves(); // Reinitialize curves on window resize
}

function initializeCurves() {
  curves = []; // Clear any existing curves

  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(30, 100); // Smaller size for more compact waves
    let col = random(palette); // Choose a random color from the palette
    curves.push(new SmoothCurve(x, y, size, col));
  }
}

class SmoothCurve {
  constructor(x, y, size, col) {
    this.pos = createVector(x, y); // Center position of the curve
    this.vel = p5.Vector.random2D().mult(0.3); // Random initial velocity
    this.acc = createVector(0, 0); // Acceleration
    this.points = []; // Array to store points of the curve
    this.numPoints = floor(random(4, 10)); // Fewer points for shorter curves
    this.color = col; // Curve color (from the palette)
    this.angle = 0; // Initial angle for rotation
    this.rotationSpeed = random(0.002, 0.005); // Base rotation speed
    this.size = size; // Curve size
    this.proximityThreshold = 50; // Distance for mouse attraction
    this.attractionStrength = 0.01; // Strength of attraction to the mouse

    // Initialize points along a smooth wave
    for (let i = 0; i < this.numPoints; i++) {
      let px = x + i * random(10, 20); // Reduced horizontal spacing
      let py = y + random(-this.size, this.size); // Random wave height
      this.points.push(createVector(px, py));
    }
  }

  drift() {
    // Apply random drift to the curve's velocity
    let randomDrift = p5.Vector.random2D().mult(0.1);
    this.acc.add(randomDrift);
  }

  attractToMouse(mx, my) {
    let mouse = createVector(mx, my);
    let distance = dist(mx, my, this.pos.x, this.pos.y);

    if (distance < this.proximityThreshold) {
      // Apply attraction force if within the threshold
      let force = p5.Vector.sub(mouse, this.pos); // Direction toward the mouse
      force.setMag(this.attractionStrength); // Scale the force
      this.acc.add(force); // Add the attraction force to acceleration

      // Boost rotation speed when near the mouse
      this.rotationSpeed += 0.002; // Gradual increase in rotation speed
    } else {
      // Gradually slow down the rotation when far from the mouse
      this.rotationSpeed *= 0.98;
    }
  }

  update() {
    // Update velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.mult(0.98); // Apply slight friction for smooth motion
    this.acc.mult(0); // Reset acceleration

    // Update rotation angle
    this.angle += this.rotationSpeed;

    // Create smooth wave motion by updating y-values of points
    for (let i = 0; i < this.points.length; i++) {
      let offset = i * 0.3; // Phase offset for smoother movement
      this.points[i].y =
        this.pos.y + sin(frameCount * 0.001 + offset) * this.size / 2; // Slowed wave motion
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle); // Rotate dynamically

    noFill();
    stroke(this.color);
    strokeWeight(2);

    beginShape();
    for (let point of this.points) {
      curveVertex(point.x - this.pos.x, point.y - this.pos.y); // Offset for rotation
    }
    endShape();

    pop();
  }
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


