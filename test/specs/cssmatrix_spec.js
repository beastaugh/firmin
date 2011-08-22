JS.ENV.CSSMatrixSpec = JS.Test.describe('FirminCSSMatrix', function() {
    this.before(function() {
        var POINTS = this.POINTS = ['m11', 'm12', 'm13', 'm14',
                                    'm21', 'm22', 'm23', 'm24',
                                    'm31', 'm32', 'm33', 'm34',
                                    'm41', 'm42', 'm43', 'm44'];
        
        this.seedRandomValues = function(ceil, floor) {
           ceil  = ceil  || 1;
           floor = floor && floor < ceil ? floor : 0;
           
           return POINTS.map(function(p) {
               return Math.random() * (ceil - floor) + floor;
           });
       };
       
       this.seedRandomIntegers = function(ceil, floor) {
           ceil  = ceil  || 1;
           floor = floor && floor < ceil ? floor : 0;
           
           return POINTS.map(function(p) {
               return Math.floor(Math.random() * (ceil - floor) + floor);
           });
       };
       
       this.setMatrixValues = function(matrix, seed) {
           var points = seed.length === 6 ?
                        ["a", "b", "c", "d", "e", "f"] : POINTS;
           seed.forEach(function(value, i) {
               matrix[points[i]] = value;
           });
       };
    });
    
    this.it('is initially equal to the reference implementation', function() {
        this.assertMatricesEqual(new WebKitCSSMatrix(),
                                 new FirminCSSMatrix());
    });
    
    this.it('is equal to the reference implementation when both their points are set equally', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix();
            
        this.POINTS.forEach(function(p) {
            var x = Math.round(Math.random() * 10);
            
            a[p] = x;
            b[p] = x;
        });
        
        this.assertMatricesEqual(a, b);
    });
    
    this.it('has the same value when multiplied as the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix(),
            c = new WebKitCSSMatrix();
        
        this.POINTS.forEach(function(p) {
            var x = Math.round(Math.random() * 10),
                y = Math.round(Math.random() * 10);
            
            a[p] = x;
            b[p] = x;
            c[p] = y;
        });
        
        this.assertMatricesEqual(a.multiply(c),
                                 b.multiply(c));
    });
    
    this.it('is equal under inversion to the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix(),
            s = this.seedRandomIntegers(3, -3);
        
        this.setMatrixValues(a, s);
        this.setMatrixValues(b, s);
        
        this.assertMatricesEqual(a.inverse(),
                                 b.inverse());
    });
    
    this.it('is equal under scaling to the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix();
        
        this.assertMatricesEqual(a.scale(0.5, 1.5, 2),
                                 b.scale(0.5, 1.5, 2));
    });
    
    this.it('is equal under translation to the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix()
        
        this.assertMatricesEqual(a.translate(100, 200, -50),
                                 b.translate(100, 200, -50));
    });
    
    this.it('is equal under rotation about a vector to the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix(),
            x = Math.random(),
            y = Math.random(),
            z = Math.random(),
            p = Math.round(Math.random() * 90);
        
        this.assertMatricesEqual(a.rotateAxisAngle(x, y, z, p),
                                 b.rotateAxisAngle(x, y, z, p));
    });
    
    this.it('is equal under rotation about each axis to the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix(),
            x = Math.round(Math.random() * 90),
            y = Math.round(Math.random() * 90),
            z = Math.round(Math.random() * 90);
        
        this.assertMatricesEqual(a.rotate(x, y, z),
                                 b.rotate(x, y, z));
    });
    
    this.it('deserialises to the same values as the reference implementation', function() {
        var a  = new WebKitCSSMatrix(),
            b  = new FirminCSSMatrix(),
            s1 = this.seedRandomValues(3, -3),
            t1 = "matrix3d(" + s1.join(", ") + ")";
        
        a.setMatrixValue(t1);
        b.setMatrixValue(t1);
        
        this.assertMatricesEqual(a, b);
        
        var c  = new WebKitCSSMatrix(),
            d  = new FirminCSSMatrix(),
            s2 = this.seedRandomValues(2, -1).slice(0, 6),
            t2 = "matrix(" + s2.join(", ") + ")";
        
        c.setMatrixValue(t2);
        d.setMatrixValue(t2);
        
        this.assertMatricesEqual(c, d);
        
        var e = new WebKitCSSMatrix(),
            f = new FirminCSSMatrix();
        
        e.setMatrixValue("");
        f.setMatrixValue("");
        
        this.assertMatricesEqual(e, f);
    });
    
    this.it('serialises to the same string representation as the reference implementation', function() {
        var a = new WebKitCSSMatrix(),
            b = new FirminCSSMatrix(),
            s = this.seedRandomValues(3, -3);
        
        this.assertEqual(a.toString(), b.toString());
        
        this.setMatrixValues(a, s);
        this.setMatrixValues(b, s);
        
        this.assertEqual(a.toString(), b.toString());
    });
});
