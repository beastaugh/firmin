JS.ENV.MatrixAssertions = (function() {
    var POINTS = ['m11', 'm12', 'm13', 'm14',
                  'm21', 'm22', 'm23', 'm24',
                  'm31', 'm32', 'm33', 'm34',
                  'm41', 'm42', 'm43', 'm44'];
    
    function floatApproxEquality(f1, f2) {
        return f1.toFixed(6) === f2.toFixed(6);
    }
    
    return {
        assertMatricesEqual: function(expected, actual, message) {
            var fullMessage = this.buildMessage(message, "<?> expected but was\n<?>.", expected, actual);
            
            this.assertBlock(fullMessage, function() {
                var passed = true;
                
                POINTS.forEach(function(p) {
                    if (!floatApproxEquality(expected[p], actual[p])) {
                        passed = false;
                    }
                });
                
                return passed;
            });
        }
    };
})();
