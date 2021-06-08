import * as THREE from '/build/three.module.js';
import { da, dv, MAX_ACCELERATION, MAX_SPEED } from '/config.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
import { SkeletonUtils } from '/jsm/utils/SkeletonUtils';

class Car {
  object = new THREE.Object3D();
  mixer: THREE.AnimationMixer | undefined;
  a = 0;
  v = 0;
  r = 0;
  d = 0;

  bindKeyboardControl() {
    window.addEventListener(
      'keydown',
      (event) => {
        const keyName = event.key;
        if (keyName === 'w' && this.a < MAX_ACCELERATION) {
          this.a += (MAX_ACCELERATION - this.a) / 10;
        }
        if (keyName === 's' && this.a > -MAX_ACCELERATION) {
          this.a -= (MAX_ACCELERATION + this.a) / 10;
        }
        if (keyName === 'd') {
          this.r = -Math.PI / 4;
        }
        if (keyName === 'a') {
          this.r = Math.PI / 4;
        }
        if (keyName === 'r') {
          this.object.position.set(0, 1, 0);
        }
      },
      false
    );

    window.addEventListener('keyup', (event) => {
      if (event.key === 'd' || event.key === 'a') {
        this.r = 0;
      }
    });
  }

  constructor(scene: THREE.Scene) {
    const loader = new GLTFLoader();
    loader.load(
      'https://threejsfundamentals.org/threejs/resources/models/animals/Cow.gltf',
      (gltf) => {
        const clonedScene = SkeletonUtils.clone(gltf.scene);
        this.object.add(clonedScene);
        this.object.position.y = 0;
        scene.add(this.object);

        this.mixer = new THREE.AnimationMixer(clonedScene);
        const firstClip = Object.values(gltf.animations)[1];
        const action = this.mixer.clipAction(firstClip);
        action.play();
        this.bindKeyboardControl();
      }
    );
  }

  update(delta: number) {
    if (!this.object || !this.mixer) return;
    this.object.position.x += this.v * Math.sin(this.d);
    this.object.position.z += this.v * Math.cos(this.d);
    this.object.rotation.y = this.d;
    this.mixer.update(delta * this.v);
    this.d += (this.r * this.v) / 10;

    if (Math.abs(this.v) < dv) this.v = 0;
    else if (this.v > 0) this.v -= dv;
    else if (this.v < 0) this.v += dv;

    if (Math.abs(this.a) < da) this.a = 0;
    else if (this.a > 0) this.a -= da;
    else if (this.a < 0) this.a += da;

    if (Math.abs(this.v) < MAX_SPEED) this.v += this.a;

    let t = document.getElementsByClassName('debug')[0];
    t.textContent = `speed ${this.v.toFixed(2)}, 
    position (${this.object.position.x.toFixed(2)}, 
    ${this.object.position.z.toFixed(2)}), a ${this.a.toFixed(2)}`;
  }
}

export default Car;
