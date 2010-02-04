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

* Implement all existing transformations using the `matrix` operation.
* Simplify hash function to just use the underlying matrix representation.
* Add animation (currently only immediate transformations are possible).

  [wkt]: http://webkit.org/blog/130/css-transforms/
