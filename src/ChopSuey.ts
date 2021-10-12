export class ChopSuey {
    static *generatePermutations(elements: any[]) {
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

    static getPermutations(elements: any[]): any[] {
        return [...this.generatePermutations(elements)];
    }
}
