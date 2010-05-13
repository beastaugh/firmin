Firmin = {};

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

Firmin.Transform = function() {
    this.ctm    = new Firmin.CTM();
    this.centre = {x: "50%", y: "50%"};
    
    return this;
};

Firmin.Transform.OPERATION_PATTERN = /((translate|scale|skew)(X|Y)?)|(rotate|matrix|origin)/;

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
        case "rad":  return magnitude;
        case "deg":  ratio = Math.PI / 180; break;
        case "grad": ratio = Math.PI / 200; break;
        case "turn": ratio = Math.PI * 2;   break;
    }
    
    return ratio * magnitude;
};

/*

Transform.create is a factory method that allows a new Transform
to be created with any of the available operations, rather than adding
them one by one.

    var t = Firmin.Transform.create({
        scale:     {x: 2,   y: 1.5},
        translate: {x: 150, y: 450},
    });

*/

Firmin.Transform.create = function(transforms) {
    var transform = new Firmin.Transform(),
        type;
    
    for (type in transforms) {
        if (type.match(Firmin.Transform.OPERATION_PATTERN)) {
            transform[type](transforms[type]);
        }
    }
    
    return transform;
};

Firmin.Transform.prototype.matrix = function(vector) {
    this.ctm.multiply(vector);
};

Firmin.Transform.prototype.getOrigin = function() {
    return this.centre.x + " " + this.centre.y;
};

Firmin.Transform.prototype.build = function() {
    return this.ctm.build();
};

Firmin.Transform.prototype.translate = function(distances) {
    var x, y;
    
    if (typeof distances === "number" || typeof distances === "string") {
        x = distances;
        y = distances;
    } else {
        x = distances.x;
        y = distances.y;
        
        if (typeof x !== "number") x = parseInt(x) || 0;
        if (typeof y !== "number") y = parseInt(y) || 0;
    }
    
    this.matrix([1, 0, 0, 1, x, y]);
};

Firmin.Transform.prototype.translateX = function(distance) {
    this.translate({x: distance});
};

Firmin.Transform.prototype.translateY = function(distance) {
    this.translate({y: distance});
};

Firmin.Transform.prototype.scale = function(magnitudes) {
    var x, y;
    
    if (typeof magnitudes === "number") {
        x = magnitudes;
        y = magnitudes;
    } else {
        x = magnitudes.x;
        y = magnitudes.y;
        
        if (typeof x !== "number") x = 1;
        if (typeof y !== "number") y = 1;
    }
    
    this.matrix([x, 0, 0, y, 0, 0]);
};

Firmin.Transform.prototype.scaleX = function(magnitude) {
    this.scale({x: magnitude});
};

Firmin.Transform.prototype.scaleY = function(magnitude) {
    this.scale({y: magnitude});
};

Firmin.Transform.prototype.skew = function(magnitudes) {
    var parseAngle = Firmin.Parser.parseAngle,
        angle2rads = Firmin.angleToRadians,
        x = 0, y = 0;
    
    if (typeof magnitudes.x === "number" || typeof magnitudes.x === "string") {
        x = angle2rads.apply(null, parseAngle(magnitudes.x));
    }
    
    if (typeof magnitudes.y === "number" || typeof magnitudes.y === "string") {
        y = angle2rads.apply(null, parseAngle(magnitudes.y));
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
    this.skew({x: magnitude});
};

Firmin.Transform.prototype.skewY = function(magnitude) {
    this.skew({y: magnitude});
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
    if (origin.x) this.centre.x = origin.x;
    if (origin.y) this.centre.y = origin.y;
};

/*

Transforms can be composed with transitions to produce animation.
Transitions have much the same API as Transforms.

*/

Firmin.Transition = function() {
    this.properties     = ["all"];
    this.duration       = 0;
    this.delay          = 0;
    this.timingFunction = null;
    this.transform      = null;
    this.opacity        = null;
    
    return this;
};

Firmin.Transition.prototype.build = function() {
    var properties = {
        webkitTransitionProperty: this.properties.join(", "),
        webkitTransitionDuration: this.duration,
        webkitTransitionDelay:    this.delay
    };
    
    if (this.timingFunction) {
        properties.webkitTransitionTimingFunction = this.timingFunction;
    }
    
    if (this.opacity) {
        properties.opacity = this.opacity;
    }
    
    if (this.transform) {
        properties.webkitTransform       = this.transform.build();
        properties.webkitTransformOrigin = this.transform.getOrigin();
    }
    
    return properties;
};

Firmin.Transition.prototype.exec = function(el) {
    var style = this.build(),
        prop;
    
    for (prop in style) {
        el.style[prop] = style[prop];
    }
    
    return el;
};

Firmin.animate = function(el, transformation, duration) {
    var transition = new Firmin.Transition(), time;
    
    transition.transform = Firmin.Transform.create(transformation);
    
    if (typeof duration === "number" || typeof duration === "string") {
        time = Firmin.Parser.parseTime(duration);
    } else {
        time = ["s", transition.duration];
    }
    
    if (time[1] < 0) {
        time[1] = 0;
    }
    
    transition.duration = time[1] + time[0];
    
    transition.exec(el);
};

Firmin.methods = [
    "translate", "translateX", "translateY",
    "scale", "scaleX", "scaleY",
    "skew", "skewX", "skewY",
    "rotate",
    "matrix"
];

Firmin.methods.forEach(function(method) {
    Firmin[method] = function(el, value, duration) {
        var transform = {};
        transform[method] = value;
        Firmin.animate(el, transform, duration);
    };
});

/*

CSS data types

There are numerous CSS data types. We are mainly interested in the various
numeric types, generally consisting of a magnitude plus a unit (e.g. 45deg or
50%), but there are a few functions which allow or require a keyword instead.

The various parsers implemented below all have a common pattern: they accept
a string (or, if the type can be numeric and has a default unit, a number) and
return a pair consisting of the unit and the magnitude.

Current shortcomings of the parser library include:

- An error is incorrectly thrown if a unit string is a subset of another valid
  unit string for that data type.
- Compositional operations are limited to choice. There is no way to apply one
  parser and then another, based on the result of the first. CSS data types
  lend themselves particularly well to this style, so it should be better
  supported.

Another major issue, albeit not with the parsing library itself, is that there
is currently no straightforward way to convert between length units; users of
the library must use pixels, rather than being able to use any length unit
they like and relying on the library to perform an internal conversion to
pixels. This limits the usefulness of the parsing library, essentially to
angles and times.

*/

Firmin.Parser = {};

Firmin.Parser.NUMBER_PATTERN = /^-?\d+(\.\d+)?$/

Firmin.Parser.parseNumeric = function(units, def) {
    return function(input) {
        var unit, magnitude;
        
        if (typeof input === "number") {
            return [def, input];
        } else if (typeof input !== "string") {
            return null;
        }
        
        unit = units.filter(function(u) {
            var l = input.length;
            return input.substr(l - u.length) === u;
        })[0];
        
        if (typeof unit === "undefined") {
            unit = def;
        } else {
            input = input.substr(0, input.length - unit.length);
        }
        
        magnitude = parseFloat(input);
        
        return (isNaN(magnitude) || !input.match(Firmin.Parser.NUMBER_PATTERN))
            ? null
            : [unit, magnitude];
    };
};

Firmin.Parser.parseEither = function() {
    var parsers = Array.prototype.slice.apply(arguments),
        total   = parsers.length;
    
    return function() {
        var output = null, i = 0;
        
        while (output === null && i <= total) {
            output = parsers[i++].apply(null, arguments);
        }
        
        return output;
    };
};

Firmin.Parser.parseAngle       = Firmin.Parser.parseNumeric(["deg", "grad", "rad", "turn"], "deg");
Firmin.Parser.parsePercentage  = Firmin.Parser.parseNumeric(["%"], "%");
Firmin.Parser.parseLength      = Firmin.Parser.parseNumeric(["em", "ex", "px", "gd", "rem", "vw", "vh", "ch", "in", "cm", "mm", "pt", "pc"], "px");
Firmin.Parser.parseTime        = Firmin.Parser.parseNumeric(["ms", "s"], "s");
Firmin.Parser.parseTranslation = Firmin.Parser.parseEither(Firmin.Parser.parsePercentage, Firmin.Parser.parseLength);
