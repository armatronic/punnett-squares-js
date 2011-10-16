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
        var g = punnettSquares.module('gene');
        var gene_view = new g.View({el: '#punnett-squares'});
        gene_view.render();
    });
})(jQuery);

//(function($) {
//    //
//    // Show punnett squares.
//    $('form[name=punnett-squares]').submit(function() {
//        try {
//            var gene1 = GeneString.fromString($('input[name=gene1]', this).val());
//            var gene2 = GeneString.fromString($('input[name=gene2]', this).val());
//            var gene1_allele_combinations = gene1.getPossibleAlleleStrings();
//            var gene2_allele_combinations = gene2.getPossibleAlleleStrings();
//            var punnett_table = $('#punnett-table');
//            punnett_table.empty();
//            var table_contents = [];
//            var table_header   = [$('<th>&nbsp;</th>')];
//            $.each(gene1_allele_combinations, function(i,v) {
//                var table_cell = $('<th></th>');
//                table_cell.text(v.toString());
//                table_header.push(table_cell);
//            });
//            table_contents.push(table_header);
//
//            $.each(gene2_allele_combinations, function(i,v) {
//                var table_row = [];
//                var table_cell = $('<th></th>');
//                table_cell.text(v.toString());
//                table_row.push(table_cell);
//
//                $.each(gene1_allele_combinations, function(j,v2) {
//                    var table_cell = $('<td></td>');
//                    table_cell.text(GeneString.fromAlleleStrings(v2, v).toString());
//                    table_row.push(table_cell);
//                });
//                table_contents.push(table_row);
//            });
//
//            $.each(table_contents, function(i,v) {
//                var table_row = $('<tr></tr>');
//                $.each(v, function(j,v2) {
//                    table_row.append(v2);
//                });
//                punnett_table.append(table_row);
//            });
//        }
//        catch (ex) {
//            alert(ex);
//        }
//        return false;
//    });
//})(jQuery);
