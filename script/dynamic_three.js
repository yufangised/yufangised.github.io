let edgeDots = [];
let centerDot;
let palette = []; // Array to store three random colors
let edgeDotColors = ["red", "green", "blue"]; // Colors for edge dots. For debug use.
let centerNoiseX, centerNoiseY;
let noiseIncrement = 0.0005; // Adjust for smoother or more erratic motion

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  stroke(0);
  noLoop();
  
  // Initialize Perlin noise offsets
  centerNoiseX = random(1000); // Random starting point for X noise
  centerNoiseY = random(1000); // Random starting point for Y noise

  // Generate random colors for the sections
  palette = generateDistinctColors(3);

  // Generate the edge dots initially, ensuring no two dots are on the same edge
  while (edgeDots.length < 3) {
    let dot = generateRandomEdgeDot();
    // Ensure no two dots are on the same edge
    if (!edgeDots.some((existingDot) => existingDot.edge === dot.edge)) {
      edgeDots.push(dot);
    }
  }

  // Sort edge dots in clockwise order
  sortEdgeDotsClockwise(edgeDots);

  // Place the center dot in the center area
  centerDot = { x: random(width / 4, (3 * width) / 4), y: random(height / 4, (3 * height) / 4) };

  // Start the dynamic animation
  loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas dynamically

  // Reinitialize positions to adapt to new canvas size
  edgeDots = [];
  while (edgeDots.length < 3) {
    let dot = generateRandomEdgeDot();
    if (!edgeDots.some((existingDot) => existingDot.edge === dot.edge)) {
      edgeDots.push(dot);
    }
  }
  sortEdgeDotsClockwise(edgeDots);

  centerDot = { x: random(width / 4, (3 * width) / 4), y: random(height / 4, (3 * height) / 4) };
}

function draw() {
  background(255);

  // Move the edge dots dynamically
  for (let dot of edgeDots) {
    moveEdgeDot(dot);
  }

   moveCenterDot();
  // Draw the sections based on dynamic edge dot positions
  for (let i = 0; i < 3; i++) {
    fill(palette[i]);
    beginShape();
    let polygonPoints = getPolygonPoints(i);

    for (let p of polygonPoints) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
  
  fill(255, 255, 255);
  //ellipse(centerDot.x, centerDot.y, 10, 10);
}

function generateRandomEdgeDot() {
  let edge = floor(random(4)); // 0 = top, 1 = right, 2 = bottom, 3 = left
  switch (edge) {
    case 0: // Top
      return { x: random(width), y: 0, edge: "top", type: "horizontal" }; // Moving right
    case 1: // Right
      return { x: width, y: random(height), edge: "right", type: "vertical" }; // Moving down
    case 2: // Bottom
      return { x: random(width), y: height, edge: "bottom", type: "horizontal" }; // Moving left
    case 3: // Left
      return { x: 0, y: random(height), edge: "left", type: "vertical" }; // Moving up
  }
}

function moveEdgeDot(dot) {
  const speed = 0.1;
  switch (dot.edge) {
    case "top":
      dot.x += speed; // Move horizontally to the right
      if (dot.x >= width) { // Reached top-right corner
        handleCornerTransition(dot, "right", { x: width, y: 0 });
      }
      break;

    case "right":
      dot.y += speed; // Move vertically down
      if (dot.y >= height) { // Reached bottom-right corner
        handleCornerTransition(dot, "bottom", { x: width, y: height });
      }
      break;

    case "bottom":
      dot.x -= speed; // Move horizontally to the left
      if (dot.x <= 0) { // Reached bottom-left corner
        handleCornerTransition(dot, "left", { x: 0, y: height });
      }
      break;

    case "left":
      dot.y -= speed; // Move vertically up
      if (dot.y <= 0) { // Reached top-left corner
        handleCornerTransition(dot, "top", { x: 0, y: 0 });
      }
      break;

    default:
      console.error("Invalid edge type:", dot.edge);
      break;
  }
}

// Handle corner transitions
function handleCornerTransition(dot, nextEdge, cornerPosition) {
  console.log(`Transitioning dot from ${dot.edge} to ${nextEdge}`);
  console.log(`Snapping dot to corner position: x=${cornerPosition.x}, y=${cornerPosition.y}`);

  dot.x = cornerPosition.x;
  dot.y = cornerPosition.y;
  dot.edge = nextEdge;
  dot.type = nextEdge === "top" || nextEdge === "bottom" ? "horizontal" : "vertical";
}


function moveCenterDot() {
  const centerArea = {
    xMin: width / 4,
    xMax: (3 * width) / 4,
    yMin: height / 4,
    yMax: (3 * height) / 4,
  };

  // Use Perlin noise to smoothly adjust the center dot's position
  centerDot.x = map(noise(centerNoiseX), 0, 1, centerArea.xMin, centerArea.xMax);
  centerDot.y = map(noise(centerNoiseY), 0, 1, centerArea.yMin, centerArea.yMax);

  // Increment the noise offsets to create smooth motion
  centerNoiseX += noiseIncrement;
  centerNoiseY += noiseIncrement;
}


// Sort edge dots in clockwise order
function sortEdgeDotsClockwise(edgeDots) {
  const canvasCenter = { x: width / 2, y: height / 2 };
  edgeDots.sort((a, b) => {
    let angleA = atan2(a.y - canvasCenter.y, a.x - canvasCenter.x);
    let angleB = atan2(b.y - canvasCenter.y, b.x - canvasCenter.x);
    return angleA - angleB;
  });
}

// Get the sequence of points for a polygon region
function getPolygonPoints(index) {
  const corners = [
    { x: 0, y: 0 }, // Top-left
    { x: width, y: 0 }, // Top-right
    { x: width, y: height }, // Bottom-right
    { x: 0, y: height }, // Bottom-left
  ];

  let currentEdgeDot = edgeDots[index];
  let nextEdgeDot = edgeDots[(index + 1) % 3];
  let polygonPoints = [];

  // Start with the current edge dot
  polygonPoints.push(currentEdgeDot);

  // Add corners explicitly for each region
  addCornersBetween(currentEdgeDot, nextEdgeDot, polygonPoints, corners);

  // Add the next edge dot
  polygonPoints.push(nextEdgeDot);

  // Finally, add the center point
  polygonPoints.push(centerDot);

  return polygonPoints;
}

function addCornersBetween(edgeDot1, edgeDot2, polygonPoints, corners) {
  const clockwiseCorners = [
    { x: 0, y: 0 }, // Top-left
    { x: width, y: 0 }, // Top-right
    { x: width, y: height }, // Bottom-right
    { x: 0, y: height }, // Bottom-left
  ];

  // Add the starting edge dot
  polygonPoints.push(edgeDot1);

  // Handle cases explicitly
  if (edgeDot1.edge === "top" && edgeDot2.edge === "right") {
    //console.log("Adding one corner: Top-right");
    polygonPoints.push(clockwiseCorners[1]); // Top-right corner
  } else if (edgeDot1.edge === "right" && edgeDot2.edge === "bottom") {
    //console.log("Adding one corner: Bottom-right");
    polygonPoints.push(clockwiseCorners[2]); // Bottom-right corner
  } else if (edgeDot1.edge === "bottom" && edgeDot2.edge === "left") {
    //console.log("Adding one corner: Bottom-left");
    polygonPoints.push(clockwiseCorners[3]); // Bottom-left corner
  } else if (edgeDot1.edge === "left" && edgeDot2.edge === "top") {
    //console.log("Adding one corner: Top-left");
    polygonPoints.push(clockwiseCorners[0]); // Top-left corner
  } else if (edgeDot1.edge === "top" && edgeDot2.edge === "bottom") {
    //console.log("Adding two corners: Top-right, Bottom-right");
    polygonPoints.push(clockwiseCorners[1]); // Top-right corner
    polygonPoints.push(clockwiseCorners[2]); // Bottom-right corner
  } else if (edgeDot1.edge === "right" && edgeDot2.edge === "left") {
    //console.log("Adding two corners: Bottom-right, Bottom-left");
    polygonPoints.push(clockwiseCorners[2]); // Bottom-right corner
    polygonPoints.push(clockwiseCorners[3]); // Bottom-left corner
  } else if (edgeDot1.edge === "bottom" && edgeDot2.edge === "top") {
    //console.log("Adding two corners: Bottom-left, Top-left");
    polygonPoints.push(clockwiseCorners[3]); // Bottom-left corner
    polygonPoints.push(clockwiseCorners[0]); // Top-left corner
  } else if (edgeDot1.edge === "left" && edgeDot2.edge === "right") {
    //console.log("Adding two corners: Top-left, Top-right");
    polygonPoints.push(clockwiseCorners[0]); // Top-left corner
    polygonPoints.push(clockwiseCorners[1]); // Top-right corner
  } else if (edgeDot1.edge === "top" && edgeDot2.edge === "left") {
    //console.log("Adding three corners: Top-right, Bottom-right, Bottom-left");
    polygonPoints.push(clockwiseCorners[1]); // Top-right corner
    polygonPoints.push(clockwiseCorners[2]); // Bottom-right corner
    polygonPoints.push(clockwiseCorners[3]); // Bottom-left corner
  } else if (edgeDot1.edge === "right" && edgeDot2.edge === "top") {
    polygonPoints.push(clockwiseCorners[2]); // Bottom-right corner
    polygonPoints.push(clockwiseCorners[3]); // Bottom-left corner
    polygonPoints.push(clockwiseCorners[0]); // Top-left corner
  } else if (edgeDot1.edge === "bottom" && edgeDot2.edge === "right") {
    polygonPoints.push(clockwiseCorners[3]); // Bottom-left corner
    polygonPoints.push(clockwiseCorners[0]); // Top-left corner
    polygonPoints.push(clockwiseCorners[1]); // Top-right corner
  } else if (edgeDot1.edge === "left" && edgeDot2.edge === "bottom") {
    polygonPoints.push(clockwiseCorners[0]); // Top-left corner
    polygonPoints.push(clockwiseCorners[1]); // Top-right corner
    polygonPoints.push(clockwiseCorners[2]); // Bottom-right corner
  }

  // Add the ending edge dot
  polygonPoints.push(edgeDot2);

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



