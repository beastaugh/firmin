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


Hacking on Firmin
-----------------

To build Firmin from source you will need [Ruby], [RubyGems] and [Bundler]. Once
these prerequisites are installed, run the `bundle install` command in the
repository's top-level directory to install the required gems. You can then run
the `jake` command to build the library.

You must build the library in order to run the test suite. Once you've run the
`jake` command, just open the `*.html` files in the `test/` directory in a
browser.
