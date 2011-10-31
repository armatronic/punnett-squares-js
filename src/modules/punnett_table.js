(function(punnettTable) {
    /**
     * Model for a breeding pair of genes.
     */
    punnettTable.GenomePair = Backbone.Model.extend({
        defaults: {
            gene1: new Genome([]),
            gene2: new Genome([])
        },
        setGene: function(n, sequence) {
            if (n == 1) {
                return this.gene1 = Genome.fromString(sequence);
            }
            else if (n == 2) {
                return this.gene2 = Genome.fromString(sequence);
            }
            return false;
        },
        setGene1: function(sequence) { return this.setGene(1, sequence); },
        setGene2: function(sequence) { return this.setGene(2, sequence); },

        /**
         * Retrieves all possible offspring of this.gene1 and this.gene2, and
         * renders into an array structure.
         *
         * @return array An array in the following format:
         *               [{
         *                 alleleString: AlleleString,
         *                 pairs:        [{alleleString: AlleleString, genome: Genome}]
         *               }]
         */
        getOffspring: function() {
            var gene_matrix = [];
            var gene_size   = Math.min(this.gene1.length, this.gene2.length);

            var gene1_allele_strings = this.gene1.getPossibleAlleleStrings(gene_size);
            var gene2_allele_strings = this.gene2.getPossibleAlleleStrings(gene_size);
            _.each(gene1_allele_strings, function(a1_string, i) {
                var gene_row = {
                    alleleString: a1_string,
                    pairs:        []
                };
                _.each(gene2_allele_strings, function(a2_string, j) {
                    gene_row.pairs.push({
                        alleleString: a2_string,
                        genome:       Genome.fromAlleleStrings(a1_string, a2_string)
                    });
                });
                gene_matrix.push(gene_row);
            });
            return gene_matrix;
        }
    });


    //
    // Collection of genes: none yet, or collection of possible result genes?
    // If there is, then store them in local storage.


    /**
     * View: renders result of GenomePair.getOffspring() into a table.
     */
    punnettTable.View = Backbone.View.extend({
        model: new punnettTable.GenomePair(),
        render: function() {
            this.model.setGene1(this.$('input.gene1').val());
            this.model.setGene2(this.$('input.gene2').val());
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
                    'other_part<-parts.0.pairs': {'.': 'other_part.alleleString'}
                },
                '.rows': {
                    'part<-parts': {
                        '.header_cell': 'part.alleleString',
                        '.result_cell': {
                            'pair<-part.pairs': {'.': 'pair.genome'}
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
