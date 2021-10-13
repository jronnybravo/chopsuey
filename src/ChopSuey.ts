export class ChopSuey {
    static *generateSubsets<T>(elements: T[], offset: number = 0): Generator<T[], void, void> {
        while (offset < elements.length) {
            const first = elements[offset++];
            for (const subset of this.generateSubsets(elements, offset)) {
                subset.push(first);
                yield subset;
            }
        }
        yield [];
    }

    static *generatePermutations<T>(elements: T[]): Generator<T[], void, void> {
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

    static getSubsets<T>(elements: T[]): T[][] {
        return [...this.generateSubsets(elements)];
    }

    static getPermutations<T>(elements: T[]): T[][] {
        return [...this.generatePermutations(elements)];
    }

    static getShuffled<T>(elements: T[]): T[] {
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
