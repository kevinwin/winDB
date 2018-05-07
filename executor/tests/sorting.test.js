const { createTree } = require('../util');

const Root = require('../Root');
const Scan = require('../Scan');
const Sort = require('../Sort');

const dummyData = require('./dummyData');

let key;

describe('Sort node', () => {
    test('if all records can be sorted numerically', () => {
        key = 'rating'
        const results = [];
        const scan = new Scan(dummyData);
        const sort = new Sort(key)

        const operators = createTree([
            sort, [
                scan
            ]
        ]);

        const root = new Root(operators);
        root.next(tuple => results.push(tuple));

        const expected = dummyData.slice().sort((a, b) => a[key] - b[key]);
        expect(results).toEqual(expected);
    })

    test('if all records are sorted lexicographically', () => {
        key = 'title'
        const results = [];
        const scan = new Scan(dummyData);
        const sort = new Sort(key)

        const operators = createTree([
            sort, [
                scan
            ]
        ]);

        const root = new Root(operators);
        root.next(tuple => results.push(tuple));

        const expected = dummyData.slice().sort((a, b) => {
            a = a[key].toLowerCase();
            b = b[key].toLowerCase();
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
        expect(results).toEqual(expected);
    })
})
