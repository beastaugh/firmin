---
title: Firmin, a JavaScript animation library using CSS transforms and transitions
---

**Firmin** is a JavaScript animation library that uses CSS transforms and
transitions to create smooth, hardware-accelerated animations.

The project [resides on GitHub]. You can report bugs and request features on
[the issue tracker]. To see the project development history, take a look at
[the changelog].

[resides on GitHub]: https://github.com/beastaugh/firmin
[the issue tracker]: https://github.com/beastaugh/firmin/issues
[the changelog]:     /changelog.html


Downloads
---------

The latest release of Firmin is version **1.0.0**.

* [Development version](/downloads/firmin-1.0.0.js)
* [Production version](/downloads/firmin-1.0.0-min.js)
  <small>8.3kb packed, 2.4kb gzipped</small>

Older versions are available from [the release archive].

[the release archive]: /downloads.html


Using Firmin
------------

Firmin's API is not large, and mainly consists of convenience methods which
make performing particular transforms easier. All of these methods are based on
two core operations: the `animate` function and the `animate` method.

The `animate` function takes three arguments: the element to be animated; a
description of the animation to be run; and the duration of the animation.
Durations can be given as a string ending in `s` (meaning a time in seconds) or
`ms` (meaning milliseconds). They can also be given as plain numbers, in which
case they are assumed to denote a time in seconds.

~~~{.JavaScript}
var box = document.getElementById("box");

Firmin.animate(box, {
    skew: {
        x: "45deg",
        y: "30deg"
    }
}, "2.1s");
~~~

It's worth mentioning that any Firmin animation without a specified duration
will be executed instantaneously---that is, the element will transition
from its initial state to its final state with no visible intermediate states.

The `animate` function returns an object with a complementary `animate` method.
This method takes two arguments, an animation description and a duration, and
will be applied to the same element (in other words, the method's interface is
the same as the function's, just without the element parameter). This allows
animations to be chained, applying transformations sequentially.

~~~{.JavaScript}
Firmin.animate(box, {translateX: "200px"}, "1.6s")
      .animate({translateY: "100px"}, "0.8s");
~~~

There are a number of shortcut methods with the same names as the CSS transform
functions. These provide a convenient way to perform single transformations
without passing a verbose description to `animate`. Detailed documentation can
be found in the [reference](/api.html). All of Firmin's objects and methods
fall under the `Firmin` namespace.

### Transform origins

Aside from the transforms themselves, there is a further transform-related
property which can be given in an animation description: the `origin` from
which the transform will be performed. This should be supplied as an object
with `x` and `y` properties (both CSS lengths).

~~~{.JavaScript}
Firmin.animate(box, {
    rotate: "1.5rad",
    origin: {x: "10%", y: 0}
}, "400ms");
~~~

CSS transitions will also animate other properties, not merely transforms. For
example, one could animate the opacity, background colour or height of an
element. CSS property names are given in camelCase as is usual when modifying
them with JavaScript.

~~~{.JavaScript}
Firmin.animate(box, {
    opacity:         0.8,
    height:          "200px",
    backgroundColor: "#000"
}, 0.5);
~~~


Relative transforms
-------------------

Every animation function in Firmin has a complementary _relative_ version;
these can be used simply by appending an uppercase `R` to the function name,
e.g. `Firmin.animateR` or `Firmin.translateXR`.

When using a relative animation, any transform functions called will use the
element's current transformation matrix as a basis for the new transformation
being generated, rather than the identity or origin matrix.

For example, if one wanted to move an element 100 pixels to the right, and then
move it 200 pixels up, then using Firmin's normal, absolute animation functions
one would write this:

~~~{.JavaScript}
Firmin.translateX(el, 100).translate(el, {x: 100, y: -200});
~~~

In many contexts, this can be expressed more naturally using a relative
transformation: move the element 100 pixels to the right, and then move it 200
pixels up.

~~~{.JavaScript}
Firmin.translateX(el, 100).translateYR(el, -200);
~~~

Relative animations can be used at any time; Firmin maintains an internal list
of previous animations which can be referred to when necessary, so one can call
a series of absolute transforms and then a relative transform, or vice versa.

This internal state is encapsulated in the `Animated` objects returned by all
transform functions and methods. This is similar to the way other libraries
which offer chaining APIs (like jQuery) work. To make what's going on here
clearer, let's replace the chains of method calls used above with a more
obviously stateful assignment and sequence of method calls.

~~~{.JavaScript}
// Store a reference to the Animated object encapsulating
// the element's transformation state.
var animated = Firmin.rotate(el, 90);

// Call an animation method on that object.
animated.skewX(30);

// Call a relative transform on that object; the final transformation
// state will include a rotation through 120 degrees, not 30.
animated.rotateR(30);
~~~

Transform states are stored in these `Animated` instances, rather than read
from the DOM. Because of this, to perform relative transforms on an element a
reference to the relevant object must be kept, whether through a variable or a
sequence of method calls.


Operation order
---------------

[Matrix multiplication] for non-[diagonal] square matrices is not in general
[commutative], so the order in which transforms are applied will affect the
final state of the transform. Consider this CSS declaration:

[Matrix multiplication]: http://en.wikipedia.org/wiki/Matrix_multiplication
[diagonal]:              http://en.wikipedia.org/wiki/Diagonal_matrix
[commutative]:           http://en.wikipedia.org/wiki/Commutativity

~~~{.CSS}
#an-element {
    transform: skew(15deg, 30deg) rotate(45deg);
}
~~~

This is _not_ equivalent to the following declaration:

~~~{.CSS}
#an-element {
    transform: rotate(45deg) skew(15deg, 30deg);
}
~~~

Firmin will respect the order of operations specified in an animation
description, so one can write Firmin code that will produce the same outcome as
the first CSS declaration above.

~~~{.JavaScript}
Firmin.animate(document.getElementById("an-element"), {
    skew:   {x: "15deg", y: "30deg"},
    rotate: "45deg"
});
~~~

One could also use the relative transform functions to generate the same final
transformation as the second example CSS declaration.

~~~{.JavaScript}
Firmin.rotate(document.getElementById("an-element"), "45deg")
      .skewR({x: "15deg", y: "30deg"});
~~~

One caveat is necessary. Firmin is able to respect the order of operations
specified in an animation description only because most widely-used JavaScript
interpreters iterate over object properties (using a `for...in` loop) in the
order that they those properties are declared, despite the fact that the
JavaScript specification states that "The mechanics and order of
enumerating the properties is not specified."


Supported platforms
-------------------

Currently, the only supported platforms are those that use a recent version of
the WebKit engine: _Safari 4_ and _5_, _Mobile Safari_ (i.e. iPhone and iPad)
and _Google Chrome_. While CSS transforms and transitions are available for
other browsers such as Opera 10.50 and Firefox 4, their implementations are
less than complete. The CSS transforms and transitions API is experimental, and
support for it varies between browsers. In the future, I hope to make Firmin
compatible with more browsers.

### Hardware acceleration

One advantage of combining CSS transforms and transitions is that together they
provide hardware-accelerated animation on WebKit-based browsers such as Safari
on the Mac and Mobile Safari on the iPhone. Transitions which change the
`opacity` property are also hardware accelerated on these platforms.


Transition properties
---------------------

The description object passed to the `animate` function allows for the
customisation of the transition. The properties that can be used to do this
are:

* `properties`
* `timingFunction`
* `duration`
* `delay`

Here's an example using all of them.

~~~{.JavaScript}
Firmin.animate(document.getElementById("an-element"), {
    backgroundColor: "#C4DDDA"
    color:           "#142367",
    opacity:         0.75,
    
    properties:      ["opacity", "color"],
    timingFunction:  "ease-out",
    duration:        "2s",
    delay:           "1s"
});
~~~

### `properties`

This allows for the filtering of properties which the transition will be
applied to. It defaults to `"all"` and can be set to the string `"none"` or an
array of CSS property names. It's described in detail in the CSS Transitions
Module specification [section 2.1].

### `timingFunction`

This allows for control over how intermediate values used during a transition
will be calculated. It accepts the name of a timing function as a string, or an
array of numbers to be passed to the `cubic-bezier` function. There are five
timing functions defined in the spec: `ease`, `linear`, `ease-in`, `ease-out`
and `ease-in-out`. The default is `ease`. See [section 2.3] of the CSS
Transitions Module specification for details.

### `duration`

The time taken by the transition. It can be specified in either seconds
(`"1.5s"`) or milliseconds (`"300ms"`). If a number is given, rather than a
string, it will be interpreted as a value in seconds. Negative values are
interpreted as `0`, i.e. executing immediately.

### `delay`

This accepts a time in the same way as `duration`, and specifies an interval to
delay the execution of the transition by. Negative values will result in the
transition executing immediately, but will begin part-way through the play
cycle. This is explained further in [section 2.4] of the specification.

[section 2.1]: http://www.w3.org/TR/css3-transitions/#the-transition-property-property-
[section 2.3]: http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
[section 2.4]: http://www.w3.org/TR/css3-transitions/#the-transition-delay-property-


Units
-----

Most CSS properties, including transform functions and transition durations,
have a magnitude and a unit. Angles are given in degrees, or radians; lengths
in pixels or ems; times in seconds or milliseconds. In order to be as flexible
as possible, Firmin accepts (with a couple of restrictions) the same CSS
datatype values as a stylesheet. Keywords are not currently accepted as
arguments to transform functions.

### Angles

Angles can be given as strings in _radians_ (e.g. `"2rad"`), _grads_ (e.g.
`"1grad"`), _turns_ (e.g. `"0.5turn"`) and _degrees_ (e.g. `"45deg"`).
These correspond exactly to the [CSS angle type]. The default is degrees, so if
you provide a number as an angle argument, it is assumed to be in degrees.

### Lengths

Because lengths in CSS are generally relative to the current browser and
operating system environment, Firmin only accepts _pixel_ lengths, e.g.
`"340px"` or `340`.

### Times

Times can be given as strings in _seconds_ (e.g. `"2s"`) or _milliseconds_
(e.g. `"300ms"`). The default is seconds, so if you provide a numeric argument,
Firmin will assume it is in seconds.

[CSS angle type]: http://www.w3.org/TR/css3-values/#angles


Axes
----

A number of transform functions modify the state of an element relative to
a particular axis. For example, `translateX` will move the
element along the horizontal (_X_) axis, while `scaleY`
scales the element vertically (along the _Y_ axis). The _Z_
axis can be thought of as going into or coming out of the screen.

As well as the `translate` function, `scale` and
`rotate` both have _X_, _Y_ and _Z_
versions, while `skew` only has _X_ and _Y_
variants (`matrix` always operates on all three axes, and so has
no axis-specific functions).
