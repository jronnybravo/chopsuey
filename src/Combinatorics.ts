import Utils from './Utils';

export default class Combinatorics {
    private static validateLengthParameter<T>(elements: T[], length: number): void {
        if (length < 1 || length > elements.length) {
            throw new RangeError('`length` parameter should be between 1 and the length of the `elements`');
        }
    }

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

    static *generateCombinations<T>(
        elements: T[],
        length: number,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
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

    static *generatePermutationsWithRepetitions<T>(
        elements: T[],
        length: number = elements.length,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        if (distinct) {
            elements = [...new Set(elements)];
        }
        this.validateLengthParameter(elements, length);

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

    static *generateDistinctPermutations<T>(elements: T[]): IterableIterator<T[]> {
        const hasDuplicates = new Set(elements).size !== elements.length;
        if (!hasDuplicates) {
            return yield* this.generateHeapsPermutations(elements);
        }

        const copyElements = elements.slice();
        return yield* (function* generator(length = copyElements.length): IterableIterator<T[]> {
            if (length === 1) {
                yield copyElements.slice();
            }
            for (let i = 0; i < length; i++) {
                let subsetLength = length - 1;

                yield* generator(subsetLength);

                const j = length % 2 ? i : 0;
                [copyElements[j], copyElements[subsetLength]] = [copyElements[subsetLength], copyElements[j]];
            }
        })();

        

        // const map = new Map();
        // elements.forEach((a) => map.set(a, map.has(a) ? map.get(a) + 1 : 1));
        // map.forEach((v, k) => {
        //     copyElements.push(...Array(v).fill(k));
        //     map.set(k, copyElements.length);
        // });

        // const reversedStateIndices = [...Array(copyElements.length).keys()].reverse();
        // function loadNextPermutation() {
        //     const i = reversedStateIndices
        //         .slice(1)
        //         .find((a) => map.get(copyElements[a]) < map.get(copyElements[a + 1]));

        //     if (i !== undefined) {
        //         const j: number =
        //             reversedStateIndices.find((a) => map.get(copyElements[i]) < map.get(copyElements[a])) || i;

        //         [copyElements[i], copyElements[j]] = [copyElements[j], copyElements[i]];

        //         const start = i + 1;
        //         if (start === 0) {
        //             copyElements.reverse();
        //         } else {
        //             let left = start;
        //             let right = copyElements.length - 1;

        //             while (left++ < right--) {
        //                 [copyElements[left], copyElements[right]] = [copyElements[right], copyElements[left]];
        //             }
        //         }
        //     } else {
        //         return false;
        //     }

        //     return true;
        // }

        // do {
        //     yield copyElements.slice();
        // } while (loadNextPermutation());
    }

    // https://en.wikipedia.org/wiki/Heap%27s_algorithm
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

    // https://www.statlect.com/mathematical-tools/k-permutations
    static *generateKPermutations<T>(
        elements: T[],
        length: number,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        for (const subset of this.generateCombinations(elements, length, distinct)) {
            yield* this.generatePermutations(subset, subset.length, false, distinct);
        }
    }

    static getRandomSubset<T>(elements: T[]): T[] {
        const length = Math.floor(Math.random() * (1 + elements.length - 0)) + 0;
        if (length === 0) {
            return [];
        }
        return this.getRandomCombination(elements, length);
    }

    static getRandomCombination<T>(elements: T[], length: number): T[] {
        this.validateLengthParameter(elements, length);

        elements = elements.slice();
        for (let i = 0; i < length; i++) {
            const j = Math.floor(Math.random() * elements.length);
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
        return elements.slice(0, length);
    }

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
