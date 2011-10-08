// AlleleString
function Allele(name) {
    this.name = name;
}
Allele.fromString = function(name) {
    return new Allele(name);
}
Allele.prototype.equals = function(other) {
    return this.name == other.name;
}
Allele.prototype.toString = function() {
    return this.name;
}


// Allele
function AlleleString(list) {
    this.alleles = list;
    this.length = this.alleles.length;
}
AlleleString.fromAlleles = function(list) {
    return new AlleleString(list);
}
AlleleString.fromString = function(str) {
    //
    // Alleles are split by ; characters.
    var allele_list = [];
    $.each(str.split(';'), function(i, v) {
        allele_list.push(Allele.fromString(v));
    });
    return AlleleString.fromAlleles(allele_list);
}
AlleleString.prototype.breedWith = function(other_string) {
    return GeneString.fromAlleleStrings(this, other_string);
}
AlleleString.prototype.elementAt = function(i) {
    return this.alleles[i];
}
AlleleString.prototype.equals = function(other) {
    return this.alleles == other.alleles;
}
AlleleString.prototype.toString = function() {
    return this.alleles.join(';');
}



// Gene
function Gene(allele1, allele2) {
    this.allele1 = allele1;
    this.allele2 = allele2;
}
Gene.fromAlleles = function(a1, a2) {
    return new Gene(a1, a2);
}
Gene.fromString = function(str) {
    var [a1, a2] = str.split('/');
    return Gene.fromAlleles(Allele.fromString(a1), Allele.fromString(a2));
}
Gene.prototype.isLethal = function() {
    return this.allele1.equals(this.allele2);
}
Gene.prototype.equals = function(other) {
    return this.allele1.equals(other.allele1) && this.allele2.equals(other.allele2);
}
Gene.prototype.toString = function() {
    return this.allele1.toString()+'/'+this.allele2.toString();
}


// GeneString
GeneString = function(genes) {
    this.genes = genes;
    this.length = this.genes.length;
}
GeneString.fromGenes = function(genes) {
    return new GeneString(genes);
}
GeneString.fromAlleleStrings = function(string1, string2) {
    var genes = [];
    var gene_string_length = Math.min(string1.length, string2.length);
    for (var i = 0; i < gene_string_length; i++) {
        genes[i] = Gene.fromAlleles(string1.elementAt(i), string2.elementAt(i));
    }
    return GeneString.fromGenes(genes);
}
GeneString.fromString = function(str) {
    var genes = [];
    //
    // Genes are split by ; characters.
    $.each(str.split(';'), function(i, v) {
        genes.push(Gene.fromString(v));
    });
    return GeneString.fromGenes(genes);
}
GeneString.prototype.isLethal = function() {
    for (var i = 0; i < this.length; i++) {
        if (this.elementAt(i).isLethal()) {
            return true;
        }
    }
    return false;
}
//
// Breed this gene string in all possible combinations.
GeneString.prototype.getPossibleAlleleStrings = function() {
    //
    // Possible child count: 2^gene_string_length
    // (2 possible combinations per gene)
    var child_count = Math.pow(2, this.length);
    var children = [];
    for (var i = 0; i < child_count; i++) {
        var allele_list = [];
        for (var j = 0; j < this.length; j++) {
            //
            // Add a gene for this position.
            // Which allele is added from the first and second gene?
            var gene = this.elementAt(j);
            allele_list.push((Math.pow(2, j) & i) ? gene.allele1 : gene.allele2);
        }
        children.push(AlleleString.fromAlleles(allele_list));
    }
    return children;
}
GeneString.prototype.elementAt = function(i) {
    return this.genes[i];
}
GeneString.prototype.equals = function(other) {
    var gene_string_length = Math.min(this.length, other.length);
    for (var i = 0; i < gene_string_length; i++) {
        if (!(this.elementAt(i).equals(other.elementAt(i)))) {
            return false;
        }
    }
    return true;
}
GeneString.prototype.toString = function() {
    return this.genes.join(';');
}