let CANVAS_HEIGHT = 700;
let CANVAS_WIDTH = 1000;
let NUMBER_OF_BOIDS = 600;
let boids = [];

let showQuadTree = false;
let debug = false;

function showFps(x, y) {
  let fps = frameRate();
  push();
  fill(255);
  stroke(0);
  textSize(20);
  text("FPS: " + fps.toFixed(2), x, y);
  pop();
}

function showInstructions(x, y) {
  push();
  fill(255);
  stroke(0);
  textSize(20);
  text("Press 'q' to toggle quadtree", x, y);
  text("Press 'd' to toggle debug view", x, y + 20);
  pop();
}

function keyPressed() {
  if (key == 'q') {
    showQuadTree = !showQuadTree;
  }
  if (key == 'd') {
    debug = !debug;
  }
}

function showDebugView(boid, nearby_boids) {
  push();
  stroke(255);
  noFill();
  ellipse(boid.position.x, boid.position.y, boid.perception_radius * 2);
  pop();
  for (let b of nearby_boids) {
    push();
    stroke(255, 0, 0);
    line(boid.position.x, boid.position.y, b.position.x, b.position.y);
    pop();
  }
  boid.show_with_color(color(0, 255, 255));
}


function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(51);
  for (var i = 0; i < NUMBER_OF_BOIDS; i++) {
    boids.push(new Boid(random(width), random(height)));
  }
}

function draw() {
  background(51);
  
  let quadTree = new QuadTree(new BoundingBox(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT),4);
  for (let boid of boids) {
    quadTree.insert(boid);
  }
  
  if (showQuadTree) {
    quadTree.show();
  }
  
  for (var i = 0; i < boids.length; i++) {
    let boid = boids[i];
    let nearby_boids = quadTree.query(boid.position.x, boid.position.y, boid.perception_radius);
    boid.flockWith(nearby_boids);
    boid.update();
    boid.show();
    
    if (debug && i == 0) {
      showDebugView(boid, nearby_boids);
    }
    boid.ignoreEdges(CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  
  let fps = frameRate();
  showFps(20, 20);
  showInstructions(20, 40);
  
  
}