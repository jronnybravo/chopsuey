export default class Utils {
    public static areArraysEqual<T>(
        arrayA: T[],
        arrayB: T[],
        ordered: boolean = true,
        equalityCallback: (valueA: T, valueB: T) => boolean = (valueA, valueB) => valueA === valueB,
    ): boolean {
        if (arrayA.length !== arrayB.length) {
            return false;
        }

        if (ordered) {
            for (let i = 0; i < arrayA.length; i++) {
                if (!equalityCallback(arrayA[i], arrayB[i])) {
                    return false;
                }
            }
            return true;
        }

        const checkedJIndices = new Set();
        for (const valueA of arrayA) {
            let hasEqual = false;
            for (let j = 0; j < arrayB.length; j++) {
                if (checkedJIndices.has(j)) {
                    continue;
                }
                if (equalityCallback(valueA, arrayB[j])) {
                    hasEqual = true;
                    checkedJIndices.add(j);
                    break;
                }
            }
            if (!hasEqual) {
                return false;
            }
        }
        return true;
    }
}
