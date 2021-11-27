export default class Statistics {
    /**
     * Get an array of converted elements to its number base type
     *
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param numberConversionCallback Callback function to convert all the elements to a number base type
     */
    private static getNumberConvertedElements<T>(elements: T[], numberConversionCallback: (a: T) => number): number[] {
        const numberElements: number[] = elements.map((a) => numberConversionCallback(a));
        if (numberElements.some((a) => isNaN(a))) {
            throw new TypeError('`elements` parameter should be all of type `number`');
        }
        return numberElements;
    }

    /**
     * Get the total of all the values of `elements`
     *
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param numberConversionCallback Callback function to convert all the elements to a number base type
     */
    public static getSum<T>(elements: T[], numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        const numberELements = this.getNumberConvertedElements(elements, numberConversionCallback);
        return numberELements.reduce((runningTotal, value) => runningTotal + value, 0);
    }

    /**
     * Get the mean value from the set of `elements`
     *
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param numberConversionCallback Callback function to convert all the elements to a number base type
     */
    public static getMean<T>(elements: T[], numberConversionCallback: (a: T) => number = (a) => Number(a)): number {
        if (elements.length) {
            return this.getSum(numberELements, numberConversionCallback) / numberELements.length;
        }
        return NaN;
    }

    /**
     * Get the mode values from the set of `elements`
     *
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param baseConversionCallback Callback function to convert all the elements to a desired base type or computed value
     */
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

    /**
     * Get the median value from the set of `elements`
     *
     * @typeParam T Generic type for the param `elements`
     * @param elements Array of elements, could be a mix of different types
     * @param numberConversionCallback Callback function to convert all the elements to a number base type
     */
    public static getMedian<T>(
        elements: T[],
        numberConversionCallback: (a: T) => number = (a) => Number(a),
    ): number | undefined {
        const numberELements = this.getNumberConvertedElements(elements, numberConversionCallback);

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
