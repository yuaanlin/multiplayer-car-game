import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls';
import Car from '/models/car.js';

const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var h = document.createElement('p'); // Create a <h1> element
var t = document.createTextNode(''); // Create a text node
h.appendChild(t);
h.style.position = 'fixed';
h.style.top = '16px';
h.style.color = 'white';
h.style.left = '16px';
h.setAttribute('class', 'debug');
document.body.append(h);

const controls = new OrbitControls(camera, renderer.domElement);

const coneGeo: THREE.ConeGeometry = new THREE.ConeGeometry(1, 8);
const coneMet = new THREE.MeshNormalMaterial({});
const cone = new THREE.Mesh(coneGeo, coneMet);
cone.position.set(3, 4, 3);
scene.add(cone);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const texture = new THREE.TextureLoader().load('assets/sand.jpg');
const groundMet = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeo, groundMet);
ground.rotation.x = Math.PI / 2;
scene.add(ground);

camera.position.set(8, 4, 8);
controls.update();

function addLight(x: number, y: number, z: number) {
  const color = 0xffffff;
  const intensity = 10;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  scene.add(light);
  scene.add(light.target);
}
addLight(0, 5, 0);

const car = new Car(scene);

var animate = function () {
  requestAnimationFrame(animate);
  car.update(0.05);
  camera.lookAt(car.object.position);
  camera.position.x += car.v * Math.sin(car.d);
  camera.position.z += car.v * Math.cos(car.d);

  render();
};

function render() {
  renderer.render(scene, camera);
}

animate();
