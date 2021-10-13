import { ChopSuey } from '../ChopSuey';
test('Test ChopSuey', () => {
    expect(ChopSuey.getSubsets([1, 2]).flat()).toEqual(expect.arrayContaining([1, 2]));
});
