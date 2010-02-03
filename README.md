Firmin.js
=========

Firmin is a JavaScript animation library based on [WebKit transforms][wkt].

    var box = document.getElementById("box");
    Firmin.tranform(box, {
        scale:     {x: 2, y: 3},
        translate: {x: -100, y: 35}
    });


Roadmap
-------

* Supplement the API with skew, rotate and matrix transformations.
* Add animation (currently only immediate transformations are possible).

  [wkt]: http://webkit.org/blog/130/css-transforms/
