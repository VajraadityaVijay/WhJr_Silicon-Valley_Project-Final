const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Common = Matter.Common;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const BackgroundColor = "#1b4656";
var world, engine;
var center = { x: 400, y: 400 };

var Stage = 1;
var Won = false;
var BigCircle, BigCircleRadius;
var ControlCircle;
var PointCircles = [];
var obstacles = [];
var lines = [];
var CenterCircle;

function setup() {
  createCanvas(1000, 600);
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 5;

  BigCircleRadius = 300;
  BigCircle = Bodies.circle(400, 400, BigCircleRadius, { isStatic: true });
  World.add(world, BigCircle);
  BigCircle.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
  };

  ControlCircle = Bodies.circle(400, 525, 25, { density: 2.5, mass: 2.5, friction: 0.0005, airFriction: 5 });
  ControlCircle.setMass = 10;
  World.add(world, ControlCircle);

  CenterCircle = Bodies.circle(400, 400, 5, { isStatic: true });
  World.add(world, CenterCircle);
  CenterCircle.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
  };

  rope = Constraint.create({
    bodyA: ControlCircle,
    bodyB: CenterCircle,
    stiffness: 2,
    length: BigCircleRadius / 2 - 25
  })
  World.add(world, rope);

  createLevels();
}

function draw() {
  background(BackgroundColor);
  Engine.update(engine);
  camera.position.x = ControlCircle.position.x;
  camera.position.y = ControlCircle.position.y;
  console.log(ControlCircle.position.y)

  handleKeyPress();

  fill("#45b0d8");
  noStroke();
  circle(BigCircle.position.x, BigCircle.position.y, BigCircleRadius);
  fill("#153844");
  circle(ControlCircle.position.x, ControlCircle.position.y, 50);

  for (var i = 0; i < PointCircles.length; i++) {
    PointCircles[i].display();
  }
  for (i = 0; i < obstacles.length; i++) {
    obstacles[i].display();
  }

  var circleDist = dist(CenterCircle.position.x, CenterCircle.position.y, ControlCircle.position.x, ControlCircle.position.y)
  if (circleDist >= BigCircleRadius / 2 - 25) {
    rope.stiffness = 2 / circleDist * (BigCircleRadius / 6);
  } else {
    rope.stiffness = 0;
  }

  if (Won === true) {
    fill('rgba(47, 122, 150, 0.25)');
    rectMode(CENTER);
    rect(ControlCircle.position.x, ControlCircle.position.x, 100000, 60000);
    fill("#153844")
    textSize(100);
    textFont('Helvetica');
    text("You Won!", ControlCircle.position.x - 200, ControlCircle.position.y - 80);
    textSize(30);
    text("Reload to play again", ControlCircle.position.x - 140, ControlCircle.position.y - 50);
  }

  drawSprites();
}

function handleKeyPress() {
  if (Won !== true) {
    if (keyIsDown(RIGHT_ARROW)) {
      Body.applyForce(ControlCircle, { x: 0, y: 0 }, { x: 0.01, y: 0 });
    }
    if (keyIsDown(LEFT_ARROW)) {
      Body.applyForce(ControlCircle, { x: 0, y: 0 }, { x: -0.01, y: 0 });
    }
    if (keyIsDown(LEFT_ARROW)) {
      Body.applyForce(ControlCircle, { x: 0, y: 0 }, { x: -0.001, y: 0 });
    }
  }
}

function loadNextSize() {
  Stage++;
  createLevels();
  if (Stage !== 6) {
    BigCircleRadius += 300;
    setTimeout(function () {
      rope.length += 150;
    }, 200);
  }
}

function createLevels() {
  if (Stage === 1) {
    PointCircles[0] = new PointCircle(460, 510);
  }
  if (Stage === 2) {
    PointCircles[1] = new PointCircle(665, 400);
  }
  if (Stage === 3) {
    PointCircles[2] = new PointCircle(140, 730);
    obstacles[0] = new Obstacle(107, 630, 78);
    obstacles[1] = new Obstacle(45, 510, 78);
  }
  if (Stage === 4) {
    PointCircles[3] = new PointCircle(840, 760);
    obstacles[2] = new Obstacle(-20, 720, 78);
    obstacles[3] = new Obstacle(310, 985, 8);
    obstacles[4] = new Obstacle(380, 970, 30);
  }
  if (Stage === 5) {
    PointCircles[4] = new PointCircle(-260, 400);
    obstacles[5] = new Obstacle(940, 880, 30);
  }
  if (Stage === 6) {
    Won = true;
  }
}