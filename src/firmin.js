Firmin = (function() {
    var EXT         = {},
        transforms  = {},
        transitions = {},
    
    style = (function() {
        var head = document.getElementsByTagName("head")[0],
            tag  = document.createElement("style");
        
        tag.setAttribute("type", "text/css");
        head.appendChild(tag);
        
        return document.styleSheets[document.styleSheets.length - 1];
    })();
    
    var CTM = function(vector) {
        vector      = vector || [];
        this.vector = [1, 0, 0, 1, 0, 0];

        for (var i = 0; i < 6; i++) {
            this.vector[i] = vector[i] || this.vector[i];
        }

        return this;
    };

    CTM.KEYS = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5};

    CTM.prototype.get = function(index) {
        return this.vector[typeof index === "string" ? CTM.KEYS[index] : index];
    };

    CTM.prototype.multiply = function(t) {
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

    CTM.prototype.hash = function() {
        return this.vector.join("-").replace(/\D/g, "_");
    };

    CTM.prototype.build = function() {
        return "matrix(" + this.vector.join(",") + ")";
    };
    
    var Transform = function() {
        this.ctm    = new CTM();
        this.centre = ["50%", "50%"];
        
        return this;
    };
    
    Transform.OPERATION_PATTERN = /((translate|scale|skew)(X|Y)?)|(rotate|matrix|origin)/;
    
    Transform.DEG_TO_RAD_RATIO  = Math.PI / 180;
    
    // Firmin.Transform.create is a factory method that allows a new Transform
    // to be created with any of the available operations, rather than adding
    // them one by one.
    //
    //         var t = Firmin.Transform.create({
    //             scale:     {x: 2,   y: 1.5},
    //             translate: {x: 150, y: 450},
    //         });
    //
    Transform.create = function(transforms) {
        var transform = new Transform(),
            type;
        
        for (type in transforms) {
            if (type.match(Transform.OPERATION_PATTERN)) {
                transform[type](transforms[type]);
            }
        }
        
        return transform;
    };
    
    Transform.prototype.merge = function(vector) {
        this.ctm.multiply(vector);
    };
    
    Transform.prototype.hash = function() {
        var ctm_hash    = this.ctm.hash(),
            origin_hash = this.centre.join("-").replace(/\D/g, "_");
        
        return ctm_hash + "-" + origin_hash;
    };
    
    Transform.prototype.build = function() {
        var prefixes = ["-webkit-transform", "-moz-transform", "transform"],
            rule     = "";
        
        for (var i = 0, len = prefixes.length; i < len; i++) {
            rule += prefixes[i] + ":" + this.ctm.build() + ";";
            rule += prefixes[i] + "-origin:" + this.centre.join(" ") + ";";
        }
        
        return rule;
    };
    
    Transform.prototype.exec = function(el) {
        var className    = el.className.replace(/\s*firmin-transform-[a-f0-9]+\s*/, ''),
            tranformName = this.save();
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + tranformName;
        
        return el;
    };
    
    Transform.prototype.translate = function(distances) {
        this.merge([1, 0, 0, 1, distances.x || 0, distances.y || 0]);
    };
    
    Transform.prototype.translateX = function(distance) {
        this.translate({x: distance});
    };
    
    Transform.prototype.translateY = function(distance) {
        this.translate({y: distance});
    };
    
    Transform.prototype.scale = function(magnitudes) {
        this.merge([magnitudes.x || 1, 0, 0, magnitudes.y || 1, 0, 0]);
    };
    
    Transform.prototype.scaleX = function(magnitude) {
        this.scale({x: magnitude});
    };
    
    Transform.prototype.scaleY = function(magnitude) {
        this.scale({y: magnitude});
    };
    
    Transform.prototype.skew = function(magnitudes) {
        this.merge([
            1,
            Math.tan((magnitudes.y || 0) * Transform.DEG_TO_RAD_RATIO),
            Math.tan((magnitudes.x || 0) * Transform.DEG_TO_RAD_RATIO),
            1,
            0,
            0
        ]);
    };
    
    Transform.prototype.skewX = function(magnitude) {
        this.skew({x: magnitude});
    };
    
    Transform.prototype.skewY = function(magnitude) {
        this.skew({y: magnitude});
    };
    
    Transform.prototype.rotate = function(angle) {
        angle = angle * Transform.DEG_TO_RAD_RATIO;
        
        this.merge([
            Math.cos(angle),
            Math.sin(angle),
            -Math.sin(angle),
            Math.cos(angle),
            0,
            0
        ]);
    };
    
    Transform.prototype.matrix = Transform.prototype.merge;
    
    Transform.prototype.origin = function(origin) {
        this.centre = [origin.x || "50%", origin.y || "50%"];
    };
    
    // Transforms can be composed with transitions to produce animation.
    // Transitions have much the same API as Transforms.
    EXT.Transition = function() {
        this.properties     = ['all'];
        this.duration       = 0;
        this.delay          = 0;
        this.timingFunction = null;
        this.transform      = null;
        this.opacity        = null;
        
        return this;
    };
    
    EXT.Transition.prototype.hash = function() {
        var hash = "";
        
        hash += "ps" + this.properties.join("-");
        hash += "du" + this.duration;
        hash += "de" + this.delay;
        
        if (this.timingFunction) {
            hash += "tf" + this.timingFunction;
        }
        
        if (this.opacity) {
            hash += "op" + this.opacity;
        }
        
        if (this.transform) {
            hash += "tr" + this.transform.hash();
        }
        
        hash = hash.replace(/[^\w]/g, "_");
        return hash;
    };
    
    EXT.Transition.prototype.build = function() {
        var rules = [];
        
        rules.push("-webkit-transition-property: " + this.properties.join(", "));
        rules.push("-webkit-transition-duration: " + this.duration);
        rules.push("-webkit-transition-delay: " + this.delay);
        
        if (this.timingFunction) {
            rules.push("-webkit-transition-timing_function: " + this.timingFunction);
        }
        
        if (this.opacity) {
            rules.push("opacity: " + this.opacity);
        }
        
        if (this.transform) {
            rules.push(this.transform.build());
        }
        
        return rules.join("; ") + ";";
    };
    
    EXT.Transition.prototype.save = function() {
        var hash = this.hash(),
            name = 'firmin-transition-' + hash,
            rule = transitions[hash];
        
        if (!rule) {
            rule = this.build();
            transitions[hash] = rule;
            
            style.addRule('.' + name, rule);
        }
        
        return name;
    };
    
    EXT.Transition.prototype.exec = function(el) {
        var className    = el.className.replace(/\s*firmin-transition[a-f0-9]+\s*/, ''),
            tranformName = this.save();
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + tranformName;
        
        return el;
    };
    
    EXT.animate = function(el, transformation, duration) {
        var transition = new EXT.Transition();
        
        transition.transform = Transform.create(transformation);
        
        transition.duration = typeof duration === 'number'
            ? duration + "s"
            : duration;
        
        transition.exec(el);
    };
    
    return EXT;
})();
