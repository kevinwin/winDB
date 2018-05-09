const Iterator = require('./Iterator');

class NestedLoopJoin extends Iterator {
    constructor(predicate=identity) {
        super();
        this._predicate = predicate;
        this._currentRNext = null;
    }

    next() {
        const rOperator = this._inputs[0];
        const sOperator = this._inputs[1];

        let rNext = this._rCurrentNext = this._rCurrentNext || rOperator.next();

        while (true) {
            let sNext, sTuple, sDone,
                rTuple = rNext.value,
                rDone = rNext.done;
                if (rDone) break;
            while (true) {
                sNext = sOperator.next();
                sTuple = sNext.value
                sDone = sNext.done;
                if (sDone) break;
                if (this._predicate(rTuple, sTuple)) {
                    rTuple = rTuple || {};
                    sTuple = sTuple || {};
                    const hasKeyValues = (Object.keys(rTuple).length + Object.keys(sTuple).length > 0);
                    return { value: hasKeyValues ? {...rTuple, ...sTuple } : void 0, done: sDone && rDone };
                }
            }

            sOperator.reset();
            rNext = this._rCurrentNext = rOperator.next();
        }

        return { value: void 0, done: true}
    }

    close() {
        // tidy up
    }
}

function identity() {
    return true;
}

module.exports = NestedLoopJoin;
