Firmin.js
=========

Firmin is a JavaScript animation library based on [WebKit transforms][wkt].

    var box = document.getElementById("box");
    
    Firmin.animate(box, {
        scale:     {x: 2, y: 3},
        translate: {x: -100, y: 35}
    }, 0.5);


Roadmap
-------

* Add a testing DSL to make it easier to gauge whether or not animations are
  executing as expected.
* Implement all existing transformations using the `matrix` operation.
* Write a smarter merge function to use transform defaults where values are not
  supplied, allowing us to reduce the size of the library by ripping out a lot
  of boilerplate.
* Simplify hash function to just use the underlying matrix representation.
* Add support for stateful animations, where each new transformation applied
  takes the _current_ state of the object as its origin, rather than its
  initial state.
* Add support for 3D transforms.

  [wkt]: http://webkit.org/blog/130/css-transforms/
