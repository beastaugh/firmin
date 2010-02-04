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
            skew:      [0, 0],
            rotate:    [0]
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
            name = 'firmin' + hash,
            rule = transforms[hash];
        
        if (!rule) {
            rule = this.build();
            transforms[hash] = rule;
            
            style.addRule('.' + name, rule);
        }
        
        return name;
    };
    
    EXT.Transform.prototype.exec = function(el) {
        var className    = el.className.replace(/\s*firmin[a-f0-9]+\s*/, ''),
            tranformName = this.save();
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + tranformName;
        
        return el;
    };
    
    EXT.Transform.prototype.translate = function(distances) {
        var x = distances.x,
            y = distances.y,
            a, b;
        
        if (this.operations['translate']) {
            a = this.operations['translate'].x || 0;
            b = this.operations['translate'].y || 0;
        } else {
            a = 0;
            b = 0;
        }
        
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
        var a, b;
        
        if (this.operations['scale']) {
            a = this.operations['scale'].x || 1;
            b = this.operations['scale'].y || 1;
        } else {
            a = 1;
            b = 1;
        }
        
        this.operations['scale'] = [magnitudes.x || a, magnitudes.y || b];
    };
    
    EXT.Transform.prototype.scaleX = function(magnitude) {
        this.scale({x: magnitude});
    };
    
    EXT.Transform.prototype.scaleY = function(magnitude) {
        this.scale({y: magnitude});
    };
    
    EXT.transform = function(el, transformation) {
        var transform = EXT.Transform.create(transformation);
        transform.exec(el);
    };
    
    return EXT;
})();
