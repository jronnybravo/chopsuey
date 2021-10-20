export class ChopSuey {
    public static *generateSubsets<T>(
        elements: T[],
        length: number | null = null,
        offset: number = 0,
    ): Generator<T[], void, void> {
        while (offset < elements.length) {
            const first = elements[offset++];
            for (const subset of this.generateSubsets(elements, length, offset)) {
                subset.push(first);
                yield subset;
            }
        }
        yield [];
    }

    public static *generatePermutations<T>(
        elements: T[],
        withRepetitions: boolean = false,
        length: number = elements.length,
    ): Generator<T[], void, void> {
        if (length > elements.length) {
            elements.push(...new Array(length - elements.length));
        }

        if (withRepetitions) {
            return yield* this.generateRepeatablePermutations(elements, length);
        } else if (length == elements.length) {
            return yield* this.generateHeapsPermutations(elements);
        } else {
            return yield* this.generateTrimmedPermutations(elements, length);
        }
    }

    private static *generateRepeatablePermutations<T>(
        elements: T[],
        length: number = elements.length,
    ): Generator<T[], void, void> {
        const updateIndexes = (i: number = indices.length - 1): boolean => {
            indices[i]++;
            if (indices[i] == elements.length) {
                if (i == 0) {
                    return false;
                }
                indices[i] = 0;
                if (!updateIndexes(i - 1)) {
                    return false;
                }
            }
            return true;
        };

        const indices = new Array(length).fill(0);

        let hasNext = true;
        while (hasNext) {
            yield indices.map((i) => elements[i]);
            hasNext = updateIndexes();
        }
    }

    private static *generateHeapsPermutations<T>(elements: T[]): Generator<T[], void, void> {
        yield elements.slice();

        const stack = Array(elements.length).fill(0);

        let i = 1;
        while (i < elements.length) {
            if (stack[i] < i) {
                const j = i % 2 && stack[i];
                [elements[i], elements[j]] = [elements[j], elements[i]];

                stack[i]++;
                i = 1;
                yield elements.slice();
            } else {
                stack[i] = 0;
                i++;
            }
        }
    }

    private static *generateTrimmedPermutations<T>(
        elements: T[],
        length: number,
    ): Generator<T[], void, void> {
        const updateIndexes = (i: number = indices.length - 1): boolean => {
            indices[i]++;
            if (indices[i] == elements.length) {
                if (i == 0) {
                    return false;
                }
                indices[i] = 0;
                if (!updateIndexes(i - 1)) {
                    return false;
                }
            }
            return true;
        };

        const indices = [...Array(length).keys()];

        let hasNext = true;
        while (hasNext) {
            yield indices.map((i) => elements[i]);
            hasNext = updateIndexes();
        }
    }

    public static getSubsets<T>(elements: T[], length: number | null = null): T[][] {
        return [...this.generateSubsets(elements, length)];
    }

    public static getPermutations<T>(
        elements: T[],
        length: number = elements.length,
        withRepetitions: boolean = false,
    ): T[][] {
        return [...this.generatePermutations(elements, withRepetitions, length)];
    }

    public static getShuffled<T>(elements: T[]): T[] {
        const shuffle = (copyElements: T[]): void => {
            for (let i = copyElements.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copyElements[i], copyElements[j]] = [copyElements[j], copyElements[i]];
            }
        };

        const copy = elements.slice();
        shuffle(copy);
        return copy;
    }
}

console.log(ChopSuey.getPermutations([1, 2, 3, 4], 3, false));
