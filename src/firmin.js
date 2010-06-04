/*

Firmin, a JavaScript animation library using CSS transforms and transitions.

Documentation:  http://extralogical.net/projects/firmin
GitHub project: http://github.com/ionfish/firmin

<%= license %>
*/

var Firmin = {};

/*

Currently, several browsers support (to varying degrees) the CSS transform and
transition functionality which Firmin is based upon. However, they each use
vendor-specific prefixes for the various CSS properties involved. Consequently,
for Firmin to work on these different browsers it must detect which of these
prefixes is in use.

*/

Firmin.prefix = (function() {
    var test     = document.createElement("div"),
        prefixes = ["o", "moz", "webkit"],
        prefix, i;
    
    for (i = 0; i < 3; i++) {
        prefix = prefixes[i];
        test.style.cssText = "-" + prefix + "-transition-property: opacity;";
        if (prefix === "moz") prefix = "Moz";
        if (typeof test.style[prefix + "TransitionProperty"] !== "undefined") return prefix;
    }
})();

Firmin.CTM = function(vector) {
    var i, c;
    
    this.vector = [1, 0, 0, 1, 0, 0];
    
    if (typeof vector === "object") {
        for (i = 0; i < 6; i++) {
            this.vector[i] = typeof (c = vector[i]) === "number" ? c : this.vector[i];
        }
    }
};

Firmin.CTM.KEYS = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5};

Firmin.CTM.prototype.get = function(index) {
    return this.vector[typeof index === "string" ? Firmin.CTM.KEYS[index] : index];
};

Firmin.CTM.prototype.multiply = function(t) {
    var n = new Array(6), c = this.vector;

    n[0] = c[0] * t[0] + c[2] * t[1];        // M11 | Last term = x * 0
    n[1] = c[1] * t[0] + c[3] * t[1];        // M21 | Last term = x * 0
                                             // M31 | Always 0
    n[2] = c[0] * t[2] + c[2] * t[3];        // M12 | Last term = x * 0
    n[3] = c[1] * t[2] + c[3] * t[3];        // M22 | Last term = x * 0
                                             // M32 | Always 0
    n[4] = c[0] * t[4] + c[2] * t[5] + c[4]; // M13 | Last term = x * 1
    n[5] = c[1] * t[4] + c[3] * t[5] + c[5]; // M23 | Last term = x * 1
                                             // M33 | Always 1

    this.vector = n;
};

Firmin.CTM.prototype.build = function() {
    return "matrix(" + this.vector.join(",") + ")";
};

/*

Instances of Firmin.Transform represent CSS transforms to be applied to a
given DOM element. As well as encapsulating a transformation matrix, they also
contain the transform origin, and methods for translating API methods such as
translate and rotate to lower-level matrix methods.

Transform objects have methods corresponding to all the CSS 2D transform
functions; this list is also used to add generate higher-level wrapper
functions and methods that wrap the more general animation functionality.

*/

Firmin.Transform = function(vector, origin) {
    this.ctm    = new Firmin.CTM(vector);
    this.centre = Firmin.pointToVector(origin) || ["50%", "50%"];
};

Firmin.Transform.methods = [
    "translate", "translateX", "translateY",
    "scale", "scaleX", "scaleY",
    "rotate",
    "skew", "skewX", "skewY",
    "matrix"
];

/*

The Firmin.Transform.parse method follows the standard Firmin animation
description-parsing API. It accepts a description object and a context
(generally the previous animation applied), and returns an object with two
properties: the result (a Transform object, or null) and the remainder (an
object containing any unparsed properties of the description, to be passed to
other parsers).

The resultant Transform object wraps a transformation matrix formed by
cumulatively applying the transform options in the description to either the
identity matrix, or the transformation matrix given by the context's transform
property. This feature is what enables stateful transforms, as otherwise
applying a new transform to an element would simply overwrite its previous
state with the new state.

*/

Firmin.Transform.parse = function(description, context) {
    var methods   = Firmin.Transform.methods,
        rest      = {},
        transform = null,
        vector, origin;
    
    if (context.transform) {
        vector    = context.transform.toVector();
        origin    = context.transform.getOrigin();
        transform = new Firmin.Transform(vector, origin);
    }
    
    for (property in description) {
        if (methods.indexOf(property) !== -1) {
            transform = transform || new Firmin.Transform();
            transform[property](description[property]);
        } else if (property === "origin") {
            transform = transform || new Firmin.Transform();
            transform[property](description[property]);
        } else {
            rest[property] = description[property];
        }
    }
    
    return {result: transform, remainder: rest};
};

Firmin.Transform.prototype.matrix = function(vector) {
    this.ctm.multiply(vector);
};

Firmin.Transform.prototype.toVector = function() {
    return this.ctm.vector;
};

Firmin.Transform.prototype.getOrigin = function() {
    return this.centre.join(" ");
};

Firmin.Transform.prototype.build = function(properties) {
    properties = properties || {};
    
    properties[Firmin.prefix + "Transform"]       = this.ctm.build();
    properties[Firmin.prefix + "TransformOrigin"] = this.getOrigin();
    
    return properties;
};

Firmin.Transform.prototype.translate = function(distances) {
    var vector, x, y;
    
    if (typeof distances === "number" || typeof distances === "string") {
        x = y = distances;
    } else {
        vector = Firmin.pointToVector(distances);
        x      = vector[0];
        y      = vector[1];
        
        if (typeof x !== "number") x = parseInt(x, 10) || 0;
        if (typeof y !== "number") y = parseInt(y, 10) || 0;
    }
    
    this.matrix([1, 0, 0, 1, x, y]);
};

Firmin.Transform.prototype.translateX = function(distance) {
    this.translate([distance, 0]);
};

Firmin.Transform.prototype.translateY = function(distance) {
    this.translate([0, distance]);
};

Firmin.Transform.prototype.scale = function(magnitudes) {
    var vector, x, y;
    
    if (typeof magnitudes === "number") {
        x = y = magnitudes;
    } else {
        vector = Firmin.pointToVector(magnitudes);
        x      = vector[0];
        y      = vector[1];
        
        if (typeof x !== "number") x = 1;
        if (typeof y !== "number") y = 1;
    }
    
    this.matrix([x, 0, 0, y, 0, 0]);
};

Firmin.Transform.prototype.scaleX = function(magnitude) {
    this.scale([magnitude, 1]);
};

Firmin.Transform.prototype.scaleY = function(magnitude) {
    this.scale([1, magnitude]);
};

Firmin.Transform.prototype.skew = function(magnitudes) {
    var parseAngle = Firmin.Parser.parseAngle,
        angle2rads = Firmin.angleToRadians,
        vector, x, y;
    
    if (typeof magnitudes === "number" || typeof magnitudes === "string") {
        x = y = angle2rads.apply(null, parseAngle(magnitudes));
    } else {
        vector = Firmin.pointToVector(magnitudes);
        x      = angle2rads.apply(null, parseAngle(vector[0])) || 0;
        y      = angle2rads.apply(null, parseAngle(vector[1])) || 0;
    }
    
    this.matrix([
        1,
        Math.tan(y),
        Math.tan(x),
        1,
        0,
        0
    ]);
};

Firmin.Transform.prototype.skewX = function(magnitude) {
    this.skew([magnitude, 0]);
};

Firmin.Transform.prototype.skewY = function(magnitude) {
    this.skew([0, magnitude]);
};

Firmin.Transform.prototype.rotate = function(angle) {
    angle = Firmin.angleToRadians.apply(null, Firmin.Parser.parseAngle(angle));
    
    this.matrix([
        Math.cos(angle),
        Math.sin(angle),
        -Math.sin(angle),
        Math.cos(angle),
        0,
        0
    ]);
};

Firmin.Transform.prototype.origin = function(origin) {
    var vector = Firmin.pointToVector(origin);
    
    if (vector[0]) this.centre[0] = vector[0];
    if (vector[1]) this.centre[1] = vector[1];
};

/*

CSS transitions are the basic mechanism behind animation in Firmin, and
Firmin.Transition objects encapsulate specific CSS transition properties. As
well as those properties, Transition objects feature various utility methods
allowing other objects to alter their behaviour based on the state of the
Transition object they are concerned with.

For example, if the duration of a Transition is 0, any animation using that
Transition should execute immediately and then trigger the next state directly,
as at least in WebKit-based browsers, the transitionEnd event is not triggered
when the transition duration is 0.

*/

Firmin.Transition = function() {
    this.properties     = ["all"];
    this.duration       = ["s", 0];
    this.delay          = ["s", 0];
    this.timingFunction = "ease";
};

Firmin.Transition.methods = [
    "properties",
    "timingFunction",
    "duration",
    "delay"
];

Firmin.Transition.parse = function(description, context) {
    var methods    = Firmin.Transition.methods,
        rest       = {},
        transition = new Firmin.Transition(),
        duration, delay;
    
    for (p in description) {
        if (methods.indexOf(p) !== -1) {
            if (p === "properties" && typeof p === "string") {
                transition[p] = [description[p]];
            } else if (p === "timingFunction" && typeof description[p] !== "string") {
                transition[p] = "cubic-bezier(" + description[p].join(",") + ")";
            } else if (p === "duration") {
                duration = Firmin.Parser.parseTime(description[p]);
                if (duration) { transition[p] = duration; }
            } else if (p === "delay") {
                delay = Firmin.Parser.parseTime(description[p]);
                if (delay) { transition[p] = delay; }
            } else {
                transition[p] = description[p];
            }
        } else {
            rest[p] = description[p];
        }
    }
    
    return {result: transition, remainder: rest};
};

Firmin.Transition.prototype.hasDuration = function() {
    return this.duration[1] !== 0;
};

Firmin.Transition.prototype.getDuration = function() {
    var duration = this.duration;
    return duration[1] === 0 ? 0 : duration.reverse().join("");
};

Firmin.Transition.prototype.hasDelay = function() {
    return this.delay[1] !== 0;
};

Firmin.Transition.prototype.getDelay = function() {
    var delay = this.delay;
    return delay[1] === 0 ? 0 : duration.reverse().join("");
};

Firmin.Transition.prototype.build = function(properties) {
    properties = properties || {};
    
    if (typeof this.properties === "string") {
        properties[Firmin.prefix + "TransitionProperty"] = this.properties;
    } else {
        properties[Firmin.prefix + "TransitionProperty"] = this.properties.join(", ");
    }
    
    properties[Firmin.prefix + "TransitionDuration"] = this.getDuration();
    properties[Firmin.prefix + "TransitionDelay"]    = this.getDelay();
    
    if (this.timingFunction) {
        properties[Firmin.prefix + "TransitionTimingFunction"] = this.timingFunction;
    }
    
    return properties;
};

Firmin.Animation = function(description, context) {
    var tsp, trp;
    
    tsp = Firmin.Transition.parse(description, context);
    this.transition = tsp.result;
    
    trp = Firmin.Transform.parse(tsp.remainder, context);
    this.transform  = trp.result;
    
    this.style = trp.remainder;
};

Firmin.Animation.prototype.hasDuration = function() {
    return this.transition && this.transition.hasDuration();
};

Firmin.Animation.prototype.exec = function(element) {
    var properties = this.style, property;
    
    if (this.transition) properties = this.transition.build(properties);
    if (this.transform)  properties = this.transform.build(properties);
    
    for (property in properties) {
        element.style[property] = properties[property];
    }
};

Firmin.Animated = function(element) {
    var self = this;
    
    this.element    = element;
    this.operations = [];
    this.index      = 0;
    
    this.element.addEventListener(Firmin.prefix + "TransitionEnd", function() {
        if (self.index < self.operations.length) {
            self.run();
        }
    }, false);
};

Firmin.Animated.prototype.run = function() {
    var animation = this.operations[this.index++],
        next      = this.operations[this.index],
        self      = this;
    
    animation.exec(this.element);
    
    if (next && !animation.hasDuration()) {
        setTimeout(function() {
            self.run();
        }, 1);
    }
    
    return this;
};

Firmin.Animated.prototype.animate = function(description, duration) {
    var previous = this.operations[this.operations.length - 1] || {};
    
    if (["string", "number"].indexOf(typeof description.duration) === -1) {
        description.duration = duration;
    }
    
    this.operations.push(new Firmin.Animation(description, previous));
    
    return this;
};

Firmin.animate = function(el, description, duration) {
    var animated = new Firmin.Animated(el);
    
    if (["string", "number"].indexOf(typeof description.duration) === -1) {
        description.duration = duration;
    }
    
    animated.animate(description);
    
    return animated.run();
};

/*

Animation function aliases

*/

Firmin.Transform.methods.forEach(function(method) {
    Firmin[method] = function(el, value, duration) {
        var description = {};
        description[method] = value;
        return Firmin.animate(el, description, duration);
    };
    
    Firmin.Animated.prototype[method] = function(value, duration) {
        var description = {};
        description[method] = value;
        return this.animate(description, duration);
    };
});

/*

CSS data type parsing

There are numerous CSS data types. We are mainly interested in the various
numeric types, generally consisting of a magnitude plus a unit (e.g. 45deg or
50%), but there are a few functions which allow or require a keyword instead.

The parsers implemented below all have a common pattern: they accept a string
(or, if the type can be numeric and has a default unit, a number) and return a
pair consisting of the unit and the magnitude (or null, if the input was not of
the expected format).

One major limitation, albeit not with the parsing library itself, is that there
is currently no straightforward way to convert between length units. Users of
this library must use pixels, rather than being able to use any length unit
they like and relying on the library to perform an internal conversion to
pixels. This limits the usefulness of the parsing library, essentially to
angles and times.

*/

Firmin.Parser = {};

Firmin.Parser.NUMBER_PATTERN = /^-?\d+(\.\d+)?/;

Firmin.Parser.parseNumeric = function(units, def) {
    return function(input) {
        var unit, magnitude;
        
        if (typeof input === "number") {
            return [def, input];
        } else if (typeof input !== "string") {
            return null;
        }
        
        magnitude = (input.match(Firmin.Parser.NUMBER_PATTERN) || [""])[0];
        
        if (magnitude.length === input.length) {
            unit = def;
        } else {
            unit = units.filter(function(u) {
                return input.substr(magnitude.length) === u;
            })[0];
        }
        
        return unit && magnitude ? [unit, parseFloat(magnitude)] : null;
    };
};

Firmin.Parser.parseAngle = Firmin.Parser.parseNumeric(["deg", "grad", "rad", "turn"], "deg");
Firmin.Parser.parseTime  = Firmin.Parser.parseNumeric(["s", "ms"], "s");

/*

Angular conversion

The transform operations assume that angles are given in radians. However,
there are several other valid CSS angle types: degrees, grads and turns.
We therefore need code to, at a minimum, convert values of all these types to
values in radians.

*/

Firmin.angleToRadians = function(type, magnitude) {
    var ratio;
    
    switch (type) {
        case "rad"  : return magnitude;
        case "deg"  : ratio = Math.PI / 180; break;
        case "grad" : ratio = Math.PI / 200; break;
        case "turn" : ratio = Math.PI * 2;   break;
    }
    
    return ratio * magnitude;
};

/*

Point to vector conversion

Points are used as a convenient and meaningful way for users to specify
origins, translations etc., but a vector is a more convenient internal format,
so in general points are converted to vectors on the way in.

*/

Firmin.pointToVector = function(point) {
    if (!point) return null;
    
    return point instanceof Array ? point : [point.x, point.y, point.z];
};
