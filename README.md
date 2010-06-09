Firmin
======

[Firmin][site] is a JavaScript animation library based on CSS [transforms][tf]
and [transitions][ts].

    var box = document.getElementById("box");
    
    Firmin.animate(box, {
        scale:     {x: 2, y: 3},
        translate: {x: -100, y: 35}
    }, 0.5);


  [site]: http://extralogical.net/projects/firmin
  [tf]:   http://www.w3.org/TR/css3-2d-transforms/
  [ts]:   http://www.w3.org/TR/css3-transitions/
