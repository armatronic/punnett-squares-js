(function(Gene) {
//    var Gene = {};
    //
    // Dependencies: none yet

    //
    // Shorthand: application container
    var app = punnettSquares.app;

    //
    // Gene model definition.
    // Includes methods for combining with other genes?
    Gene.Model = Backbone.Model.extend({
        defaults: { string: '' },

        split: function() {
            //
            // Assume all genes are split by ;, and alleles within a gene
            // are split with /.
            return _.map(this.string.split(';'), function(part) {
                var subparts = part.split('/');
                var part_a   = subparts.length > 0 ? subparts[0] : '';
                var part_b   = subparts.length > 1 ? subparts[1] : '';
                return [part_a.trim(), part_b.trim()];
            });
        },

        breedWith: function(other_gene) {
            //
            // Returns a collection of collections of genes?
        }
    });

    //
    // Collection of genes: none yet, or collection of possible result genes?

    //
    // View: renders result of breedWith() into a table. (check out jQuery templates)
    Gene.View = Backbone.View.extend({
        el: '#punnett-squares',
        events: {
            'submit form[name=punnett-squares]': 'showSquares'
        },
        showSquares: function() {
            alert('q');
            return false;
        }
    });
})(punnettSquares.module('gene'));
