
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, earth, moon, sun, controls;
let AU = 1500000
function init(){


scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000000
);




renderer = new THREE.WebGLRenderer({ antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//the sun
const geometrySun = new THREE.SphereGeometry( 64, 32, 15 );
const textureSun = new THREE.TextureLoader().load("Textures/Sun.jpg")
const materialSun = new THREE.MeshBasicMaterial( {map: textureSun} );
sun = new THREE.Mesh( geometrySun, materialSun );
scene.add( sun );

//the earth
const geometry = new THREE.SphereGeometry( 16, 32, 20 );
const texture = new THREE.TextureLoader().load("Textures/Earth-Clear.jpg")
const material = new THREE.MeshBasicMaterial( {map: texture} );
earth = new THREE.Mesh( geometry, material );
earth.position.x = 1500;
sun.add( earth );

camera.position.z = 100;
camera.position.y = 100;
//takes x,y,z args, points camera at that location
camera.lookAt(0,0,0);

controls = new OrbitControls(camera, renderer.domElement);


//the
const geometryMoon = new THREE.SphereGeometry( 4, 32, 15 );
const textureMoon = new THREE.TextureLoader().load("Textures/Moon.jpg")
const materialMoon = new THREE.MeshBasicMaterial( {map: textureMoon} );
moon = new THREE.Mesh( geometryMoon, materialMoon );
moon.position.x = 80;
earth.add( moon );


}

function animate(){
    requestAnimationFrame(animate);

    //Change the rotation speed of the earth
    let controlSpeed = document.getElementById('rotation').value;
    if(controlSpeed != ""){
        earth.rotation.y += parseFloat(controlSpeed);
    }else{
        earth.rotation.y += 0.0005;
    } 
    //set Moon's rotation
    moon.rotation.y += 0.001;
    sun.rotation.y += 0.0001;
  
    //camera.lookAt(0,0,0);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

//View world from top-down perspective
export function topDown(){
    camera.position.x = 0;
    camera.position.y = 2000;
    camera.position.z = 0;
    camera.lookAt(0,0,0);
}

init();
animate();