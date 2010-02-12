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

* Decide on the merge order semantics for multiple simultaneous transforms.
* Add a testing DSL to make it easier to gauge whether or not animations are
  executing as expected.
* Add support for stateful animations, where each new transformation applied
  takes the _current_ state of the object as its origin, rather than its
  initial state.
* Add support for 3D transforms.
* Add parser to support different value types, e.g. radians as well as degrees.

  [wkt]: http://webkit.org/blog/130/css-transforms/
