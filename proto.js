
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

// Textures taken from https://www.solarsystemscope.com/textures/
//All textures are 2k, 8k options are available, but increase load times

let scene, camera, renderer, earth, moon, sun, controls, mercury, venus, mars;


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
let displaySunR = 6963.40
let displayMarsR = 338.95;

let earthR, moonR, mercuryR, venusR, sunR;

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

// renderer.setClearColor(0xff0000, 1);

document.body.appendChild(renderer.domElement);

mercuryR = displayMercuryR;
earthR = displayEarthR;
moonR = displayMoonR;
venusR = displayVenusR;
sunR = displaySunR


//creating the scene background

const bLoader = new THREE.TextureLoader();
bLoader.load('Textures/2k_background.jpg' , function(texture)
            {
             scene.background = texture;  
            });

//the sun
// TODO: maybe change all these Geometry methods into a single class
const geometrySun = new THREE.SphereGeometry( sunR, 128, 64 );
const textureSun = new THREE.TextureLoader().load("Textures/2k_sun.jpg")
const materialSun = new THREE.MeshBasicMaterial( {map: textureSun} );
sun = new THREE.Mesh( geometrySun, materialSun );
scene.add( sun );

//the earth
const geometry = new THREE.SphereGeometry( earthR, 128, 64 );
const texture = new THREE.TextureLoader().load("Textures/2k_earth_daymap.jpg")
const material = new THREE.MeshBasicMaterial( {map: texture} );
earth = new THREE.Mesh( geometry, material );
earth.position.z = realSunR + AU
scene.add( earth );

const earthOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	AU + realSunR, AU + realSunR,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

//this is to add clouds above Earth, looks pretty but increases load time
const cloudGeo = new THREE.SphereGeometry( earthR+15, 128, 64 );
const cloudTexture = new THREE.TextureLoader().load("Textures/2k_earth_clouds.jpg")
const cloudMaterial = new THREE.MeshBasicMaterial( {map: cloudTexture} );
cloudMaterial.transparent = true;
cloudMaterial.opacity = 0.7;
const cloud = new THREE.Mesh(cloudGeo, cloudMaterial );
earth.add( cloud );


//drawing Earth's orbit
const earthPoints = earthOrbit.getPoints( 500 );
const EarthOrbitGeometry = new THREE.BufferGeometry().setFromPoints( earthPoints );
const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
//set the color of the orbit line to be translucent so that it doesn't cover the planets
orbmaterial.transparent = true;
orbmaterial.opacity = 0.4;
const earthOrbitLine = new THREE.Line( EarthOrbitGeometry, orbmaterial );
scene.add( earthOrbitLine );
//Change the orientation of the orbit line by 90 degrees to be less jank
earthOrbitLine.rotation.x = Math.PI / 2;

//the moon
const geometryMoon = new THREE.SphereGeometry( moonR, 32, 15 );
const textureMoon = new THREE.TextureLoader().load("Textures/2k_moon.jpg")
const materialMoon = new THREE.MeshBasicMaterial( {map: textureMoon} );
moon = new THREE.Mesh( geometryMoon, materialMoon );
//384400KM is the distance ,
moon.position.z = earthR + 3844.00;
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
const merPoints = mercuryOrbit.getPoints( 100 );
const MerOrbitGeometry = new THREE.BufferGeometry().setFromPoints( merPoints );
// const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const merOrbitLine = new THREE.Line( MerOrbitGeometry, orbmaterial );
scene.add( merOrbitLine );
merOrbitLine.rotation.x += Math.PI / 2;

//mercury - 2440KM radius
const geometryMer = new THREE.SphereGeometry( mercuryR, 64, 32 );
const textureMer = new THREE.TextureLoader().load("Textures/2k_mercury.jpg");
const materialMer = new THREE.MeshBasicMaterial( {map: textureMer} );
mercury = new THREE.Mesh( geometryMer, materialMer );
//47 000 000km 
mercury.position.z = realSunR + 47000.000;
//new to do math to move planet
scene.add( mercury );

//venus - 6051.8KM radius
const geometryVen = new THREE.SphereGeometry( venusR, 64, 32 );
const textureVen = new THREE.TextureLoader().load("Textures/2k_venus_surface.jpg");
const materialVen = new THREE.MeshBasicMaterial( {map: textureVen} );
venus = new THREE.Mesh( geometryVen, materialVen );
//108 940 000km 
venus.position.z = realSunR + 108940.000;
scene.add( venus );

const venusOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	realSunR + 108940.000, realSunR + 108940.000,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);
const venusPoints = venusOrbit.getPoints( 100 );
const VenusOrbitGeometry = new THREE.BufferGeometry().setFromPoints( venusPoints );
// const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const VenusOrbitLine = new THREE.Line( VenusOrbitGeometry, orbmaterial );
VenusOrbitLine.opacity = 0.5;
scene.add( VenusOrbitLine );
VenusOrbitLine.rotation.x = Math.PI / 2;

const geometryMars = new THREE.SphereGeometry( displayMarsR, 64, 32);
const textureMars = new THREE.TextureLoader().load("Textures/2k_mars.jpg");
const materialMars = new THREE.MeshBasicMaterial( {map: textureMars} );
mars = new THREE.Mesh( geometryMars, materialMars );
mars.position.z = realSunR + 228000;
scene.add( mars );


//camera 
camera.position.z = 450000;
camera.position.x = -2000;
camera.position.y = -10000;
//takes x,y,z args, points camera at that location
//camera.lookAt(sun.position);

controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

}



let timeMultiplier = 1;
let angleM = 0;
let angleV = 0;
let angleE = 0;
function animate(){

    requestAnimationFrame(animate);

    //Change the rotation speed of the earth
    earth.rotation.y += 0.0005;
    //set Moon's rotation
    moon.rotation.y += 0.001;
   
    //this controls the orbital movement of mercury
    angleM += 0.00001 * timeMultiplier;
    mercury.position.z = 696.340 + 70000.000 * (Math.sin(angleM)) - 10000;
    mercury.position.x = 696.340 + 47000.000 * (Math.cos(angleM));
    mercury.updateMatrix();

    //this controls the orbital movement of Venus
    angleV += 0.00005 * timeMultiplier;
    venus.position.z = 696.340 + 108940 * (Math.sin(angleV));
    venus.position.x = 696.340 + 108940 * ( Math.cos(angleV));
    venus.updateMatrix();

    //this controls the orbital movement of the Earth
    angleE += 0.00001 * timeMultiplier;
    earth.position.z = 696.340 + 150000.000 * (Math.sin(angleE));
    earth.position.x = 696.340 + 150000.000 * (Math.cos(angleE));
    earth.updateMatrix();
  

    controls.update();

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
    camera.position.y = 200000;
    camera.position.z = 0;
    camera.lookAt(0,0,0);
}


//View Sun Button

let viewSun = document.getElementById('viewSunButton');
viewSun.addEventListener("click", function()
{   
    camera.position.x = sun.position.x ;
    camera.position.y = sun.position.y ;
    camera.position.z = sun.position.z + 15000 ;
    controls.target = sun.position;
    camera.lookAt(sun);
    
});

//view earth button
let viewEarth = document.getElementById('viewEarthButton');
viewEarth.addEventListener("click", function()
{   
    camera.position.x = earth.position.x ;
    camera.position.y = earth.position.y ;
    camera.position.z = earth.position.z + 5000 ;
    controls.target = earth.position;
    camera.lookAt(earth);
    
});

let viewMercury = document.getElementById('viewMercuryButton');
viewMercury.addEventListener("click", function()
{   

    camera.position.x = mercury.position.x;
    camera.position.y = mercury.position.y;
    camera.position.z = mercury.position.z + 5000;
    controls.target = mercury.position;
    camera.lookAt(mercury);
 
});

let viewVenus = document.getElementById('viewVenusButton');
viewVenus.addEventListener("click", function()
{   

    camera.position.x = venus.position.x;
    camera.position.y = venus.position.y;
    camera.position.z = venus.position.z + 5000;
    controls.target = venus.position;
    camera.lookAt(venus);
  
});


//function  to set planets to their real, to scale sizes.
function setRealSizes(planet){
    planet.scale.x = 0.01;
    planet.scale.y = 0.01;
    planet.scale.z = 0.01;
    planet.updateMatrix();
}

//function  to set planets to their display sizes. Display sizes exists so that planets can actually be seen 
function setDisplaySizes(planet){
    planet.scale.x = 1;
    planet.scale.y = 1;
    planet.scale.z = 1;
    planet.updateMatrix();
}


//This is for the "real sizes" checkbox
document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');
  
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        //reduces the size of the sun by a factor of 10x. Since the display size of the sun is 10x real, the sun is now real size
        sun.scale.x = 0.1;
        sun.scale.y = 0.1;
        sun.scale.z = 0.1;
        sun.updateMatrix();

        //this can be optimized by putting the objects into an array and then parsing that array, but for now I'll just do it manually
        setRealSizes(mercury);
        setRealSizes(venus);
        setRealSizes(earth);
        //BUG: the Moon's orbit line should not change when 'real sizes' is toggled.
        //setRealSizes(moon);

      } else {
        sun.scale.x = 1;
        sun.scale.y = 1;
        sun.scale.z = 1;
        sun.updateMatrix();

        setDisplaySizes(mercury);
        setDisplaySizes(venus);
        setDisplaySizes(earth);
        setDisplaySizes(moon);


      }
    });
  });


//Event listener for the time buttons
let timeButton1x = document.getElementById('timeButton1x');
timeButton1x.addEventListener("click", function(){

    timeMultiplier = 1;

});

let timeButton100x = document.getElementById('timeButton100x');
timeButton100x.addEventListener("click", function(){

    timeMultiplier = 100;

});

let timeButton10000x = document.getElementById('timeButton10000x');
timeButton10000x.addEventListener("click", function(){

    timeMultiplier = 10000;

});







// START OF STARSHIP SECTION //
//TODO -- ADJUST CAMERA TO BE LESS JANKY -- MAKE CONTROLS BETTER (SMOOTHER) AND DIRECTIONAL
//TODO -- REMOVE EVENT LISTENER WHEN SPACESHIP TURNED OFF
let playerShip;
document.getElementById('flyShip').addEventListener("click", function()
{
    
    if(!playerShip){
        playerShip = new starShip(new THREE.Vector3(10000.0, 10000.0, 10000.0),true);
        playerShip.createStarship();
        const cameraOffset = new THREE.Vector3(0.5, 0.5, 0.5);
        const objectPosition = new THREE.Vector3();
        camera.position.set(playerShip.positionVector.x,playerShip.positionVector.y,playerShip.positionVector.z).add(cameraOffset);
        camera.lookAt(10000,10000,10000);
        // controls.target = playerShip.positionVector;
        console.log(camera.position);
 
    }else if(playerShip.isActive == true){
        playerShip.removeStarship();
    }else{
        playerShip.addStarship();
    }
    // objectPosition.setFromMatrixPosition( playerShip.ship.matrixWorld );
    // camera.position.copy(objectPosition).add(cameraOffset);

});


//Class containing starship properties
class starShip {
    
    

    constructor(positionVector,isActive) {
        this.positionVector = positionVector;
        this.isActive = isActive;
        this.ship;
    }


    createStarship(){
        const starShipGeometry = new THREE.SphereGeometry(0.01,32,16);
        //Commented out until I actually have a texture to load
        // const starShipTexture = new THREE.TextureLoader().load() 
        const starShipMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        this.ship = new THREE.Mesh(starShipGeometry, starShipMaterial);
        this.ship.position.set(this.positionVector.x, this.positionVector.y,this.positionVector.z);
        this.addStarship();
       
       
    }

    addStarship(){
        alert("Press 'W' to move the ship in the direction the camera is facing");
        //add the ship object to the canvas
        scene.add( this.ship );
        //focus controls to the ship (allow user to use orbit controls around the ship)
        controls.target = this.ship.position;
        console.log("ship added")
        this.isActive = true;

        //event listener to move starship
        document.addEventListener("keydown", this.eventListenerFunction);
    }

    removeStarship(){
        scene.remove( this.ship );
        this.isActive = false;
        //remove the event listener when the ship is removed
        document.removeEventListener("keydown", this.eventListenerFunction);
    }


    move(key,speedMultiplier){
        //This gets the current direction the camera is facing, so that holding 'w' moves you forward no matter the orientation 
        var direction = new THREE.Vector3();
        camera.getWorldDirection( direction);
        //Makes the amount moved larger by a factor of 10
        direction.multiplyScalar(10 * speedMultiplier);
        switch(key){
            case 'w':
                //this moves the ship along the scene
                camera.position.add( direction );
                //this moves the camera with the ship, keeping it a consistent amount away
                this.ship.position.add( direction );
                break;
            case 'a':

                break;
            case 's':
                
                break;
            case 'd':

                break;
            case 'q':
                
                break;
            case 'e':

                break;
            
        }
    }

    eventListenerFunction(e){
        //Gets the speed multiplier from the speed slider
        let speedMultiplier = document.getElementById('speedRange').value / 5;
        //Send the pressed key and the speed multiplier to the move function to move the ship
        playerShip.move(e.key,speedMultiplier);
    }

    //Creating the camera for the ship -- switch from orbit cam to perspective -- might not need this
    createShipCamera(){

        let shipCamera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );
    }
    
}

//Controls for the starship

    




init();
animate();