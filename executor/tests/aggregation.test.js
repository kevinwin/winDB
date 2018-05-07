const { createTree } = require('../util');

const Root = require('../Root');
const Scan = require('../Scan');
const Select = require('../Select');
const Projection = require('../Projection');
const Count = require('../Count');
const Sum = require('../Sum');
const Average = require('../Average');

const dummyData = require('./dummyData');
const key = 'rating';

const predicates = [
    (record) => record && record.year % 2 === 0, // even year values
    (record) => record && record.year % 2 === 1, // odd year values
    (record) => record && record.title.includes('S'), // movies with 'S'
    (record) => record && (record.id === 5 || record.id === 0), // Records 0 & 5
    (record) => record && record.title === 'Troy', // no matches
    (record) => record && record.id < 5, // records 0 - 4
];

let root, scan, select, projection, count, sum, average;

describe('Aggregation nodes', () => {
    describe('Count node', () => {
        test('if all records can be counted', () => {
            const results = []
            scan = new Scan(dummyData);
            count = new Count();

            const operators = createTree([
                count, [
                    scan
                ]
            ]);

            root = new Root(operators);
            root.next((tuple) => results.push(tuple));

            const expected = [dummyData.length];
            expect(results).toEqual(expected);
        });

        test('if selected records can be counted', () => {
            predicates.forEach(predicate => {
                const results = [];
                const scan = new Scan(dummyData);
                const select = new Select(predicate);
                const count = new Count();

                const operators = createTree([
                    count, [
                        select, [
                            scan
                        ]
                    ]
                ]);

                const root = new Root(operators);
                root.next(tuple => results.push(tuple));

                const expected = [dummyData.filter(predicate).length]
                expect(results).toEqual(expected);
            })
        });
    });

    describe('Sum node', () => {
        test('if all records can be summed', () => {
            const results = []
            projection = new Projection(key);
            scan = new Scan(dummyData);
            sum = new Sum(key);

            const operators = createTree([
                sum, [
                    projection, [
                        scan
                    ]
                ]
            ]);

            root = new Root(operators);
            root.next((tuple) => results.push(tuple));

            const expectedSum = dummyData.reduce((sum, record) => {
                return sum + record[key];
            }, 0);

            const expected = [expectedSum];
            expect(results).toEqual(expected);
        });

        test('if selected records can be summed', () => {
            predicates.forEach(predicate => {
                const results = []
                scan = new Scan(dummyData);
                select = new Select(predicate);
                projection = new Projection(key);
                sum = new Sum(key);

                const operators = createTree([
                    sum, [
                        projection, [
                            select, [
                                scan
                            ]
                        ]
                    ]
                ]);

                root = new Root(operators);
                root.next((tuple) => results.push(tuple));

                const expectedSum = dummyData.filter(predicate).reduce((sum, record) => {
                    return sum + record[key];
                }, 0);

                const expected = [expectedSum];
                expect(results).toEqual(expected);

            });


        });
    });

    describe('Average node', () => {
        test('if all records can be averaged', () => {
            const results = [];
            scan = new Scan(dummyData);
            projection = new Projection(key);
            average = new Average(key);

            const operators = createTree([
                average, [
                    projection, [
                        scan
                    ]
                ]
            ]);

            root = new Root(operators);
            root.next((tuple) => results.push(tuple));

            const expectedSum = dummyData.reduce((sum, record) => {
                return sum + record[key];
            }, 0);

            const expectedAverage = expectedSum / dummyData.length;

            const expected = [expectedAverage];
            expect(results).toEqual(expected);
        });

        test('if selected records can be averaged', () => {
            predicates.forEach(predicate => {
                const results = [];
                scan = new Scan(dummyData);
                select = new Select(predicate);
                projection = new Projection(key);
                average = new Average(key);

                const operators = createTree([
                    average, [
                        projection, [
                            select, [
                                scan
                            ]
                        ]
                    ]
                ]);

                root = new Root(operators);
                root.next((tuple) => results.push(tuple));

                const filteredData = dummyData.filter(predicate);

                const expectedSum = filteredData.reduce((sum, record) => {
                    return sum + record[key];
                }, 0);

                const expectedAverage = expectedSum / filteredData.length;

                const expected = [expectedAverage];
                expect(results).toEqual(expected);

            })
        })
    });
})
