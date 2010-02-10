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
* Expand and improve the API for creating and modifying Transformations.
* Add support for 3D transforms.

  [wkt]: http://webkit.org/blog/130/css-transforms/
