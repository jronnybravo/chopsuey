import Utils from '../Utils';

// test `Utils.areArraysEqual` function
(() => {
    const testItemFlags = {
        EQUAL: 1,
        STRICTLY_EQUAL: 2,
        ABSTRACTLY_EQUAL: 4,
        ORDERED: 8,
        UNORDERED: 16,
    };

    const LABEL_ORDER_NOT_REQUIRED = 'order not required';
    const LABEL_ABSTRACT_EQUALITY_CALLBACK = 'abstract equality checking';

    function getExpected(
        testItemFlag: number | null,
        orderParameterLabel: string,
        equalityCallbackLabel: string,
    ): boolean {
        if (testItemFlag === null) {
            return false;
        } else if (testItemFlag & testItemFlags.EQUAL) {
            if (testItemFlag & testItemFlags.STRICTLY_EQUAL) {
                if (testItemFlag & testItemFlags.ORDERED) {
                    return true;
                } else {
                    return orderParameterLabel == LABEL_ORDER_NOT_REQUIRED;
                }
            } else if (testItemFlag & testItemFlags.ABSTRACTLY_EQUAL) {
                let result = equalityCallbackLabel == LABEL_ABSTRACT_EQUALITY_CALLBACK;
                if (testItemFlag & testItemFlags.ORDERED) {
                    return result;
                } else {
                    return result && orderParameterLabel == LABEL_ORDER_NOT_REQUIRED;
                }
            }
        }

        return false;
    }

    const testItems = [
        {
            values: [
                [1, 2, 3, 4],
                [2, 2, 3, 4],
            ],
            flag: null,
        },
        {
            values: [
                [1, 2, 3, 4],
                [1, 2, 3, 4],
            ],
            flag: testItemFlags.EQUAL | testItemFlags.STRICTLY_EQUAL | testItemFlags.ORDERED,
        },
        {
            values: [
                [1, 2, 3, 4],
                [2, 1, 3, 4],
            ],
            flag: testItemFlags.EQUAL | testItemFlags.STRICTLY_EQUAL | testItemFlags.UNORDERED,
        },
        {
            values: [
                ['1', '2', 3, 4],
                [1, '2', 3, '4'],
            ],
            flag: testItemFlags.EQUAL | testItemFlags.ABSTRACTLY_EQUAL | testItemFlags.ORDERED,
        },
        {
            values: [
                [1, '2', '3', 4],
                [2, '1', '3', 4],
            ],
            flag: testItemFlags.EQUAL | testItemFlags.ABSTRACTLY_EQUAL | testItemFlags.UNORDERED,
        },
    ];

    const orderParameterValues = [
        {
            value: true,
            label: 'order required',
        },
        {
            value: false,
            label: LABEL_ORDER_NOT_REQUIRED,
        },
    ];
    const equalityCallbackItems = [
        {
            value: undefined,
            label: 'strict equality checking',
        },
        {
            value: function <T>(a: T, b: T): boolean {
                return a == b;
            },
            label: LABEL_ABSTRACT_EQUALITY_CALLBACK,
        },
    ];

    for (let testItem of testItems) {
        for (let orderParameter of orderParameterValues) {
            for (let equalityCallback of equalityCallbackItems) {
                test('a', () => {
                    const result = Utils.areArraysEqual(
                        testItem.values[0],
                        testItem.values[1],
                        orderParameter.value,
                        equalityCallback.value,
                    );
                    const expectedResult = getExpected(testItem.flag, orderParameter.label, equalityCallback.label);
                    expect(result).toEqual(expectedResult);
                });
            }
        }
    }
})();
