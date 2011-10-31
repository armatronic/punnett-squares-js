//
// Application module from:
// http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules
var punnettSquares = {
    //
    // Module, when called with a name, creates a Backbone module which is
    // memoized.
    module: _.memoize(function(name) { return {}; })
};

(function($) {
    $(function() {
        var p_module = punnettSquares.module('punnettTable');
        var p_view   = new p_module.View({el: '#punnett-squares'});
        p_view.render();
    });
})(jQuery);