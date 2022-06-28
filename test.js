// var two = new Two({
//     fullscreen: true
// });

var el = document.getElementById("test"),
    two = new Two({
        fullscreen:true
    }).appendTo(el);

var circle = two.makeCircle(110,110,100);
circle.fill ="blue";
two.update();

document.onkeydown = function (e) {
    switch (e.key) {
        case 'ArrowUp':
            circle.translation.y = -5;
            two.update();
            break;
        case 'ArrowDown':
            circle.translation.y = 5;
            two.update();
            break;
        case 'ArrowLeft':
            // left arrow
            break;
        case 'ArrowRight':
            // right arrow
    }
};