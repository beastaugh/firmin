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
* Document the source code with PDoc.
* Update the website with documentation for the 3D and relative transform
  functions.
* Make the internal transform representation conform to the CSSMatrix
  interface.


Version 0.1.4
-------------

Released 10th July 2010.

* Add support for 3D transforms.
* Represent transforms internally as 4x4 matrices.
* Use the matrix3d transform function where supported.
* Remove Firmin.TransformMatrix.
* Remove outdated benchmarks.
* Document order of operations issues.


Version 0.1.3
-------------

Released 8th July 2010.

* Delete references to old animations so they can be garbage collected.
* Add a set of regression tests for transforms.
* Add basic transform support for Opera.
* Add basic transform support for Firefox.


Version 0.1.2
-------------

Released 21st June 2010.

* Make absolute transformations the default.
* Add separate relative animation functions with R-postfixed names.
* Store a separate reference to the next callback to be fired.


Version 0.1.1
-------------

Released 9th June 2010.

* Add callbacks to animation methods.
* Use vectors instead of point objects to represent points and transformations
  internally, but continue to allow point objects to be used at the API level.
* Better inline documentation for core objects and functions.
* Rename Firmin.CTM to Firmin.TransformMatrix.
* Remove unused accessor method for elements of Firmin.TransformMatrix.


Version 0.1.0
-------------

Released 1st June 2010.

* Initial release. Features chained animations using CSS transitions and
  transforms. Currently for WebKit browsers only.
