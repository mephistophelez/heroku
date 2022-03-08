import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js'
//This library allows us to add event listener to our 3D objects, just like with HTML DOM nodes.
import { InteractionManager } from './build/three.interactive.js'
import createDonuts from "./createDonuts.js";
// This library allows us to move the camera smoothly  
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'

//install tween npm i @tweenjs/tween.js@^18
//adding a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

//adding a camera
const camera = new  THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const cameraH = 50;
//change the camera z position
camera.position.z = cameraH;

//create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//This library allows us to add event listener to our 3D objects, just like with HTML DOM nodes.
const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
  );

//Creating donuts
  const donuts = {
    orange: createDonuts({ color: 0xf9ad81, x: -20, y: -10 }),
    yellow: createDonuts({ color: 0xfff799, x: 20, y: -20 }),
    green: createDonuts({ color: 0xa3d39c, x: 10, y: 20 }),
    blue: createDonuts({ color: 0x6dcff6, x: -15, y: 20 }),
    purple: createDonuts({ color: 0xbd8cbf, x: -40, y: 20 }),
    cyan: createDonuts({ color: 0x7accc8, x: -50, y: -20 })
  };

  
//Adding click handler
for (const [name, object] of Object.entries(donuts)) {
  object.addEventListener("click", (event) => {
    //only the top object should handle the click, incase of any overlapping happened
    event.stopPropagation();
    //adding a log statement to the concole to indentify which donut was cliked
    console.log(`${name} donut was clicked`);
    //identify the starting and the target point
    const donut = event.target;
    const coords = { x: camera.position.x, y: camera.position.y };
    new TWEEN.Tween(coords)
      .to({ x: donut.position.x, y: donut.position.y })
      .onUpdate(() =>
        camera.position.set(coords.x, coords.y, camera.position.z)
      )
      .start();
  });
  
  interactionManager.add(object);
  scene.add(object);
}

  
document.getElementById("home").addEventListener("click", () => {
    //using tween function to smoothly move from one position to another one
    const coords = { x: camera.position.x, y: camera.position.y, z:camera.position.z };
    var tween = new TWEEN.Tween(coords)
      .to({ x: 0 , y: 0, z: cameraH }, 5000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() =>
        camera.position.set(coords.x, coords.y, coords.z)
      )
      .start();
});



//creating a light element
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 30);
scene.add(light);

//creating a light element
const light2 = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(30, 30, 30);
scene.add(light2);

// add some controls to orbit the camera
const controls = new OrbitControls(camera, renderer.domElement)

//animate function
function animate(time) {
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    interactionManager.update();
    TWEEN.update(time);

}


animate();