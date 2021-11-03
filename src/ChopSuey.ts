import Combinatorics from './Combinatorics';
import Statistics from './Statistics';

export default class ChopSuey<T> {
    private elements: T[];

    constructor(elements: T[]) {
        this.elements = elements;
    }

    /**
     * @returns generator
     */
    *generateSubsets(distinct: boolean = false): IterableIterator<T[]> {
        return yield* Combinatorics.generateSubsets(this.elements, distinct);
    }

    getSubsets(distinct: boolean = false): T[][] {
        return [...this.generateSubsets(distinct)];
    }

    getRandomSubset() {
        return Combinatorics.getRandomSubset(this.elements);
    }

    *generateCombinations(length: number, distinct: boolean = false): IterableIterator<T[]> {
        return yield* Combinatorics.generateCombinations(this.elements, length, distinct);
    }

    getCombinations(length: number, distinct: boolean = false): T[][] {
        return [...this.generateCombinations(length, distinct)];
    }

    getRandomCombination(length: number): T[] {
        return Combinatorics.getRandomCombination(this.elements, length);
    }

    *generatePermutations(
        length: number = this.elements.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        return yield* Combinatorics.generatePermutations(this.elements, length, allowRepetitions, distinct);
    }

    getPermutations(
        length: number = this.elements.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): T[][] {
        return [...this.generatePermutations(length, allowRepetitions, distinct)];
    }

    getRandomPermutation(length: number = this.elements.length, allowRepetitions: boolean = false): T[] {
        return Combinatorics.getRandomPermutation(this.elements, length, allowRepetitions);
    }

    getSum(numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        return Statistics.getSum(this.elements, numberConversionCallback);
    }

    getMean(numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        return Statistics.getMean(this.elements, numberConversionCallback);
    }

    getMedian(numberConversionCallback: (a: T) => number = (a) => Number(a)): number | undefined {
        return Statistics.getMedian(this.elements, numberConversionCallback);
    }

    getModes(baseConversionCallback: (a: T) => T = (a) => a): T[] {
        return Statistics.getModes(this.elements, baseConversionCallback);
    }
}
