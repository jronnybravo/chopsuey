import Utils from './Utils';

export default class Combinatorics {
    private static validateLengthParameter(elements, length) {
        if (length < 1 || length > elements.length) {
            throw new RangeError('`length` parameter should be between 1 and the length of the `elements`');
        }
    }

    public static *generateSubsets<T>(elements: T[], distinct: boolean = false): IterableIterator<T[]> {
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

    public static *generateCombinations<T>(
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

    public static *generatePermutations<T>(
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

    public static *generatePermutationsWithRepetitions<T>(
        elements: T[],
        length: number = elements.length,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        if (distinct) {
            elements = [...new Set(elements)];
        }

        const indices = Array(length).fill(0);
        const loadNextIndexSet = (i: number = indices.length - 1): boolean => {
            if (++indices[i] === elements.length) {
                indices[i] = 0;
                if (i === 0 || !loadNextIndexSet(i - 1)) {
                    return false;
                }
            }
            return true;
        };

        do {
            yield indices.map((i) => elements[i]);
        } while (loadNextIndexSet());
    }

    public static *generateDistinctPermutations<T>(elements: T[]): IterableIterator<T[]> {
        const hasDuplicates = new Set(elements).size !== elements.length;
        if (!hasDuplicates) {
            return yield* this.generateHeapsPermutations(elements);
        }

        elements = elements.slice().sort();

        function nextPermutation() {
            const reversedIndices: number[] = [...Array(elements.length).keys()].reverse();

            const i = reversedIndices.slice(1).find((a) => elements[a] < elements[a + 1]);

            if (i === undefined) {
                elements.reverse();
                return false;
            } else {
                const j: number = reversedIndices.find((a) => elements[i] < elements[a]) || i;
                [elements[i], elements[j]] = [elements[j], elements[i]];

                const start = i + 1;
                if (start === 0) {
                    elements.reverse();
                } else {
                    let left = start;
                    let right = elements.length - 1;

                    while (left++ < right--) {
                        [elements[left], elements[right]] = [elements[right], elements[left]];
                    }
                }
            }

            return true;
        }

        do {
            yield elements.slice();
        } while (nextPermutation());
    }

    // https://en.wikipedia.org/wiki/Heap%27s_algorithm
    public static *generateHeapsPermutations<T>(elements: T[]): IterableIterator<T[]> {
        elements = elements.slice();

        yield elements.slice();

        const stackState = Array(elements.length).fill(0);

        let i = 1;
        while (i < elements.length) {
            if (stackState[i] < i) {
                const j = i % 2 && stackState[i];
                [elements[i], elements[j]] = [elements[j], elements[i]];

                stackState[i]++;
                i = 1;

                yield elements.slice();
            } else {
                stackState[i] = 0;
                i++;
            }
        }
    }

    // https://www.statlect.com/mathematical-tools/k-permutations
    public static *generateKPermutations<T>(
        elements: T[],
        length: number,
        distinct: boolean = false,
    ): IterableIterator<T[]> {
        for (const subset of this.generateCombinations(elements, length, distinct)) {
            if (distinct) {
                yield* this.generateDistinctPermutations(subset);
            } else {
                yield* this.generateHeapsPermutations(subset);
            }
        }
    }

    public static getRandomSubset<T>(elements: T[]): T[] {
        const length = Math.floor( Math.random() * ( 1 + elements.length - 0 ) ) + 0;
        if(length === 0) {
            return [];
        }
        return this.getRandomCombination(elements, length);
    }

    public static getRandomCombination<T>(elements: T[], length: number): T[] {
        this.validateLengthParameter(elements, length);

        elements = elements.slice();
        for (let i = 0; i < length; i++) {
            const j = Math.floor(Math.random() * elements.length);
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
        return elements.slice(0, length);
    }

    public static getRandomPermutation<T>(
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
