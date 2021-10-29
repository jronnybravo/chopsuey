export default class Statistics {
    public static getSum<T>(elements: T[]): number {
        const numberElements: number[] = elements.map(a => Number(a));
        if(!numberElements.some(a => isNaN(a))) {
            return numberElements.reduce((a, b) => a + b, 0);    
        }
        return 0;
    }

    public static getMean(elements: T[]): number {
        const numberElements: number[] = elements.map(a => Number(a));
        if(!numberElements.some(a => isNaN(a))) {
            
        }
        if (elements.length) {
            return this.getSum(elements) / elements.length;
        }
        return NaN;
    }

    public static getModes<T>(elements: T[]): T[] {
        const map = new Map();

        let maxFrequency = 0;
        let modes: T[] = [];

        for (const element of elements) {
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

    public static getMedian(elements: number[]): number | undefined {
        if (elements.length) {
            const sorted = elements.slice().sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);

            if (sorted.length % 2 === 0) {
                return (sorted[middle - 1] + sorted[middle]) / 2;
            }

            return sorted[middle];
        }
        return undefined;
    }
}
