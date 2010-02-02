Firmin = (function() {
    var API = {}, transforms = {}, hashCount = 0,
    
    style = (function() {
        var head = document.getElementsByTagName('head')[0],
            tag  = document.createElement('style');
        
        tag.setAttribute('type', 'text/css');
        head.appendChild(tag);
        
        return document.styleSheets[document.styleSheets.length - 1];
    })(),
    
    save = function(name, declarations) {
        transforms[name] = declarations;
        style.addRule('.' + name, declarations);
    },
    
    buildRule = function(type) {
        var prefix = '-webkit-transform:',
            values = Array.prototype.slice.call(arguments, 1),
            rule   = '',
            current;
        
        for (var i = 0, len = values.length; i < len; i++) {
            current = values[i];
            
            if (i !== 0) {
                rule += ','
            }
            
            rule += current;
        }
        
        return prefix + type + '(' + rule + ');';
    },
    
    hash = function(str) {
        hashCount += 1;
        return 'firmin' + hashCount;
    },
    
    __transform__ = function(type, el, transform) {
        var rule = buildRule(type, transform.x, transform.y),
            ref  = hash(rule),
            name = el.className.replace(/\s*firmin\d+\s*/, '');
        
        save(ref, rule);
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + ref;
        
        return el;
    };
    
    API.translate = function(el, transform) {
        var x = transform.x || 0,
            y = transform.y || 0;
        
        if (typeof x === 'number' && x !== 0) {
            x += 'px';
        }
        
        if (typeof y === 'number' && y !== 0) {
            y += 'px';
        }
        
        transform.x = x;
        transform.y = y;
        
        return __transform__('translate', el, transform);
    };
    
    API.translateX = function(el, dist) {
        return API.translate(el, {x: dist});
    };
    
    API.translateY = function(el, dist) {
        return API.translate(el, {y: dist});
    };
    
    API.scale =  function(el, transform) {
        if (!transform.x) {
            transform.x = 1;
        }
        
        if (!transform.y) {
            transform.y = 1;
        }
        
        return __transform__('scale', el, transform);
    };
    
    API.scaleX = function(el, dist) {
        return API.scale(el, {x: dist});
    };
    
    API.scaleY = function(el, dist) {
        return API.scale(el, {y: dist});
    };

    return API;
})();
