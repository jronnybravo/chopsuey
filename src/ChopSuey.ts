import Combinatorics from './Combinatorics';
import Statistics from './Statistics';
import Utils from './Utils';

export default class ChopSuey<T> {
    private ingredients: T[];

    constructor(ingredients: T[]) {
        this.ingredients = ingredients;
    }

    /**
     * In-place shuffling of all the ingredients
     * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
     */
    toss() {
        for (let i = this.ingredients.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.ingredients[i], this.ingredients[j]] = [this.ingredients[j], this.ingredients[i]];
        }
    }

    /**
     * Compares this current ChopSuey object to another ChopSuey object
     */
    equals(
        otherChopSuey: ChopSuey,
        ordered: boolean = true,
        equalityCallback: (valueA: T, valueB: T) => boolean = (valueA, valueB) => valueA === valueB,
    ): boolean {
        return Utils.areArraysEqual(this.ingredients, otherChopSuey.ingredients, ordered, equalityCallback);
    }

    /**
     * @returns generator
     */
    *generateSubsets(distinct: boolean = false): IterableIterator<T[]> {
        return yield* Combinatorics.generateSubsets(this.ingredients, distinct);
    }

    getSubsets(distinct: boolean = false): T[][] {
        return [...this.generateSubsets(distinct)];
    }

    getRandomSubset() {
        return Combinatorics.getRandomSubset(this.ingredients);
    }

    *generateCombinations(length: number, distinct: boolean = false): IterableIterator<T[]> {
        return yield* Combinatorics.generateCombinations(this.ingredients, length, distinct);
    }

    getCombinations(length: number, distinct: boolean = false): T[][] {
        return [...this.generateCombinations(length, distinct)];
    }

    getRandomCombination(length: number): T[] {
        return Combinatorics.getRandomCombination(this.ingredients, length);
    }

    *generatePermutations(
        length: number = this.ingredients.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        return yield* Combinatorics.generatePermutations(this.ingredients, length, allowRepetitions, distinct);
    }

    getPermutations(
        length: number = this.ingredients.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): T[][] {
        return [...this.generatePermutations(length, allowRepetitions, distinct)];
    }

    getRandomPermutation(length: number = this.ingredients.length, allowRepetitions: boolean = false): T[] {
        return Combinatorics.getRandomPermutation(this.ingredients, length, allowRepetitions);
    }

    getSum(numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        return Statistics.getSum(this.ingredients, numberConversionCallback);
    }

    getMean(numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        return Statistics.getMean(this.ingredients, numberConversionCallback);
    }

    getMedian(numberConversionCallback: (a: T) => number = (a) => Number(a)): number | undefined {
        return Statistics.getMedian(this.ingredients, numberConversionCallback);
    }

    getModes(baseConversionCallback: (a: T) => T = (a) => a): T[] {
        return Statistics.getModes(this.ingredients, baseConversionCallback);
    }
}
