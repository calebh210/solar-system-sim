
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, earth, moon, sun, sunGrav, controls, mercury, venus;

function init(){


scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000000
);

//DEFINING ASTRONOMICAL SIZES
//All sizes are in KM and /100 from actual size (but remain constant so should be realistic model)
let AU = 150000.000;
let realMercuryR = 2.440;
let displayMercuryR = 244.0;
let realVenusR = 6.0518;
let displayVenusR = 605.18;
let realMoonR = 1.737;
let displayMoonR = 173.70;
let realEarthR = 6.371;
let displayEarthR = 637.100;
let realSunR = 696.340;

let earthR, moonR, mercuryR, venusR;

renderer = new THREE.WebGLRenderer({ antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

mercuryR = displayMercuryR;
earthR = displayEarthR;
moonR = displayMoonR;
venusR = displayVenusR;

//the sun

const geometrySun = new THREE.SphereGeometry( realSunR*10, 32, 15 );
const textureSun = new THREE.TextureLoader().load("Textures/Sun.jpg")
const materialSun = new THREE.MeshBasicMaterial( {map: textureSun} );
sun = new THREE.Mesh( geometrySun, materialSun );
scene.add( sun );

const sunGravGeo = new THREE.SphereGeometry(1,1,1);
sunGrav = new THREE.Mesh( sunGravGeo, materialSun );
scene.add( sunGrav);

//the earth
const geometry = new THREE.SphereGeometry( earthR, 32, 20 );
const texture = new THREE.TextureLoader().load("Textures/Earth-Clear.jpg")
const material = new THREE.MeshBasicMaterial( {map: texture} );
earth = new THREE.Mesh( geometry, material );
earth.position.x = realSunR + AU
sun.add( earth );

//the moon
const geometryMoon = new THREE.SphereGeometry( moonR, 32, 15 );
const textureMoon = new THREE.TextureLoader().load("Textures/Moon.jpg")
const materialMoon = new THREE.MeshBasicMaterial( {map: textureMoon} );
moon = new THREE.Mesh( geometryMoon, materialMoon );
//384400KM is the distance ,
moon.position.x = earthR + 3844.00;
earth.add( moon );

//mercury - 2440KM radius
const geometryMer = new THREE.SphereGeometry( mercuryR, 32, 15 );
const textureMer = new THREE.TextureLoader().load("Textures/Mercury.jpg")
const materialMer = new THREE.MeshBasicMaterial( {map: textureMer} );
mercury = new THREE.Mesh( geometryMer, materialMer );
//47 000 000km 
mercury.position.x = realSunR + 47000.000;
sunGrav.add( mercury );

//venus - 6051.8KM radius
const geometryVen = new THREE.SphereGeometry( venusR, 32, 15 );
const textureVen = new THREE.TextureLoader().load("Textures/Venus.jpg")
const materialVen = new THREE.MeshBasicMaterial( {map: textureVen} );
venus = new THREE.Mesh( geometryVen, materialVen );
//108 940 000km 
venus.position.x = realSunR + 108940.000;
sun.add( venus );

//camera 
camera.position.z = 15000;
camera.position.y = 15000;
//takes x,y,z args, points camera at that location
//camera.lookAt(sun.position);

controls = new OrbitControls(camera, renderer.domElement);

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
    sunGrav.rotation.y += 0.002;
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
    camera.position.y = 100000;
    camera.position.z = 0;
    camera.lookAt(0,0,0);
}

let viewEarth = document.getElementById('viewEarthButton');
viewEarth.addEventListener("click", function()
{   
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( earth.matrixWorld );

    camera.position.x = vector.x + 10000;
    camera.position.y = vector.y + 5000;
    camera.position.z = vector.z;
    camera.lookAt(vector);
    console.log(vector);
});

init();
animate();