import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

// Textures taken from https://www.solarsystemscope.com/textures/
//All textures are 2k, 8k options are available, but increase load times
//3D models taken from https://solarsystem.nasa.gov/resources
let scene, camera, renderer, earth, moon, sun, controls, mercury, venus, mars, jupiter, saturn, uranus, neptune;
let phobos, deimos;
let realsize = false;
let light;

//DEFINING ASTRONOMICAL SIZES
let AU = 150000000 / 100;
let sunR = 696340 / 100;
let mercuryR = 2439.7 / 100;
let venusR = 6051.8 / 100;
let earthR = 6371 / 100;
let moonR = 1737.4 / 100;
let marsR = 3389.5 / 100;
let phobosR = 11.267 / 100;
let deimosR = 6.200 / 100;
let jupiterR = 69911 / 100;
let saturnR = 58232 / 100;
let saturnOrbitRadius = 1427000000 / 100;
let uranusR = 25362 / 100;
let uranusOrbitRadius = 2900000000 / 100;
let neptuneR = 24622 / 100;
let neptuneOrbitRadius = 4500000000 / 100;

//Class to create the geometry for all celestial objects (stars, moons, suns)
class CelestialObject{

    constructor(radius, orbit, texture){
        this.radius = radius;
        this.orbit = orbit;
        this.texture = texture;
        this.mesh;
        this.childrenArray = [];
        this.rotation;
        this.orbitalSpeed;
        // WIP
        // this.mass = mass;
        // this.gravity = gravity;
    }  
    
    buildMesh(isSun){
        const geometry = new THREE.SphereGeometry( this.radius, 128, 64 );
        const texture = new THREE.TextureLoader().load(this.texture);
        let material;
        if(isSun){
            material = new THREE.MeshBasicMaterial( {map: texture} );
        }else{
            material = new THREE.MeshLambertMaterial( {map: texture} );
        }
        this.mesh = new THREE.Mesh( geometry, material);
        scene.add(this.mesh);
        this.mesh.position.z = this.orbit;
        setDisplaySizes(this.mesh);
    }

    //method to add children to object. used for moons and atmospheres
    addChild(childRadius, childOrbit, childTexture, type){
        const childGeometry = new THREE.SphereGeometry( childRadius, 128, 64 );
        const childTextureLoaded = new THREE.TextureLoader().load(childTexture);
        const childMaterial = new THREE.MeshLambertMaterial( {map: childTextureLoaded} );
        if(type == "atmo"){
            childMaterial.transparent = true;
            childMaterial.opacity = 0.7;

        }else if(type == "moon"){
            
        }
        let childObject = new THREE.Mesh( childGeometry, childMaterial);
        childObject.position.z = childOrbit;
        this.mesh.add(childObject);
        return childObject;
        
    }
}


//setting up the scene
function init(){

scene = new THREE.Scene();

//defining the camera's settings
camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    50000000
);

//creating the renderer
renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//This is the code for the skybox
//Whats happening is that the scene is inside a giant sphere, which allows you to pan with the background
const sky = new THREE.SphereGeometry(300000000,64,32);
const backgroundTexture = new THREE.TextureLoader().load("Textures/8k_background.jpg");
const skyMat = new THREE.MeshBasicMaterial({map: backgroundTexture, side: THREE.BackSide });
const skybox = new THREE.Mesh( sky, skyMat);
scene.add( skybox );

//the sun
const sunClass = new CelestialObject(sunR,0,"Textures/2k_sun.jpg");
sunClass.buildMesh(true);
sun = sunClass.mesh;

//mercury - 2440KM radius
const mercuryClass = new CelestialObject(mercuryR, sunR + (47000000 / 100), "Textures/2k_mercury.jpg");
mercuryClass.buildMesh(false);
mercury = mercuryClass.mesh;

//venus - 6051.8KM radius
const venusClass = new CelestialObject(venusR, sunR + (108940000 / 100), "Textures/2k_venus_surface.jpg");
venusClass.buildMesh(false);
venus = venusClass.mesh;

//the earth
const earthClass = new CelestialObject(earthR,sunR + AU,"Textures/2k_earth_daymap.jpg");
earthClass.buildMesh(false);
//mesh must be build before adding children
//this is to add clouds above Earth, looks pretty but increases load time
earthClass.addChild(earthR+3,0,"Textures/2k_earth_clouds.jpg","atmo");
//the moon
moon = earthClass.addChild(moonR, earthR + (384400 / 100), "Textures/2k_moon.jpg", "moon")
earth = earthClass.mesh;

//mars 
const marsClass = new CelestialObject(marsR, sunR + (228000000 / 100), "Textures/2k_mars.jpg");
marsClass.buildMesh(false);
//Phobos orbits so close to mars (6000KM) that a display radius is needed
//TODO : Add this display radius
phobos = marsClass.addChild(phobosR, marsR + (6000 / 100), "Textures/Phobos.jpg", "moon")
deimos = marsClass.addChild(deimosR, marsR + (23458 / 100), "Textures/Deimos.jpg", "moon")
mars = marsClass.mesh;

const jupiterClass = new CelestialObject(jupiterR,sunR + (778000000 / 100), "Textures/2k_jupiter.jpg");
jupiterClass.buildMesh();
jupiter = jupiterClass.mesh;

const saturnClass = new CelestialObject(saturnR, sunR + saturnOrbitRadius, "Textures/2k_saturn.jpg" )
saturnClass.buildMesh();
saturn = saturnClass.mesh;

//These ring sizes are rough estimates
//TODO: Fix the ring texture
const saturnRing = new THREE.RingGeometry( saturnR + 30000/100, saturnR + 75000/100, 128 );
const ringTexure = new THREE.TextureLoader().load("Textures/2k_saturn_ring.png");
const ringMaterial = new THREE.MeshBasicMaterial( { map: ringTexure, side: THREE.DoubleSide } );
const ring = new THREE.Mesh( saturnRing, ringMaterial );
ring.rotation.x = Math.PI / 2;
saturn.add( ring );

const uranusClass = new CelestialObject(uranusR, sunR + uranusOrbitRadius, "Textures/2k_uranus.jpg");
uranusClass.buildMesh();
uranus = uranusClass.mesh;

const neptuneClass = new CelestialObject(neptuneR, sunR + neptuneOrbitRadius, "Textures/2k_neptune.jpg");
neptuneClass.buildMesh();
neptune = neptuneClass.mesh;



const earthOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	AU + sunR, AU + sunR,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);



//TODO: Create function to hold all of these orbits
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

const moonOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	earthR + (384400 / 100), earthR + (384400 / 100),           // xRadius, yRadius
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

//TODO: Find and put in the real numbers for this
const mercuryOrbit = new THREE.EllipseCurve(
	0,  -10000,            // ax, aY
	sunR + 470000.00, sunR + 470000.00,           // xRadius, yRadius
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

const venusOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	sunR + 1089400.00, sunR + 1089400.00,           // xRadius, yRadius
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

const marsOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	sunR + 2280000.00, sunR + 2280000.00,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

const marsPoints = marsOrbit.getPoints( 1000 );
const MarsOrbitGeometry = new THREE.BufferGeometry().setFromPoints( marsPoints );
// const orbmaterial = new THREE.LineBasicMaterial( { color: 0x0d0dd1 } );
const marsOrbitLine = new THREE.Line( MarsOrbitGeometry, orbmaterial );
scene.add( marsOrbitLine );
marsOrbitLine.rotation.x += Math.PI / 2;


const jupiterOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	sunR + (778000000 / 100), sunR + (778000000 / 100),           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

const jupiterPoints = jupiterOrbit.getPoints( 2000 );
const jupiterOrbitGeometry = new THREE.BufferGeometry().setFromPoints( jupiterPoints );
const jupiterOrbitLine = new THREE.Line( jupiterOrbitGeometry, orbmaterial );
scene.add( jupiterOrbitLine );
jupiterOrbitLine.rotation.x += Math.PI / 2;

const saturnOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	sunR + saturnOrbitRadius, sunR + saturnOrbitRadius,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

const saturnPoints = saturnOrbit.getPoints( 2000 );
const saturnOrbitGeometry = new THREE.BufferGeometry().setFromPoints( saturnPoints );
const saturnOrbitLine = new THREE.Line( saturnOrbitGeometry, orbmaterial );
scene.add( saturnOrbitLine );
saturnOrbitLine.rotation.x += Math.PI / 2;

const uranusOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	sunR + uranusOrbitRadius, sunR + uranusOrbitRadius,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

const uranusPoints = uranusOrbit.getPoints( 2000 );
const uranusOrbitGeometry = new THREE.BufferGeometry().setFromPoints( uranusPoints );
const uranusOrbitLine = new THREE.Line( uranusOrbitGeometry, orbmaterial );
scene.add( uranusOrbitLine );
uranusOrbitLine.rotation.x += Math.PI / 2;

const neptuneOrbit = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	sunR + neptuneOrbitRadius, sunR + neptuneOrbitRadius,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

const neptunePoints = neptuneOrbit.getPoints( 2000 );
const neptuneOrbitGeometry = new THREE.BufferGeometry().setFromPoints( neptunePoints );
const neptuneOrbitLine = new THREE.Line( neptuneOrbitGeometry, orbmaterial );
scene.add( neptuneOrbitLine );
neptuneOrbitLine.rotation.x += Math.PI / 2;


//This is the light coming from the sun
const color = 0xFFFFFF;
const intensity = 1;
light = new THREE.PointLight(color, intensity, 0);
light.position.set(0, 10, 0);
scene.add(light);


//a very subtle ambient light for aesthetic reasons
const ambientlight = new THREE.AmbientLight( 0x404040, 0.15 ); 
scene.add( ambientlight );

//camera 
camera.position.x = 4000000;
camera.position.y = 3000000;
camera.position.z = 3750000;
//takes x,y,z args, points camera at that location
//camera.lookAt(sun.position);

controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.zoomSpeed = 1;

}



let timeMultiplier = 1;
let angleM = 0;
let angleV = 0;
let angleE = 0;
let angleMars = 0;
function animate(){

    requestAnimationFrame(animate);

    console.log(camera.position);
    //Change the rotation speed of the planets
    earth.rotation.y += 0.005;
    //set Moon's rotation
    moon.rotation.y += 0.001;
    mars.rotation.y += 0.001;
    jupiter.rotation.y += 0.0005;
    saturn.rotation.y += 0.0005;
    uranus.rotation.y += 0.0005;
    neptune.rotation.y += 0.0005;
   
    //this controls the orbital movement of mercury
    angleM += 0.00001 * timeMultiplier;
    mercury.position.z = sunR + (47000000 / 100) * (Math.sin(angleM)) - 10000;
    mercury.position.x = sunR + (47000000 / 100) * (Math.cos(angleM));
    mercury.updateMatrix();

    //this controls the orbital movement of Venus
    angleV += 0.00005 * timeMultiplier;
    venus.position.z = sunR + 1089400.00 * (Math.sin(angleV));
    venus.position.x = sunR + 1089400.00 * ( Math.cos(angleV));
    venus.updateMatrix();

    //this controls the orbital movement of the Earth
    angleE += 0.00001 * timeMultiplier;
    earth.position.z = sunR + AU * (Math.sin(angleE));
    earth.position.x = sunR + AU * (Math.cos(angleE));
    earth.updateMatrix();
  
    //angleMars += 0.00002 * timeMultiplier;
    mars.position.z = sunR + 2280000.00 * (Math.sin(angleMars));
    mars.position.x = sunR + 2280000.00 * (Math.cos(angleMars));
    mars.updateMatrix();

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
    camera.position.y = 2000000;
    camera.position.z = 0;
    camera.lookAt(0,0,0);
}

//Function to use for viewing the planets
function view(object){
    let offset;
    if(!realsize){
        offset = 10000;
    }else{
        offset = 50;
    }

    camera.position.x = object.position.x ;
    camera.position.y = object.position.y ;
    camera.position.z = object.position.z + offset ;
    controls.target = object.position;
    camera.lookAt(object);
}

//View Sun Button
let viewSun = document.getElementById('viewSunButton');
viewSun.addEventListener("click", function()
{   
    view(sun);
});

//view earth button
let viewEarth = document.getElementById('viewEarthButton');
viewEarth.addEventListener("click", function()
{   
    view(earth);
});

let viewMoon = document.getElementById('viewMoonButton');
viewMoon.addEventListener("click", function()
{   
  console.log("WIP")
    
});

let viewMercury = document.getElementById('viewMercuryButton');
viewMercury.addEventListener("click", function()
{   
    view(mercury);
});

let viewVenus = document.getElementById('viewVenusButton');
viewVenus.addEventListener("click", function()
{   
    view(venus);
});

let viewMars = document.getElementById('viewMarsButton');
viewMars.addEventListener("click", function()
{   
    view(mars);
});

let viewJupiter = document.getElementById('viewJupiterButton');
viewJupiter.addEventListener("click", function()
{   
    view(jupiter);
});

let viewSaturn = document.getElementById('viewSaturnButton');
viewSaturn.addEventListener("click", function()
{   
    view(saturn);
});

let viewUranus = document.getElementById('viewUranusButton');
viewUranus.addEventListener("click", function()
{   
    view(uranus);
});

let viewNeptune = document.getElementById('viewNeptuneButton');
viewNeptune.addEventListener("click", function()
{   
    view(neptune);
});


//function  to set planets to their real, to scale sizes.
function setRealSizes(planet){
    planet.scale.x = 1;
    planet.scale.y = 1;
    planet.scale.z = 1;
    planet.updateMatrix();
}

//function  to set planets to their display sizes. Display sizes exists so that planets can actually be seen 
function setDisplaySizes(planet){
    planet.scale.x = 20;
    planet.scale.y = 20;
    planet.scale.z = 20;
    planet.updateMatrix();
}


//This is for the "real sizes" checkbox
document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');
  
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        
        //this can be optimized by putting the objects into an array and then parsing that array, but for now I'll just do it manually
        setRealSizes(sun);
        setRealSizes(mercury);
        setRealSizes(venus);
        setRealSizes(earth);
        setRealSizes(mars);
        //BUG: the Moon's orbit line should not change when 'real sizes' is toggled.
        // setRealSizes(moon);

      } else {
        
        setDisplaySizes(sun);
        setDisplaySizes(mercury);
        setDisplaySizes(venus);
        setDisplaySizes(earth);
        //setDisplaySizes(moon);
        setDisplaySizes(mars);


      }
      //Flip realsize bool depending on switch
      realsize = !realsize;
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