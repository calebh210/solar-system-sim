document.addEventListener('DOMContentLoaded', function(event) {
    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame;
    })();

    function animateScene() {
        requestAnimationFrame(animateScene);

        cube.rotation.y += 0.01;
         // cube.rotation.x += 0.01;

        renderScene();
    }

    function createCube() {

        var loader = new THREE.TextureLoader();
        var image1 = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/768px-LinkedIn_logo_initials.png' );
        var image2 = loader.load( 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' );

        var cubeMaterials = [
            new THREE.MeshBasicMaterial({map: image1 }),
            new THREE.MeshBasicMaterial({map: image2 }),
            new THREE.MeshBasicMaterial({color:0xd2dbeb}),
            new THREE.MeshBasicMaterial({color:0xa3a3c6}),
            new THREE.MeshBasicMaterial({color:0xfe6b9f}),
            new THREE.MeshDepthMaterial({color:0x856af9})
        ];

        var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
        var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);

        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        return cube;
    }

    function startScene(cube) {
        var canvas = document.getElementById('canvas');
        render = new THREE.WebGLRenderer({ alpha: true });

        render.setClearColor(0x000000, 0);

        var canvasWidth = canvas.getAttribute('width');
        var canvasHeight = canvas.getAttribute('height');
        render.setSize(canvasWidth, canvasHeight);

        canvas.appendChild(render.domElement);

        scene = new THREE.Scene();
        var aspect = canvasWidth / canvasHeight;

        camera = new THREE.PerspectiveCamera(45, aspect);
        camera.position.set(0, 0, 0);
        camera.lookAt(scene.position);
        scene.add(camera);

        cube.position.set(0, 0, -7.0);
        scene.add(cube);
    }

    function renderScene() {
        render.render(scene, camera);
        render.setPixelRatio( window.devicePixelRatio );
    }

    var cube = createCube();
    startScene(cube);
    animateScene();
    renderScene();

});
