export default class Statistics {
    private static getNumberElements<T>(elements: T[], numberConversionCallback: (a: T) => number): number[] {
        const numberElements: number[] = elements.map((a) => numberConversionCallback(a));
        if (numberElements.some((a) => isNaN(a))) {
            throw new TypeError('`elements` parameter should be all of type `number`');
        }
        return numberElements;
    }

    public static getSum<T>(elements: T[], numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        const numberELements = this.getNumberElements(elements, numberConversionCallback);
        return numberELements.reduce((runningTotal, value) => runningTotal + value, 0);
    }

    public static getMean<T>(elements: T[], numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        if (elements.length) {
            return this.getSum(numberELements, numberConversionCallback) / numberELements.length;
        }
        return NaN;
    }

    public static getModes<T>(elements: T[], baseConversionCallback: (a: T) => T = (a) => a): T[] {
        const baseConvertedElements = elements.map((a) => baseConversionCallback(a));

        const map = new Map();

        let maxFrequency = 0;
        let modes: T[] = [];

        for (const element of baseConvertedElements) {
            const frequency = map.has(element) ? map.get(element) + 1 : 1;
            if (frequency > maxFrequency) {
                maxFrequency = frequency;
                modes = [element];
            } else if (frequency === maxFrequency) {
                modes.push(element);
            }
            map.set(element, frequency);
        }

        const isDistributionDistinct = new Set(modes).size !== new Set(elements).size;
        return isDistributionDistinct ? modes : [];
    }

    public static getMedian<T>(
        elements: T[],
        numberConversionCallback: (a: T) => number = (a) => Number(a),
    ): number | undefined {
        const numberELements = this.getNumberElements(elements, numberConversionCallback);

        if (numberELements.length) {
            const sorted = numberELements.slice().sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);

            if (sorted.length % 2 === 0) {
                return (sorted[middle - 1] + sorted[middle]) / 2;
            }

            return sorted[middle];
        }
        return undefined;
    }
}
