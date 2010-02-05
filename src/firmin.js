Firmin = (function() {
    var EXT        = {},
        transforms = {},
    
    style = (function() {
        var head = document.getElementsByTagName("head")[0],
            tag  = document.createElement("style");
        
        tag.setAttribute("type", "text/css");
        head.appendChild(tag);
        
        return document.styleSheets[document.styleSheets.length - 1];
    })();
    
    // Transforms are the basic building blocks of Firmin.
    EXT.Transform = function() {
        this.operations = {
            translate: [0, 0],
            scale:     [1, 1],
            skew:      ['0deg', '0deg'],
            rotate:    ['0deg'],
            matrix:    [1, 0, 0, 1, 0, 0]
        };
        
        return this;
    };
    
    EXT.Transform.OPERATION_PATTERN = /((translate|scale|skew)(X|Y)?)|(rotate|matrix)/;
    
    // Firmin.Transform.create is a factory method that allows a new Transform
    // to be created with any of the available operations, rather than adding
    // them one by one.
    //
    //         var t = Firmin.Transform.create({
    //             scale:     {x: 2,   y: 1.5},
    //             translate: {x: 150, y: 450},
    //         });
    //
    EXT.Transform.create = function(transforms) {
        var transform = new EXT.Transform(),
            type;
        
        for (type in transforms) {
            if (type.match(EXT.Transform.OPERATION_PATTERN)) {
                transform[type](transforms[type]);
            }
        }
        
        return transform;
    };
    
    EXT.Transform.prototype.hash = function() {
        var hash = "", type;
        
        for (type in this.operations) {
            hash += "-" + this.operations[type].join("-").replace(/[^\w]/g, "_");
        }
        
        return hash;
    };
    
    EXT.Transform.prototype.build = function() {
        var prefix = "-webkit-transform:",
            rule   = "",
            type;
        
        for (type in this.operations) {
            rule += " " + type + "(" + this.operations[type].join(", ") + ")";
        }
        
        return prefix + rule + ";";
    };
    
    EXT.Transform.prototype.save = function() {
        var hash = this.hash(),
            name = 'firmin-transform-' + hash,
            rule = transforms[hash];
        
        if (!rule) {
            rule = this.build();
            transforms[hash] = rule;
            
            style.addRule('.' + name, rule);
        }
        
        return name;
    };
    
    EXT.Transform.prototype.exec = function(el) {
        var className    = el.className.replace(/\s*firmin-transform-[a-f0-9]+\s*/, ''),
            tranformName = this.save();
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + tranformName;
        
        return el;
    };
    
    EXT.Transform.prototype.translate = function(distances) {
        var x = distances.x,
            y = distances.y,
            a = this.operations['translate'][0],
            b = this.operations['translate'][1];
        
        if (typeof x === 'number' && x !== 0) {
            x += 'px';
        }
        
        if (typeof y === 'number' && y !== 0) {
            y += 'px';
        }
        
        this.operations['translate'] = [x || a, y || b];
    };
    
    EXT.Transform.prototype.translateX = function(distance) {
        this.translate({x: distance});
    };
    
    EXT.Transform.prototype.translateY = function(distance) {
        this.translate({y: distance});
    };
    
    EXT.Transform.prototype.scale = function(magnitudes) {
        var a = this.operations['scale'][0],
            b = this.operations['scale'][1];
        
        this.operations['scale'] = [magnitudes.x || a, magnitudes.y || b];
    };
    
    EXT.Transform.prototype.scaleX = function(magnitude) {
        this.scale({x: magnitude});
    };
    
    EXT.Transform.prototype.scaleY = function(magnitude) {
        this.scale({y: magnitude});
    };
    
    EXT.Transform.prototype.skew = function(magnitudes) {
        var x = magnitudes.x,
            y = magnitudes.y,
            a = this.operations['skew'][0],
            b = this.operations['skew'][1];
        
        if (typeof x === 'number') {
            x += 'deg';
        }
        
        if (typeof y === 'number') {
            y += 'deg';
        }
        
        this.operations['skew'] = [x || a, y || b];
    };
    
    EXT.Transform.prototype.skewX = function(magnitude) {
        this.skew({x: magnitude});
    };
    
    EXT.Transform.prototype.skewY = function(magnitude) {
        this.skew({y: magnitude});
    };
    
    EXT.Transform.prototype.rotate = function(angle) {
        if (typeof angle === 'number') {
            angle += 'deg';
        }
        
        this.operations['rotate'] = [angle];
    };
    
    EXT.Transform.prototype.matrix = function(vector) {
        this.operations['matrix'] = vector;
    };
    
    // The Firmin.transform function is the primary public API for using
    // transforms by themselves, e.g. without transitions.
    EXT.transform = function(el, transformation) {
        var transform = EXT.Transform.create(transformation);
        transform.exec(el);
    };
    
    // Transforms can be composed with transitions to produce animation.
    // Transitions have much the same API as Transforms.
    EXT.Transition = function() {
        this.properties     = ['all'];
        this.duration       = 0;
        this.delay          = 0;
        this.timingFunction = null;
        
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
        
        return rules.join("; ") + ";";
    };
    
    EXT.Transition.prototype.save = function() {
        var hash = this.hash(),
            name = 'firmin-transition-' + hash,
            rule = transforms[hash];
        
        if (!rule) {
            rule = this.build();
            transforms[hash] = rule;
            
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
        var transform  = EXT.Transform.create(transformation),
            transition = new EXT.Transition();
        
        transition.duration = typeof duration === 'number'
            ? duration + "s"
            : duration;
        
        transform.exec(el);
        transition.exec(el);
    };
    
    return EXT;
})();
