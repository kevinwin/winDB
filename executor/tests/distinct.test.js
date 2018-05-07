const { createTree } = require('../util');

const Root = require('../Root');
const Distinct = require('../Distinct');
const Sort = require('../Sort');
const Scan = require('../Scan');

const dummyData = [
    { id: 0, year: 1995, title: 'Toy Story', rating: 4.5 },
    { id: 1, year: 1995, title: 'Jumanji', rating: 4 },
    { id: 3, year: 2010, title: 'What Men Talk About', rating: 2 },
    { id: 2, year: 2014, title: 'Brother Bear 2', rating: 3 },
    { id: 0, year: 1995, title: 'Toy Story', rating: 4.5 },
    { id: 3, year: 2010, title: 'What Men Talk About', rating: 2 },
    { id: 6, year: 2015, title: 'The Big Short', rating: 4.8 },
    { id: 4, year: 2015, title: 'Dead Rising: Watchtower', rating: 1 },
    { id: 2, year: 2014, title: 'Brother Bear 2', rating: 3 },
    { id: 5, year: 2018, title: 'Avengers: Infinity War', rating: 5 },
    { id: 5, year: 2018, title: 'Avengers: Infinity War', rating: 5 },
    { id: 6, year: 2015, title: 'The Big Short', rating: 4.8 },
    { id: 7, year: 2016, title: 'Your Name', rating: 3.8 },
    { id: 8, year: 2001, title: 'Spirited Away', rating: 4.6 },
    { id: 9, year: 2016, title: 'Silent Voice', rating: 5 },
    { id: 7, year: 2016, title: 'Your Name', rating: 3.8 },
];

const isEqual = require('lodash.isequal');

describe('Distinct node', () => {
    test('if only unique records can be returned', () => {
        const results = [];
        const key = 'id';

        const scan = new Scan(dummyData);
        const sort = new Sort(key);
        const distinct = new Distinct();

        const operators = createTree([
            distinct, [
                sort, [
                    scan
                ]
            ]
        ]);

        const root = new Root(operators);
        root.next((tuple) => results.push(tuple));

        let lastSeen = void 0;
        const expected = dummyData.slice().sort((a, b) => a[key] - b[key]).filter(tuple => {
            if (!isEqual(lastSeen, tuple)) {
                lastSeen = tuple;
                return tuple;
            }

            return false;
        });

        expect(results).toEqual(expected);
    });

    test('if duplicate records appear if the input data is not sorted', () => {
        const results = [];

        const scan = new Scan(dummyData);
        const distinct = new Distinct();

        const operators = createTree([
            distinct, [
                scan
            ]
        ]);

        const root = new Root(operators);
        root.next((tuple) => results.push(tuple));

        let lastSeen = void 0;
        const expected = dummyData.filter(tuple => {
            if (!isEqual(lastSeen, tuple)) {
                lastSeen = tuple;
                return tuple;
            }

            return false;
        });

        expect(results).toEqual(expected);
    });
})
