const { createTree } = require('../util');
const Root = require('../Root');
const Scan = require('../Scan');
const Select = require('../Select');

const dummyData = require('./dummyData');

const predicates = [
    (record) => record && record.year % 2 === 0, // even year values
    (record) => record && record.year % 2 === 1, // odd year values
    (record) => record && record.title.includes('S'), // movies with 'S'
    (record) => record && (record.id === 5 || record.id === 0), // Records 0 & 5
    (record) => record && record.title === 'Troy', // no matches
    (record) => record && record.id < 5, // records 0 - 4
];

describe('Selection Node', () => {
    test('if records are correctly filtered based on different predicates', () => {
        predicates.forEach(predicate => {
            const results = [];
            const scan = new Scan(dummyData);
            const select = new Select(predicate);

            const operators = createTree([
                select, [
                    scan
                ]
            ]);

            const root = new Root(operators);
            root.next((tuple) => results.push(tuple));

            const expected = dummyData.filter(predicate);
            expect(results).toEqual(expected);
        });
    })
});
