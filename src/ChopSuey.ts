import Combinatorics from './Combinatorics';

export default class ChopSuey<T> {
    private elements: T[];

    constructor(elements: T[]) {
        this.elements = elements;
    }

    public *generateSubsets(distinct: boolean = false): IterableIterator<T[]> {
        return yield* Combinatorics.generateSubsets(this.elements, distinct);
    }

    public getSubsets(distinct: boolean = false): T[][] {
        return [...this.generateSubsets(distinct)];
    }

    public getRandomSubset() {
        return Combinatorics.getRandomSubset(this.elements);
    }

    public *generateCombinations(length: number, distinct: boolean = false): IterableIterator<T[]> {
        return yield* Combinatorics.generateCombinations(this.elements, length, distinct);
    }

    public getCombinations(length: number, distinct: boolean = false): T[][] {
        return [...this.generateCombinations(length, distinct)];
    }

    public getRandomCombination(length: number): T[] {
        return Combinatorics.getRandomCombination(this.elements, length);
    }

    public *generatePermutations(
        length: number = this.elements.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        return yield* Combinatorics.generatePermutations(this.elements, length, allowRepetitions, distinct);
    }

    public getPermutations(
        length: number = this.elements.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): T[][] {
        return [...this.generatePermutations(length, allowRepetitions, distinct)];
    }

    public getRandomPermutation<T>(
        length: number = elements.length,
        allowRepetitions: boolean = false,
    ): T[] {
        return Combinatorics.getRandomPermutation(this.elements, length, allowRepetitions);
    }

    public getSum(): number {

    }
}
