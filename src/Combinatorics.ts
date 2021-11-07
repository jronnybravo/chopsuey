import Utils from './Utils';

export default class Combinatorics {

    /**
     * Checks if the `length` parameter is between 1 and the number of `elements`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length To be checked with the number of elements for validation
     * @param errorMessage Customizable error message if the validation fails
     */
    private static validateLengthParameter<T>(
        elements: T[],
        length: number,
        errorMessage: string = '`length` parameter should be between 1 and the number of `elements`',
    ): void {
        if (length < 1 || length > elements.length) {
            throw new RangeError(errorMessage);
        }
    }

    /**
     * Generator function to yield all the subsets of the set of `elements`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param distinct Determines whether the desired outputs shall all be distinct from each other or not
     */
    static *generateSubsets<T>(elements: T[], distinct: boolean = false): IterableIterator<T[]> {
        return yield* (function* generator(offset: number = 0): IterableIterator<T[]> {
            const yieldedResults: T[][] = [];
            while (offset < elements.length) {
                const first = elements[offset++];
                for (const subset of generator(offset)) {
                    const value = [first, ...subset];
                    if (distinct && !yieldedResults.some((a) => Utils.areArraysEqual(a, value, false))) {
                        yieldedResults.push(value);
                        yield value;
                    } else {
                        yield value;
                    }
                }
            }
            yield [];
        })();
    }

    /**
     * Generator function to yield all the combinations of the set of `elements`, given the `length`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length Desired number of elements per combination
     * @param distinct Determines whether the desired outputs shall all be distinct from each other or not
     */
    static *generateCombinations<T>(elements: T[], length: number, distinct: boolean = false): IterableIterator<T[]> {
        this.validateLengthParameter(elements, length);

        return yield* (function* generator(limit: number, offset: number = 0): IterableIterator<T[]> {
            const yieldedResults: T[][] = [];
            const hasDuplicates = new Set(elements.slice(offset)).size !== elements.length - offset;
            function* attemptYield(value: T[]) {
                if (distinct && hasDuplicates) {
                    const alreadyYielded = yieldedResults.some((a) => Utils.areArraysEqual(a, value, false));
                    if (!alreadyYielded) {
                        yieldedResults.push(value);
                        yield value;
                    }
                } else {
                    yield value;
                }
            }

            const subsetLength = limit - 1;
            while (offset < elements.length - subsetLength) {
                const first = elements[offset++];
                if (limit === 1) {
                    const value = [first];
                    yield* attemptYield(value);
                } else {
                    for (const subset of generator(subsetLength, offset)) {
                        const value = [first, ...subset];
                        yield* attemptYield(value);
                    }
                }
            }
        })(length);
    }

    /**
     * Generator function to yield all the permutations of the set of `elements`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length Desired number of elements per k-permutation
     * @param allowRepetitions Determines whether to generate permutations with repetitions allowed or not
     * @param distinct Determines whether the desired outputs shall all be distinct from each other or not
     */
    static *generatePermutations<T>(
        elements: T[],
        length: number = elements.length,
        allowRepetitions: boolean = false,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        this.validateLengthParameter(elements, length);

        if (allowRepetitions) {
            return yield* this.generatePermutationsWithRepetitions(elements, length, distinct);
        }

        if (length < elements.length) {
            return yield* this.generateKPermutations(elements, length, distinct);
        }

        if (distinct) {
            return yield* this.generateDistinctPermutations(elements);
        }

        return yield* this.generateHeapsPermutations(elements);
    }

    /**
     * Generator function to yield all the permutations of the set of `elements` with repetitions allowed
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length Desired number of elements per k-permutation
     * @param distinct Determines whether the desired outputs shall all be distinct from each other or not
     */
    static *generatePermutationsWithRepetitions<T>(
        elements: T[],
        length: number = elements.length,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        this.validateLengthParameter(elements, length);

        if (distinct) {
            elements = [...new Set(elements)];
            this.validateLengthParameter(
                elements,
                length,
                '`length` parameter should be between 1 and the number of distinct `elements`',
            );
        }

        const copyElements = Array(length).fill(elements[0]);
        const stateIndices = Array(length).fill(0);
        const loadNextPermutation = (i: number = stateIndices.length - 1): boolean => {
            if (++stateIndices[i] === elements.length) {
                stateIndices[i] = 0;
                if (i === 0 || !loadNextPermutation(i - 1)) {
                    return false;
                }
            }
            copyElements[i] = elements[stateIndices[i]];
            return true;
        };

        do {
            yield copyElements.slice();
        } while (loadNextPermutation());
    }

    /**
     * Generator function to yield all the distinct permutations of the set of `elements`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     */
    static *generateDistinctPermutations<T>(elements: T[]): IterableIterator<T[]> {
        const hasDuplicates = new Set(elements).size !== elements.length;
        if (!hasDuplicates) {
            return yield* this.generateHeapsPermutations(elements);
        }

        const copyElements: T[] = [];

        const map = elements.reduce((map, val) => map.set(val, 1 + (map.get(val) || 0)), new Map());
        for (const [k, v] of map.entries()) {
            copyElements.push(...Array(v).fill(k));
            map.set(k, copyElements.length);
        }

        const jIndices = [...Array(copyElements.length).keys()].reverse();
        const iIndices = jIndices.slice(1);
        const loadNextPermutation = () => {
            const i = iIndices.find((i) => map.get(copyElements[i]) < map.get(copyElements[i + 1]));
            if (i !== undefined) {
                const j = jIndices.find((j) => map.get(copyElements[i]) < map.get(copyElements[j])) || i;
                [copyElements[i], copyElements[j]] = [copyElements[j], copyElements[i]];

                let left = i + 1;
                let right = copyElements.length - 1;

                while (left < right) {
                    [copyElements[left], copyElements[right]] = [copyElements[right], copyElements[left]];
                    left++;
                    right--;
                }

                return true;
            }
            return false;
        };

        do {
            yield copyElements.slice();
        } while (loadNextPermutation());
    }

    /**
     * Generator function to yield all the permutations of the set of `elements` using Heap's Algorithm
     * https://en.wikipedia.org/wiki/Heap%27s_algorithm
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     */
    static *generateHeapsPermutations<T>(elements: T[]): IterableIterator<T[]> {
        const copyElements = elements.slice();

        const stack = Array(copyElements.length).fill(0);
        let i = 1;
        const loadNextPermutation = () => {
            while (i < copyElements.length) {
                if (stack[i] < i) {
                    const j = i % 2 && stack[i];
                    [copyElements[i], copyElements[j]] = [copyElements[j], copyElements[i]];
                    stack[i]++;
                    i = 1;

                    return true;
                } else {
                    stack[i] = 0;
                    i++;
                }
            }
            return false;
        };

        do {
            yield copyElements.slice();
        } while (loadNextPermutation());
    }

    /**
     * Generator function to yield all the k-permutations of the set of `elements` where k is the `length`
     * https://www.statlect.com/mathematical-tools/k-permutations
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length Desired length per k-permutation
     * @param distinct Determines whether the desired outputs shall all be distinct from each other or not
     */
    static *generateKPermutations<T>(elements: T[], length: number, distinct: boolean = false): IterableIterator<T[]> {
        for (const subset of this.generateCombinations(elements, length, distinct)) {
            yield* this.generatePermutations(subset, subset.length, false, distinct);
        }
    }

    /**
     * Get any random subset from the set of `elements`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     */
    static getRandomSubset<T>(elements: T[]): T[] {
        const length = Math.floor(Math.random() * (1 + elements.length - 0)) + 0;
        return length ? this.getRandomCombination(elements, length) : [];
    }

    /**
     * Get any random combination from the set of `elements`, given the `length`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length Desired number of elements of the random combination
     */
    static getRandomCombination<T>(elements: T[], length: number): T[] {
        this.validateLengthParameter(elements, length);

        elements = elements.slice();
        for (let i = 0; i < length; i++) {
            const j = Math.floor(Math.random() * elements.length);
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
        return elements.slice(0, length);
    }

    /**
     * Get any random permutation from the set of `elements`
     * 
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param length Desired number of elements of the random permutation
     * @param allowRepetitions Determines whether the desired random permutation shall allow repetitions or not
     */
    static getRandomPermutation<T>(
        elements: T[],
        length: number = elements.length,
        allowRepetitions: boolean = false,
    ): T[] {
        this.validateLengthParameter(elements, length);

        if (allowRepetitions) {
            const result = [];
            for (let i = 0; i < length; i++) {
                result[i] = elements[Math.floor(Math.random() * elements.length)];
            }
            return result;
        }

        // random k-permutation of n is just essentially a random combination of length k
        return this.getRandomCombination(elements, length);
    }
}
