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
            
            if (typeof current === 'number') {
                current += 'px';
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
    
    API.translateX = function(el, dist) {
        var rule = buildRule('translateX', dist),
            ref  = hash(rule),
            name = el.className.replace(/\s*firmin\d+\s*/, '');
        
        save(ref, rule);
        
        el.className = (name.length > 0 ? (name + ' ') : '')  + ref;
        
        return el;
    };
    
    return API;
})();
