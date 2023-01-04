
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

const earthOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	AU + realSunR, AU + realSunR,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

earth.rotation.x = Math.PI / 2;

//drawing Earth's orbit
const earthPoints = earthOrbit.getPoints( 500 );
const EarthOrbitGeometry = new THREE.BufferGeometry().setFromPoints( earthPoints );
const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const earthOrbitLine = new THREE.Line( EarthOrbitGeometry, orbmaterial );
scene.add( earthOrbitLine );

//the moon
const geometryMoon = new THREE.SphereGeometry( moonR, 32, 15 );
const textureMoon = new THREE.TextureLoader().load("Textures/Moon.jpg")
const materialMoon = new THREE.MeshBasicMaterial( {map: textureMoon} );
moon = new THREE.Mesh( geometryMoon, materialMoon );
//384400KM is the distance ,
moon.position.x = earthR + 3844.00;
earth.add( moon );

const moonOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	earthR + 3844.00, earthR + 3844.00,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);
//drawing Earth's orbit
const moonPoints = moonOrbit.getPoints( 50 );
const MoonOrbitGeometry = new THREE.BufferGeometry().setFromPoints( moonPoints );
// const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const moonOrbitLine = new THREE.Line( MoonOrbitGeometry, orbmaterial );
moonOrbitLine.rotation.x = Math.PI / 2;
earth.add( moonOrbitLine );



const mercuryOrbit = new THREE.EllipseCurve(
	0,  -10000,            // ax, aY
	realSunR + 47000.000, realSunR + 70000.000,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);
const merPoints = mercuryOrbit.getPoints( 50 );
const MerOrbitGeometry = new THREE.BufferGeometry().setFromPoints( merPoints );
// const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const merOrbitLine = new THREE.Line( MerOrbitGeometry, orbmaterial );
scene.add( merOrbitLine );

//mercury - 2440KM radius
const geometryMer = new THREE.SphereGeometry( mercuryR, 32, 15 );
const textureMer = new THREE.TextureLoader().load("Textures/Mercury.jpg")
const materialMer = new THREE.MeshBasicMaterial( {map: textureMer} );
mercury = new THREE.Mesh( geometryMer, materialMer );
//47 000 000km 
mercury.position.x = realSunR + 47000.000;
//new to do math to move planet
merOrbitLine.add( mercury );

//venus - 6051.8KM radius
const geometryVen = new THREE.SphereGeometry( venusR, 32, 15 );
const textureVen = new THREE.TextureLoader().load("Textures/Venus.jpg")
const materialVen = new THREE.MeshBasicMaterial( {map: textureVen} );
venus = new THREE.Mesh( geometryVen, materialVen );
//108 940 000km 
venus.position.x = realSunR + 108940.000;
sun.add( venus );

const venusOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	realSunR + 108940.000, realSunR + 108940.000,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);
const venusPoints = venusOrbit.getPoints( 50 );
const VenusOrbitGeometry = new THREE.BufferGeometry().setFromPoints( venusPoints );
// const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const VenusOrbitLine = new THREE.Line( VenusOrbitGeometry, orbmaterial );
VenusOrbitLine.opacity = 0.5;
scene.add( VenusOrbitLine );

//camera 
camera.position.x = 0;
camera.position.y = 100000;
camera.position.z = 0;
//takes x,y,z args, points camera at that location
//camera.lookAt(sun.position);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

}

function animate(){
    requestAnimationFrame(animate);

    //Change the rotation speed of the earth
  
    earth.rotation.y += 0.0005;
    //set Moon's rotation
    moon.rotation.z += 0.001;
    // sun.rotation.z += 0.0001;
    // sunGrav.rotation.z += 0.0005;
    controls.update();
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
    camera.position.z = 450000;
    camera.position.x = -2000;
    camera.position.y = -10000;
    camera.lookAt(0,0,0);
}


//View Earth Button
let viewEarth = document.getElementById('viewEarthButton');
viewEarth.addEventListener("click", function()
{   
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( earth.matrixWorld );

    camera.position.x = vector.x ;
    camera.position.y = vector.y ;
    camera.position.z = vector.z + 5000 ;
    controls.target = vector;
    camera.lookAt(vector);
    
});

let viewMercury = document.getElementById('viewMercuryButton');
viewMercury.addEventListener("click", function()
{   
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( mercury.matrixWorld );

    camera.position.x = vector.x;
    camera.position.y = vector.y;
    camera.position.z = vector.z + 5000;
    controls.target = vector;
    camera.lookAt(vector);
 
});

let viewVenus = document.getElementById('viewVenusButton');
viewVenus.addEventListener("click", function()
{   
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( venus.matrixWorld );

    camera.position.x = vector.x ;
    camera.position.y = vector.y;
    camera.position.z = vector.z + 5000;
    controls.target = vector;
    camera.lookAt(vector);
  
});

init();
animate();