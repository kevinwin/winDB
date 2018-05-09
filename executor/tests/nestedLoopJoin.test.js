const { createTree } = require('../util');
const Root = require('../Root');
const Scan = require('../Scan');
const NestedLoopJoin = require('../NestedLoopJoin');

const tableR = [
    { teacherId: 0, firstName: 'Oz', lastName: 'Onay', referredBy: 1 },
    { teacherId: 1, firstName: 'Myles', lastName: 'Byrne', referredBy: 0 },
    { teacherId: 2, firstName: 'Tyler', lastName: 'Bettilyon', referredBy: 0 },
    { teacherId: 3, firstName: 'Tom', lastName: 'Alcorn', referredBy: 5 },
    { teacherId: 4, firstName: 'Haseeb', lastName: 'Qureshi', referredBy: 1 },
    { teacherId: 5, firstName: 'Xavier', lastName: 'Shay', referredBy: 3 }
];

const tableS = [
    { courseId: 0, name: 'Databases', instructorId: 0 },
    { courseId: 1, name: 'Computer Architecture and the Hardware/Software Interface', instructorId: 0 },
    { courseId: 2, name: 'Problem Solving with Algorithms and Data Structures', instructorId: 2 },
    { courseId: 3, name: 'Computer Networking', instructorId: 2 },
    { courseId: 4, name: 'Mathematics for Computing', instructorId: 3 },
    { courseId: 5, name: 'Languages, Compilers and Interpreters', instructorId: 1 },
    { courseId: 6, name: 'Operating Systems', instructorId: 1 },
    { courseId: 7, name: 'Distributed Systems', instructorId: 1 },
    { courseId: 8, name: 'Program Interfaces, Patterns and Anti-Patterns', instructorId: 1 },
    { courseId: 9, name: 'Cryptocurrencies', instructorId: 4 },
    { courseId: 10, name: 'Engineering Leadership', instructorId: 5}
];

describe('Nested loop join node', () => {
    test('if the cross product can be returned by default', () => {
        const results = [];
        const rScan = new Scan(tableR);
        const sScan = new Scan(tableS);
        const nestedLoopJoin = new NestedLoopJoin();

        const operators = createTree([
            nestedLoopJoin, 
            [rScan], 
            [sScan]
        ]);

        const root = new Root(operators);
        root.next((tuple) => results.push(tuple));

        const expected = [];
        tableR.forEach(rTuple => {
            tableS.forEach(sTuple => {
                expected.push({ ...rTuple, ...sTuple });
            })
        })

        expect(results).toEqual(expected);
    });

    test('if an equijoin is supported', () => {
        const results = [];
        const rScan = new Scan(tableR);
        const sScan = new Scan(tableS);
        const nestedLoopJoin = new NestedLoopJoin((r, s) => r.teacherId === s.instructorId);

        const operators = createTree([
            nestedLoopJoin, 
                [rScan],
                [sScan]
        ]);

        const root = new Root(operators);
        root.next((tuple) => results.push(tuple));

        const expected = [];
        tableR.forEach(rTuple => {
            tableS.forEach(sTuple => {
                if (rTuple.teacherId === sTuple.instructorId) {
                    expected.push({ ...rTuple, ...sTuple });
                }
            });
        });

        expect(results).toEqual(expected);
    });

    test.skip('if self joins are supported', () => {
        // Todo: Add self-join support by adding aliases
        // Need to use a different key if tuples are represented as objects
    });

    test('if other random predicate join conditions are supported', () => {
        const otherRandomPredicates = [
            (r, s) => r.instructorId === s.courseId,
            (r, s) => s.name.includes(r.firstName[0].toLowerCase()),
            (r, s) => (r.teacherId + r.referredBy) > s.courseId
        ];
        otherRandomPredicates.forEach(predicate => {
            const results = [];
            const rScan = new Scan(tableR);
            const sScan = new Scan(tableS);
            const nestedLoopJoin = new NestedLoopJoin(predicate);

            const operators = createTree([
                nestedLoopJoin, 
                    [rScan],
                    [sScan]
            ]);

            const root = new Root(operators);
            root.next(tuple => results.push(tuple));

            const expected = [];
            tableR.forEach(rTuple => {
                tableS.forEach(sTuple => {
                    if (predicate(rTuple, sTuple)) {
                        expected.push({...rTuple, ...sTuple});
                    }
                });
            });

            expect(results).toEqual(expected);
        });
    });

    test.skip('if multi-way joins are supported', () => {
        // Todo: Add multi-way join support.
        // Aliases will likely be needed or some convention for reconciling the same key name when joining two tuples
    });
})
