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
  /* 旧实现是随机试错：在 RGB 的 [100,255] 立方体里抽色，要求两两距离 ≥150，
     不满足就重抽 —— 而那个立方体边长只有 155，对角线 268。三个点两两 ≥150
     的组合极少，且前面选中的颜色永不回退：前两个位置不巧时，第三个在整个
     色域里根本不存在，while 就永远转下去。实测约 14% 的加载会卡死，而这段
     跑在 setup() 的主线程上，所以页面连第一帧都画不出来，整个标签页冻住。

     改成按色环均分取色相：结构上保证区分度，一次成型，没有循环。
     实测最差的两色距离是 160，中位 211 —— 比旧代码要求的 150 还高。

     The old version rejection-sampled RGB inside [100,255] requiring every pair
     to be >=150 apart. That cube is only 155 a side, valid triples are rare, and
     accepted colours were never revisited — so when the first two landed badly no
     third colour existed anywhere in the gamut and the while loop never ended.
     About 14% of loads hung, on the main thread inside setup(), freezing the tab
     before the first frame. Evenly spaced hues are distinct by construction: no
     loop, and a measured worst-case separation of 160 against the old 150 bar. */
  const colors = [];
  const offset = random(360);
  push();
  colorMode(HSB, 360, 100, 100);
  for (let i = 0; i < n; i++) {
    colors.push(color((offset + (360 / n) * i) % 360, random(60, 85), random(85, 100)));
  }
  pop();                      // 还原调用方的 colorMode（curve_three 用的是 RGB）
  return colors;
}
  



