document.addEventListener('DOMContentLoaded', function(event) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    if (context) {
        context.fillRect(0, 0, 500, 300);
        context.fillStyle = '#a5d8d7';
        context.fillRect(100, 50, 300, 200);
    }
});

// var webgl = canvas.getContext('webgl')
//     || canvas.getContext('experimental-webgl');
//
// if (!webgl || !(webgl instanceof WebGLRenderingContext) ) {
//     alert('Failed to get WebGL context.');
// } else {
//     alert('Great, your browser supports WebGL.');
// }
