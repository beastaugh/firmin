---
title: Firmin API reference
---

API reference
=============

Each of the functions documented below has a complementary [relative transform
function], which can be used simply by appending _R_ to the function name. For
example, to use the relative version of the `translate` function, call
`translateR`.

Some functions have specialised variants which only apply the given transform
to one axis---for example, `skew` has `skewX` and `skewY`. These [axis
functions] will be mentioned together after the primary function description:
they all have the same signature and work in the same way, save for applying
the transform in question to different axes.

When using a relative axis function, the _R_ always goes on the end, so the
relative version of scale applied to the _Y_ axis would be `scaleYR`.

Some functions have aliases---for example, `scale` is aliased as `scale3d`.
This is solely to maintain parity at the API level with the various CSS
transform specifications.

In the examples that follow, animation durations will often be omitted in order
to focus on the transformation at hand. However, the default duration is 0, so
the duration argument must be passed if a transformation is not to be executed
immediately with no intermediate stages (i.e., without animating).

[relative transform function]: /#relative-transforms
[axis functions]:              /#axes


<h3 id="api-animate">animate</h3>

`Firmin.animate(element, description, [duration], [callback])`

The `animate` function is the foundation of Firmin's API: every other transform
function is essentially a wrapper around its functionality. Everything one can
do with the other transform functions, one can do with `animate`, although it
is usually less convenient.

The _description_ object describes the animation to be carried out. For
example, this animation would move the element 400 pixels to the right and
double its height.

~~~{.JavaScript}
var el = document.getElementById("an-element"),
    tf = {
        translateX: 400,
        scaleY:     2
    };

Firmin.animate(el, tf);
~~~
    
Instead of using `animate` with a transform description, one can use the
named transform functions. Each transform function (e.g. `translateX`,
`skewY`) accepts a transform value as its second argument. This value is also
what should be used in the `transform` object when calling `animate`. In other
words,

~~~{.JavaScript}
Firmin.animate(el, {skewX: "1rad"});
~~~~

is equivalent to
    
~~~{.JavaScript}
Firmin.skewX(el, "1rad");
~~~
    
The optional `duration` argument specifies the duration of the animation in
seconds; the default value is 0.

A callback function can also be supplied. It will be executed when the
animation is complete. For example, running the following would rotate the
element through 135&deg; and then change its contents to the string "Hello,
world" when the animation completed after 0.7 seconds. Callbacks can be passed
to all animation functions and methods.

~~~{.JavaScript}
Firmin.rotate(el, "135deg", "0.7s", function(elem) {
    elem.innerHTML = "Hello, world";
});
~~~

The `animate` function also allows the animation it creates to be customised
further, by providing [transition properties] in the description object.

~~~{.JavaScript}
Firmin.animate(el, {
    translateX:     200,
    timingFunction: "ease-in-out",
    delay:          -0.5
}, 2);
~~~

As well as transformations, other CSS properties can be modified by animations.
For example, modifying an element's opacity is quite common.

~~~{.JavaScript}
Firmin.animate(el, {
    opacity: 0.5,
    padding: "10px"
}, "250ms");
~~~

[transition properties]: /#transition-properties


Translation functions
---------------------

<h3 id="api-translate">translate</h3>

`Firmin.translate(element, distances, [duration], [callback])`

The _distances_ object can have three properties: the `x` (horizontal), `y`
(vertical) and `z` (depth) distances which the element should be translated by.
All distances must be numbers---the units are pixels. For example, the
following translation would move the element 200 pixels to the right and 100
pixels upwards.

~~~{.JavaScript}
Firmin.translate(el, {
    x: 200,
    y: -100
});
~~~

Any of the three axis arguments may be omitted.

<h3 id="api-translate3d">translate3d</h3>

`translate3d` is an alias for `translate`, with the same interface and
functionality.

<h3 id="api-translate-variants">translateX, translateY, translateZ</h3>

`Firmin.translateX(element, distance, [duration], [callback])`

The _distance_ of the translation must be a number, representing the number of
pixels the element is to be translated by along the relevant axis. E.g.,
shifting it 50 pixels downwards would be accomplished by:

~~~{.JavaScript}
Firmin.translateY(el, 50);
~~~


Scaling functions
-----------------

<h3 id="api-scale">scale</h3>
    
`Firmin.scale(element, magnitudes, [duration], [callback])`

The _magnitudes_ object can have three properties: the `x` (horizontal), `y`
(vertical) and `z` (depth) values which the element is to be scaled by. Changes
of scale are pure magnitudes; they have no units. As such, they should be
positive numbers. For example, to scale an element to twice its width and
two-thirds of its height:

~~~{.JavaScript}
Firmin.scale(el, {
    x: 2,
    y: 2/3
});
~~~

<h3 id="api-scale3d">scale3d</h3>

`scale3d` is an alias for `scale`, with the same interface and
functionality.

<h3 id="api-scale-variants">scaleX, scaleY, scaleZ</h3>

`Firmin.scaleX(element, magnitude, [duration], [callback])`

The _magnitude_ by which the element should be scaled by must be a positive
number. To scale an element to four times its depth:

~~~{.JavaScript}
Firmin.scaleZ(el, 4);
~~~


Rotation functions
------------------

<h3 id="api-rotate">rotate</h3>

`Firmin.rotate(element, angle, [duration], [callback])`

The _angle_ by which the element will be rotated can be specified as a string,
in which case it will be parsed as [an angle][angle], or as a number, in which
case it is assumed that the angle is given in degrees.

The `rotate` function will rotate an element by the given angle in the plane of
the web page, i.e. about the _Z_ axis.

<h3 id="api-rotate3d">rotate3d</h3>

`Firmin.rotate3d(element, description, [duration], [callback])`

The _description_ object should contain four properties: `x`, `y` and `z`
values, and an `angle` value specifying the angle through which the element
should be rotated. The `x`, `y` and `z` properties should be given as numbers:
taken together, they are interpreted as a vector about which the element is to
be rotated. The `angle` property should be a [string or number][angle]
specifying a CSS angle.

In this example, the element would be rotated about the vector (0.25, 0.5,
0.75) by 1 radian.

~~~{.JavaScript}
Firmin.rotate3d(el, {
    x:     0.25,
    y:     0.5,
    z:     0.75,
    angle: "1rad"
});
~~~

If any of the directional properties are not given, they will be assigned the
value 0. In the following example, the element would be rotated 60&deg; about
the vector (0.5, 0, 0.3).

~~~{.JavaScript}
Firmin.rotate3d(el, {
    x:     0.5,
    z:     0.3,
    angle: 60
});
~~~

<h3 id="api-rotate-variants">rotateX, rotateY, rotateZ</h3>

`Firmin.rotateX(element, angle, [duration], [callback])`

These functions rotate the element about the given axis rather than an
arbitrary vector, as the `rotate3d` function does. The _angle_ should be given
as a [string or a number][angle].

[angle]: /#angles


Skew functions
--------------

<h3 id="api-skew">skew</h3>

`Firmin.skew(element, angles, [duration], [callback])`

A [skew transformation] along the X and Y axes is specified via an _angles_
object with two properties: the `x` and `y` angles by which the element will
be skewed. These should be given as [angles or numbers][angle]. Either of these
properties may be omitted and will in that case just be set to 0.

~~~{.JavaScript}
Firmin.skew(el, {
    x: "20deg",
    y: "1rad"
});
~~~

[skew transformation]: http://www.quantdec.com/GIS/affine.htm#skew

<h3 id="api-skew-variants">skewX, skewY</h3>

`Firmin.skewX(element, angle, [duration], [callback])`

The _angle_ by which the element will be skewed should be an [angle or a
number][angle]. Note that HTML elements are two-dimensional, and so there is no
`skewZ` function as it would not make sense to skew an HTML element along the
_Z_ axis.

In this example, the element would be skewed by 30&deg; along the _Y_ axis.

~~~{.JavaScript}
Firmin.skewY(el, "30deg");
~~~

Matrix functions
----------------

<h3 id="api-matrix">matrix</h3>

`Firmin.matrix(element, vector, [duration], [callback])`

The _vector_ supplied expresses a two-dimensional [transformation matrix]. It
should have either _6_ or _16_ elements, depending on whether one wishes to
specify a 2D or a 3D transformation.

2D transformations are represented by 3x3 matrices, but as only 6 values of the
matrix are needed to compute the transformation, it can be represented as a
6-element vector.

~~~{.JavaScript}
Firmin.matrix(element, [3, 1, 0, 2, 1, 1]);
~~~

3D transformations are represented by 4x4 matrices, and in this case all 16
values must be specified, as below. In both cases all values must be numbers;
they are interpreted internally as representing either distances in pixels or
angles in degrees.

~~~{.JavaScript}
Firmin.matrix(element, [
    -0.5, 0.6, -0.7, 0,
    -0.7, 0.3, 0.7,  0,
    0.6,  0.7, 0.2,  0,
    0,    0,   0,    1
]);
~~~

All other transformations can be represented in terms of a transformation
matrix---this is what the library does internally. The `matrix` function can be
useful when generating animations programmatically, but any transformation
definable using this function can be described more perspicuously with either
the named transform functions or a judicious use of `animate`.

[transformation matrix]: http://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined

<h3 id="api-matrix3d">matrix3d</h3>

`matrix3d` is an alias for `matrix`, with the same interface and functionality.
