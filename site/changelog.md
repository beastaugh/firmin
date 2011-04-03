---
title: Firmin development history
---

Development history
===================

The bulk of Firmin's initial development was done in the summer of 2010, but
version 1.0 wasn't released until April 2011.


Version 1.0.0
-------------

Released 4th April 2011.

* First full release.
* Documented the source code with PDoc.
* Updated the website with documentation for the 3D and relative transform
  functions.
* Made the internal transform representation conform to the CSSMatrix
  interface.


Version 0.1.4
-------------

Released 10th July 2010.

* Added support for 3D transforms.
* Transform are now represented internally as 4x4 matrices.
* The `matrix3d` transform function is now used where supported.
* Removed `Firmin.TransformMatrix`.
* Removed outdated benchmarks.
* Documented order of operations issues.


Version 0.1.3
-------------

Released 8th July 2010.

* References to old animations are now deleted so they can be garbage
  collected.
* Added a set of regression tests for transforms.
* Added basic transform support for Opera.
* Added basic transform support for Firefox.


Version 0.1.2
-------------

Released 21st June 2010.

* Made absolute transformations the default.
* Added separate relative animation functions with R-postfixed names.
* A separate reference to the next callback to be fired is now stored.


Version 0.1.1
-------------

Released 9th June 2010.

* Added callbacks to animation methods.
* Vectors are now used instead of point objects to represent points and
  transformations internally, but point objects can still be used at the API
  level.
* Added better inline documentation for core objects and functions.
* Renamed `Firmin.CTM` to `Firmin.TransformMatrix`.
* Removed unused accessor method for elements of `Firmin.TransformMatrix`.


Version 0.1.0
-------------

Released 1st June 2010.

* Initial release. Features chained animations using CSS transitions and
  transforms. Currently for WebKit browsers only.
