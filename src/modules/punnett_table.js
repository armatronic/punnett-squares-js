(function(punnettTable) {
    /**
     * Model for a breeding pair of genes.
     */
    punnettTable.GenePair = Backbone.Model.extend({
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

        joinAllele: function(a) {
            return a.join(';');
        },

        joinAlleles: function(a1, a2) {
            return _.zip(a1, a2);
        },

        //
        // Get every possible combination of allele strings from this set.
        getAllAlleleStrings: function(n) {
            var gene = [];
            if (n == 1) {
                gene = this.gene1;
            }
            else if (n == 2) {
                gene = this.gene2;
            }
            if (gene.length == 0) {
                return [];
            }
            var combination_count = Math.pow(2, gene.length);
            var allele_strings    = [];
            for (var i = 0; i < combination_count; i++) {
                var allele_string = []
                _.each(gene, function(part, j) {
                    var key = i >> j;
                    allele_string.push(key & 1 ? part[1] : part[0]);
                });
                allele_strings.push(allele_string);
            }
            return allele_strings;
        },

        getOffspring: function() {
            var gene_matrix = {};
            var gene_size   = Math.min(this.gene1.length, this.gene2.length);

            var gene1_allele_strings = this.getAllAlleleStrings(1);
            var gene2_allele_strings = this.getAllAlleleStrings(2);

            _.each(gene1_allele_strings, function(g1_string, i) {
                var gene_row = {
                    allele: this.joinAllele(g1_string),
                    pairs:  {}
                }
                _.each(gene2_allele_strings, function(g2_string, j) {
                    gene_row.pairs[j] = {
                        allele: this.joinAllele(g2_string),
                        gene:   this.join(this.joinAlleles(g1_string, g2_string))
                    }
                }, this);
                gene_matrix[i] = gene_row;
            }, this);
            return gene_matrix;
        }
    });


    //
    // Collection of genes: none yet, or collection of possible result genes?
    // If there is, then store them in local storage.


    /**
     * View: renders result of breedWith() into a table.
     */
    punnettTable.View = Backbone.View.extend({
        model: new punnettTable.GenePair(),
        render: function() {
            var g1 = this.model.setGene1(this.$('input.gene1').val());
            var g2 = this.model.setGene2(this.$('input.gene2').val());
            var parts = this.model.getOffspring();

            //
            // Compile and store in local or session storage.
            // Not sure about Pure templates - too much logic here rather than
            // in template? Still it's better than Mustache (can't tell it to
            // display header cells only on first offspring row) and much better
            // than HTML by itself.
            // (Look@ https://github.com/uglyog/clientside-haml-js)
            var renderTemplate = $('#punnett-table-template').compile({
                '.header .header_cell': {
                    'other_part<-parts.0.pairs': {'.': 'other_part.allele'}
                },
                '.rows': {
                    'part<-parts': {
                        '.header_cell': 'part.allele',
                        '.result_cell': {
                            'pair<-part.pairs': {'.': 'pair.gene'}
                        }
                    }
                }
            });
            var table = $('table.punnett_table', renderTemplate({parts: parts}));
            this.$('#punnett-table').empty().append(table);
            return this;
        },

        //
        // Listens on the submit event of the form within the template, and
        // calls updateModels when this happens.
        events: {
            'submit form[name=punnett-squares]': 'updateModels'
        },
        updateModels: function() {
            this.render();
            return false;
        }
    });
})(punnettSquares.module('punnettTable'));
