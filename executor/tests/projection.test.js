const { createTree } = require('../util');
const Root = require('../Root');
const Scan = require('../Scan');
const Projection = require('../Projection');

const dummyData = require('./dummyData');

const columnSelections = [
    ['*'],
    [ 'id' ],
    [ 'year' ],
    [ 'title' ], 
    [ 'id', 'title' ],
    [ 'id', 'year' ],
    [ 'title', 'year' ]
];

describe('Projection Node', () => {
    test('if records show a select number of columns given different string column selections', () => {
        columnSelections.forEach(colSelection => {
            const results = [];
            const scan = new Scan(dummyData);
            const projection = new Projection(colSelection);

            const operators = createTree([
                projection, [
                    scan
                ]
            ]);

            const root = new Root(operators);
            root.next((tuple => results.push(tuple)));

            const expected = dummyData.map(record => {
                const filtered = {};
                colSelection.forEach(col => {
                    filtered[col] = record[col]
                })
                return colSelection[0] === '*' ? record : filtered;
            });

            expect(results).toEqual(expected);
        }); 
    });

    test.skip('if records are correctly mapped over given different mapping functions', () => {
        // Todo... Currently the Projection node only suppports column filtering.
    });
})
