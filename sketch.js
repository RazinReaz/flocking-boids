let CANVAS_HEIGHT = 700;
let CANVAS_WIDTH = 1000;
let NUMBER_OF_BOIDS = 400;
let boids = [];

function showFps(x, y) {
  let fps = frameRate();
  push();
  fill(255);
  stroke(0);
  textSize(20);
  text("FPS: " + fps.toFixed(2), x, y);
  pop();
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
  let fps = frameRate();
  showFps(20, 20);

  for (var i = 0; i < boids.length; i++) {
    let boid = boids[i];
    boid.flockWith(boids);
    boid.ignoreEdges(CANVAS_WIDTH, CANVAS_HEIGHT);
    boid.update();
    boid.show();
  }
}