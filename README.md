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


Development
-----------

To build Firmin from source you will need [Ruby], [RubyGems] and [Bundler]. The
test suite also depends on [JS.Class], which is provided as a Git submodule. To
get everything working, run the following shell commands in order.

    # Download the source code
    git clone git://github.com/beastaugh/firmin.git
    cd firmin
    git submodule update --init --recursive
    
    # Install dependencies
    gem install bundler
    bundle install
    
    # Build the test framework and Firmin
    cd vendor/jsclass
    jake
    cd -
    jake
    
    # Run tests
    open test/runner.html

The last command will (on OS X, anyway) open the test runner for Firmin's
automated test suite. The test runner page also includes links to the manual
tests which must be run by hand in a browser.

The `FirminCSSMatrix` test suite currently fails on non-WebKit browsers as the
`WebKitCSSMatrix` class is not available as a reference implementation.

[Ruby]:     http://www.ruby-lang.org/
[RubyGems]: http://rubygems.org/
[Bundler]:  http://gembundler.com/
[JS.Class]: http://jsclass.jcoglan.com/
