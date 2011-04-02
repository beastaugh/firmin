Firmin
======

[Firmin] is a JavaScript animation library based on CSS [transforms] and
[transitions].

    var box = document.getElementById("box");
    
    Firmin.animate(box, {
        scale:     {x: 2, y: 3},
        translate: {x: -100, y: 35}
    }, 0.5);

[Firmin]:      http://extralogical.net/projects/firmin
[transforms]:  http://www.w3.org/TR/css3-2d-transforms/
[transitions]: http://www.w3.org/TR/css3-transitions/
