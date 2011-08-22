JSCLASS_PATH = 'vendor/jsclass/build/src/';
JS.require('../' + JSCLASS_PATH + '/loader');

JS.Packages(function() {
    this.autoload(/.*Spec$/, {from: 'specs'});
    
    this.file('assertions.js').provides('MatrixAssertions');
    this.file('lib/firmin.js').provides('Firmin');
    this.file('lib/matrix.js').provides('FirminCSSMatrix');
});

JS.require('JS.Test', 'MatrixAssertions', function() {
    JS.Test.Unit.Assertions.include(MatrixAssertions);
    
    JS.require('WebKitCSSMatrix',
               'FirminCSSMatrix',
               'CSSMatrixSpec',
               JS.Test.method('autorun'));
});
