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

* Implement a merge function that creates a current transformation matrix by
  concatenating the various transforms applied.
* Add a testing DSL to make it easier to gauge whether or not animations are
  executing as expected.
* Add support for stateful animations, where each new transformation applied
  takes the _current_ state of the object as its origin, rather than its
  initial state.
* Add support for 3D transforms.

  [wkt]: http://webkit.org/blog/130/css-transforms/
