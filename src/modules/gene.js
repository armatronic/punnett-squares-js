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


    Gene.GenePair = Backbone.Model.extend({
        defaults: {
            gene1: [],
            gene2: []
        },
        setGene: function(n, sequence) {
            if (n == 1) {
                return this.gene1 = this.split(sequence);
            }
            else if (n == 2) {
                return this.gene2 = this.split(sequence);
            }
            return false;
        },
        setGene1: function(sequence) { return this.setGene(1, sequence); },
        setGene2: function(sequence) { return this.setGene(2, sequence); },

        split: function(sequence) {
            //
            // Assume all genes are split by ;, and alleles within a gene
            // are split with /.
            return _.map(sequence.split(';'), function(part) {
                var subparts = part.split('/');
                var part_a   = subparts.length > 0 ? subparts[0] : '';
                var part_b   = subparts.length > 1 ? subparts[1] : '';
                return [part_a.trim(), part_b.trim()];
            });
        },

        join: function(parts) {
            return _.map(parts, function(part) {
                return part.join('/');
            }).join(';');
        },

        getOffspring: function() {
            //
            // Returns a collection of collections of genes?
            // Runs 4^min(gene1.length, gene2.length) times.
            // At each gene, there are 4 possible combinations.
            var gene_matrix = [];
            var gene_size   = Math.min(this.gene1.length, this.gene2.length);
            var gene_count  = Math.pow(4, gene_size);
            for (var i = 0; i < gene_count; i++) {
                //
                // First
                var new_gene = [];
                for (var j = 0; j < gene_size; j++) {
                    var genepart_1 = this.gene1[j];
                    var genepart_2 = this.gene2[j];
                    //
                    // Which part is used?
                    var key = i << (2*j);
                    new_gene.push([
                        (key & 1 ? genepart_1[1] : genepart_1[0]),
                        (key & 2 ? genepart_2[1] : genepart_2[0]),
                    ])
                }
                console.log(this.join(new_gene));
                gene_matrix.push(new_gene);
            }
            return gene_matrix;


            //
            // Iterate thru each pair.
        }
    });


    //
    // Collection of genes: none yet, or collection of possible result genes?

    //
    // View: renders result of breedWith() into a table. (check out jQuery templates)
    Gene.View = Backbone.View.extend({
        model: new Gene.GenePair(),
        render: function() {
            var g1 = this.model.setGene1(this.$('input.gene1').val());
            var g2 = this.model.setGene2(this.$('input.gene2').val());
            // console.log(g1);
            // console.log(g2);
            this.model.getOffspring();
            return this;
        },
        events: {
            'submit form[name=punnett-squares]': 'updateModels'
        },
        updateModels: function() {
            //
            // Set new model values.
            this.render();
            return false;
        }
    });
})(punnettSquares.module('gene'));
