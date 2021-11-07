import ChopSuey from '../ChopSuey';
import Combinatorics from '../Combinatorics';
import Statistics from '../Statistics';
import Utils from '../Utils';

test('a', () => {
    expect(true).toEqual(true);
});

// const a = { a: 1 };
// const b = { b: 1 };
// const elements = [
//     9,
//     a,
//     b,
//     'world',
//     null,
//     undefined,
//     -1,
//     '11',
//     a,
//     '22',
//     'hello',
//     Infinity,
//     -Infinity,
//     b,
//     -1,
//     undefined,
//     0,
//     11,
// ];
// console.log(elements.sort((a, b) => (a < b ? -1 : 1)));

// const array = [1, 2, 3, 1, 4];
// console.log([...Combinatorics.generateHeapsPermutations(array)]);
// console.log([...Combinatorics.generateDistinctPermutations(array)]);

const array = [1, 2, 3, 1];
console.log([...Combinatorics.generatePermutationsWithRepetitions(array, 3, true)]);
