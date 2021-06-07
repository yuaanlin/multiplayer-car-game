import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";

const dv = 1;
const da = 0.0005;
const MAX_SPEED = 0.05;
const MAX_ACCELERATION = 1;

const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color("white");

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var h = document.createElement("p"); // Create a <h1> element
var t = document.createTextNode(""); // Create a text node
h.appendChild(t);
h.style.position = "absolute";
h.style.top = "0";
h.style.left = "0";
document.body.append(h);

const controls = new OrbitControls(camera, renderer.domElement);

const coneGeo: THREE.ConeGeometry = new THREE.ConeGeometry(1, 8);
const coneMet = new THREE.MeshNormalMaterial({});
const cone = new THREE.Mesh(coneGeo, coneMet);
cone.position.set(3, 4, 3);
scene.add(cone);

const cubeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMet: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const cube: THREE.Mesh = new THREE.Mesh(cubeGeo, cubeMet);
scene.add(cube);
cube.position.y = 1;

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const texture = new THREE.TextureLoader().load("assets/sand.jpg");
const groundMet = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeo, groundMet);
ground.rotation.x = Math.PI / 2;
scene.add(ground);

camera.position.set(8, 4, 8);
controls.update();

var animate = function () {
  requestAnimationFrame(animate);

  controls.update();

  t.textContent = `speed ${v.toFixed(2)}, 
    position (${cube.position.x.toFixed(2)}, 
    ${cube.position.z.toFixed(2)}), a ${a.toFixed(2)}`;

  camera.lookAt(cube.position);
  camera.position.x += v * Math.sin(d);
  camera.position.z += v * Math.cos(d);
  cube.position.x += v * Math.sin(d);
  cube.position.z += v * Math.cos(d);
  cube.rotation.y = d;

  d += (r * v) / 10;

  if (Math.abs(v) < dv) v = 0;
  else if (v > 0) v -= dv;
  else if (v < 0) v += dv;

  if (Math.abs(a) < da) a = 0;
  else if (a > 0) a -= da;
  else if (a < 0) a += da;

  if (Math.abs(v) < MAX_SPEED) v += a;

  render();
};

function render() {
  renderer.render(scene, camera);
}

let a = 0;
let v = 0;
let r = 0;
let d = 0;

window.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;
    if (keyName === "w" && a < MAX_ACCELERATION) {
      a += (MAX_ACCELERATION - a) / 10;
    }
    if (keyName === "s" && a > -MAX_ACCELERATION) {
      a -= (MAX_ACCELERATION - a) / 10;
    }
    if (keyName === "d") {
      r = -Math.PI / 4;
    }
    if (keyName === "a") {
      r = Math.PI / 4;
    }
    if (keyName === "r") {
      cube.position.set(0, 1, 0);
    }
  },
  false
);

window.addEventListener("keyup", (event) => {
  if (event.key === "d" || event.key === "a") {
    r = 0;
  }
});

animate();
