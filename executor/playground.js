const Scan = require('./Scan');
const Sort = require('./Sort');
const Distinct = require('./Distinct');
const Select = require('./Select');
const Aggregation = require('./Aggregation');
const Projection = require('./Projection');
const Count = require('./Count');
const Root = require('./Root');
const { createTree, serialize } = require('./util');

const data = [
    { id: 0, name: 'Oz', points: 8 },
    { id: 2, name: 'Thuongvu', points: 4 },
    { id: 1, name: 'Rachel', points: 6 },
    { id: 2, name: 'Thuongvu', points: 4 },
    { id: 3, name: 'Sam', points: 7 },
    { id: 4, name: 'Danny', points: 3 },
    { id: 5, name: 'Kevin', points: 7 },
    { id: 6, name: 'Phillip', points: 9 },
    { id: 0, name: 'Oz', points: 8 },
    { id: 2, name: 'Thuongvu', points: 4 },
    { id: 7, name: 'Christina', points: 10 },
    { id: 8, name: 'JJ', points: 8 },
    { id: 4, name: 'Danny', points: 3 },
];

const key = 'points';

const scan = new Scan(data);
const sort = new Sort(key, true);
const sum = new Aggregation(key, 'sum')
const average = new Aggregation(key, 'average');
const select = new Select((item) => item && item.id < 3);
const projection = new Projection('*');
const count = new Count();
const distinct = new Distinct();

const operators = createTree([
    distinct, [
        sort, [
            projection, [
                select, [
                    scan
                ]
            ]
        ]
    ]
])

const root = new Root(operators);

root.next();

