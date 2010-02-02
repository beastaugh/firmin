Firmin = (function() {
    var API = {}, transforms = {},
    
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
    
    hashCount = 0,
    
    hash = function(str) {
        hashCount += 1;
        return 'firmin' + hashCount;
    };
    
    API.translate = function(el, translation) {
        var x = translation.x || 0,
            y = translation.y || 0,
            rule, ref, name;
        
        if (typeof x === 'number' && x !== 0) {
            x += 'px';
        }
        
        if (typeof y === 'number' && y !== 0) {
            y += 'px';
        }
        
        rule = buildRule('translate', x, y);
        ref  = hash(rule);
        name = el.className.replace(/\s*firmin\d+\s*/, '');
        
        save(ref, rule);
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + ref;
        
        return el;
    };
    
    API.translateX = function(el, dist) {
        return API.translate(el, {x: dist});
    };
    
    API.translateY = function(el, dist) {
        return API.translate(el, {y: dist});
    };
    
    return API;
})();
