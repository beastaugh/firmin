JS.ENV.ParsersSpec = JS.Test.describe('Firmin', function() {
    this.describe('Firmin.parseAngle', function() {
        this.it('parses different number representations and assigns them the default unit', function() {
            this.assertEqual(["deg", 50], Firmin.parseAngle(50));
            this.assertEqual(["deg", 50.0], Firmin.parseAngle(50.0));
            this.assertEqual(["deg", 50], Firmin.parseAngle("50"));
            this.assertEqual(["deg", 50.0], Firmin.parseAngle("50.0"));
        });
        
        this.it('repsects angle units where given', function() {
            this.assertEqual(["deg", 50], Firmin.parseAngle("50deg"));
            this.assertEqual(["deg", 50.0], Firmin.parseAngle("50.0deg"));
            this.assertEqual(["rad", 3], Firmin.parseAngle("3rad"));
            this.assertEqual(["rad", 3.0], Firmin.parseAngle("3.0rad"));
        });
        
        this.it('returns null when an unparseable value is provided', function() {
            this.assertNull(Firmin.parseAngle("3.rad"));
            this.assertNull(Firmin.parseAngle("3π"));
            this.assertNull(Firmin.parseAngle("rad"));
            this.assertNull(Firmin.parseAngle({}));
        });
    });
    
    this.describe('Firmin.parseTime', function() {
        this.it('parses different number representations and assigns them the default unit', function() {
            this.assertEqual(["s", 2], Firmin.parseTime(2));
            this.assertEqual(["s", 0.5], Firmin.parseTime(0.5));
            this.assertEqual(["s", 12], Firmin.parseTime("12s"));
        });
        
        this.it('repsects time units where given', function() {
            this.assertEqual(["s", 1], Firmin.parseTime("1s"));
            this.assertEqual(["ms", 40], Firmin.parseTime("40ms"));
        });
        
        this.it('correctly parses floats with units', function() {
            this.assertEqual(["s", 1.2], Firmin.parseTime("1.2s"));
            this.assertEqual(["ms", 192.4], Firmin.parseTime("192.4ms"));
        });
        
        this.it('understands negative times', function() {
            this.assertEqual(["s", -1], Firmin.parseTime("-1"));
            this.assertEqual(["s", -1], Firmin.parseTime(-1));
            this.assertEqual(["s", -1.5], Firmin.parseTime("-1.5"));
            this.assertEqual(["s", -1.5], Firmin.parseTime(-1.5));
            this.assertEqual(["s", -2], Firmin.parseTime("-2s"));
            this.assertEqual(["s", -1.5], Firmin.parseTime("-1.5s"));
            this.assertEqual(["ms", -500], Firmin.parseTime("-500ms"));
            this.assertEqual(["ms", -200.5], Firmin.parseTime("-200.5ms"));
        });
    });
});
