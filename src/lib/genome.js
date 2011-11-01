/**
 * Library that contains objects that represent genomes (a.k.a. gene strings),
 * as well as their composite genes and alleles.
 */


/**
 * Representation of a single allele. (An allele is one half of a gene.)
 *
 * @param string name The character for the allele.
 */
function Allele(name) {
    this.name = name;
};

/**
 * Creates an allele from a string.
 *
 * Usually, an allele is represented by a single character, but it may be any
 * string.
 *
 * @param string name The character for the allele.
 *
 * @return Allele
 */
Allele.fromString = function(name) {
    return new Allele(name);
};

/**
 * Compares this allele with another.
 *
 * @param Allele other
 *
 * @return bool
 */
Allele.prototype.equals = function(other) {
    return this.name == other.name;
};

/**
 * Returns string representation of this allele.
 *
 * @return string
 */
Allele.prototype.toString = function() {
    return this.name;
};


/**
 * Representation of a list of alleles. Usually generated from a gene string as
 * that gene's possible contributions to a breeding with another gene.
 *
 * @param array[Allele] list The list of alleles that go into this string.
 */
function AlleleString(list) {
    this.alleles = list;
    this.length = this.alleles.length;
};

/**
 * Creates allele string from a list of alleles.
 *
 * @param array[Allele] list
 *
 * @return AlleleString
 */
AlleleString.fromAlleles = function(list) {
    return new AlleleString(list);
};

/**
 * Creates allele string from a string representation.
 *
 * Alleles within a string are split with ; characters.
 *
 * @param string str
 *
 * @return AlleleString
 */
AlleleString.fromString = function(str) {
    //
    // Alleles are split by ; characters.
    var allele_list = [];
    var parts       = str.split(';');
    for (var i in parts) {
        allele_list.push(Allele.fromString(parts[i]));
    }
    return AlleleString.fromAlleles(allele_list);
};

/**
 * Creates a new genome from the breeding of this and another AlleleString.
 *
 * @param AlleleString other
 *
 * @return Genome
 */
AlleleString.prototype.breedWith = function(other) {
    return Genome.fromAlleleStrings(this, other);
};

/**
 * Retrieves the allele at position i (starting at 0).
 *
 * @param int i
 *
 * @return Allele
 */
AlleleString.prototype.elementAt = function(i) {
    return this.alleles[i];
};

/**
 * Compares this allele string to another.
 *
 * @param AlleleString other
 *
 * @return bool
 */
AlleleString.prototype.equals = function(other) {
    return this.alleles == other.alleles;
};

/**
 * Returns string representation of this allele string. Essentially, the
 * opposite of AlleleString.fromString().
 *
 * @return string
 */
AlleleString.prototype.toString = function() {
    return this.alleles.join(';');
};


/**
 * Representation of a single gene within a genome. Each gene contains a pair of
 * alleles.
 *
 * @param Allele allele1
 * @param Allele allele2
 */
function Gene(allele1, allele2) {
    this.allele1 = allele1;
    this.allele2 = allele2;
};

/**
 * Creates a gene from two alleles.
 *
 * @param Allele allele1
 * @param Allele allele2
 *
 * @return Gene
 */
Gene.fromAlleles = function(a1, a2) {
    return new Gene(a1, a2);
};

/**
 * Creates a gene from a string.
 *
 * Alleles in a gene are split by a / character.
 *
 * @param string str
 *
 * @return Gene
 */
Gene.fromString = function(str) {
    var parts = str.split('/');
    return Gene.fromAlleles(Allele.fromString(parts[0]), Allele.fromString(parts[1]));
};

/**
 * A gene can be considered as lethal to a genome that it is a part of if its
 * alleles are equal.
 *
 * @return bool
 */
Gene.prototype.isLethal = function() {
    return this.allele1.equals(this.allele2);
};

/**
 * Compares this gene string to another.
 *
 * @param Gene other
 *
 * @return bool
 */
Gene.prototype.equals = function(other) {
    return this.allele1.equals(other.allele1) && this.allele2.equals(other.allele2);
};

/**
 * Returns string representation of this gene. Essentially, the opposite of
 * Gene.fromString().
 *
 * @return string
 */
Gene.prototype.toString = function() {
    return this.allele1.toString()+'/'+this.allele2.toString();
};


/**
 * Representation of a genome.
 *
 * @param array[Gene] genes
 */
Genome = function(genes) {
    this.genes = genes;
    this.length = this.genes.length;
};

/**
 * Creates a genome from a list of genes.
 *
 * @param array[Gene] genes
 *
 * @return Genome
 */
Genome.fromGenes = function(genes) {
    return new Genome(genes);
};

/**
 * Creates a genome from two allele strings by breeding them together.
 *
 * If the allele strings are of varying length, the longer one is truncated to
 * the same length as the shorter.
 *
 * @param AlleleString string1
 * @param AlleleString string2
 *
 * @return Genome
 */
Genome.fromAlleleStrings = function(string1, string2) {
    var genes = [];
    var gene_string_length = Math.min(string1.length, string2.length);
    for (var i = 0; i < gene_string_length; i++) {
        genes[i] = Gene.fromAlleles(string1.elementAt(i), string2.elementAt(i));
    }
    return Genome.fromGenes(genes);
};

/**
 * Creates a genome from a string representation.
 *
 * Genes within the genome are split by ; characters, and alleles within each
 * gene are split by / characters.
 *
 * @param string str
 *
 * @return Genome
 */
Genome.fromString = function(str) {
    var genes = [];
    var parts = str.split(';');
    for (var i in parts) {
        genes.push(Gene.fromString(parts[i]));
    }
    return Genome.fromGenes(genes);
};

/**
 * A genome is considered lethal if any of its genes are lethal (i.e. they have
 * the same allele on both sides).
 *
 * @return bool
 */
Genome.prototype.isLethal = function() {
    for (var i = 0; i < this.length; i++) {
        if (this.elementAt(i).isLethal()) {
            return true;
        }
    }
    return false;
};

/**
 * Retrieves all possible allele strings that this genome can provide during the
 * breeding process.
 *
 * Each gene within the genome could provide either its first or second allele
 * to an allele string - therefore, there are 2^genome.length possible allele
 * strings that could be created.
 *
 * @param int max_length If provided, all genes after this position are ignored.
 *
 * @return array[AlleleString]
 */
Genome.prototype.getPossibleAlleleStrings = function(max_length) {
    //
    // Possible child count: 2^gene_string_length
    // (2 possible combinations per gene)
    var length = this.length;
    if (typeof max_length != 'undefined') {
        length = Math.min(max_length, length);
    }
    var child_count = Math.pow(2, length);
    var children = [];
    for (var i = 0; i < child_count; i++) {
        var allele_list = [];
        for (var j = 0; j < length; j++) {
            //
            // Add a gene for this position.
            // Exchange last gene, then second last, and so on so that the list
            // of allele strings is in this order:
            // a1/a2;b1/b2;c1/c2 => a1/b1/c1, a1/b1/c2, a1/b2/c1, a1/b2/c2, ...
            var gene = this.elementAt(j);
            allele_list.push((Math.pow(2, (length - j - 1)) & i) ? gene.allele2 : gene.allele1);
        }
        children.push(AlleleString.fromAlleles(allele_list));
    }
    return children;
};

/**
 * Gets all possible children that could come from this genome and another
 * allele string.
 *
 * @param AlleleString other_string
 *
 * @return array[Genome]
 */
Genome.prototype.getPossibleChildrenFromAlleleString = function(other_string) {
    var child_genomes  = [];
    var allele_strings = this.getPossibleAlleleStrings();
    for (var i in allele_strings) {
        child_genomes.push(Genome.fromAlleleStrings(allele_strings[i], other_string));
    }
    return child_genomes;
};

/**
 * Gets all possible children that could come from this genome and another
 * genome.
 *
 * @param Genome other_genome
 *
 * @return array[Genome]
 */
Genome.prototype.getPossibleChildrenFromGenome = function(other_genome) {
    var child_genomes = [];
    var allele_strings = this.getPossibleAlleleStrings();
    var other_strings = other_genome.getPossibleAlleleStrings();
    for (var i in allele_strings) {
        for (var j in other_strings) {
            child_genomes.push(Genome.fromAlleleStrings(allele_strings[i], other_strings[j]));
        }
    }
    return child_genomes;
};

/**
 * Retrieves the gene at position i (starting at 0).
 *
 * @param int i
 *
 * @return Gene
 */
Genome.prototype.elementAt = function(i) {
    return this.genes[i];
};

/**
 * Comparison for whether this genome is the same as another.
 *
 * @return bool
 */
Genome.prototype.equals = function(other) {
    if (this.length != other.length) {
        return false;
    }
    var gene_string_length = Math.min(this.length, other.length);
    for (var i = 0; i < gene_string_length; i++) {
        if (!(this.elementAt(i).equals(other.elementAt(i)))) {
            return false;
        }
    }
    return true;
};

/**
 * Returns a string representation of this genome.
 *
 * @return string
 */
Genome.prototype.toString = function() {
    return this.genes.join(';');
};
