let CANVAS_HEIGHT = 700;
let CANVAS_WIDTH = 1000;
let NUMBER_OF_BOIDS = 600;
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

  let quadTree = new QuadTree(new BoundingBox(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT),4);
  for (let boid of boids) {
    quadTree.insert(boid);
  }
  quadTree.show();
  
  for (var i = 0; i < boids.length; i++) {
    let boid = boids[i];
    let nearby_boids = quadTree.query(boid.position.x, boid.position.y, boid.perception_radius);
    boid.flockWith(nearby_boids);
    boid.ignoreEdges(CANVAS_WIDTH, CANVAS_HEIGHT);
    boid.update();
    boid.show();

    // if (i == 0) {
    //   push();
    //   for (let nearby_boid of nearby_boids) {
    //     stroke(255, 255, 255, 100);
    //     line(boid.position.x, boid.position.y, nearby_boid.position.x, nearby_boid.position.y);
    //   }
    //   boid.show_with_color(color(255, 0, 155));
    //   noFill();
    //   stroke(255, 0, 155);
    //   ellipse(boid.position.x, boid.position.y, boid.perception_radius * 2);
    //   pop();
    // }
  }


  // noLoop();
}