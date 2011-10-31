//
// Application module from:
// http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules
var punnettSquares = {
    //
    // Look @ _.memoize
    // Create this closure to contain the cached modules
    module: function() {
        // Internal module cache.
        var modules = {};

        // Create a new module reference scaffold or load an
        // existing module.
        return function(name) {
            // If this module has already been created, return it.
            if (modules[name]) {
                return modules[name];
            }

            // Create a module and save it under this name
            return modules[name] = {};
        };
    }()
};

(function($) {
    $(function() {
        var p_module = punnettSquares.module('punnettTable');
        var p_view   = new p_module.View({el: '#punnett-squares'});
        p_view.render();
    });
})(jQuery);