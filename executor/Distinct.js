const Iterator = require('./Iterator');
const isEqual = require('lodash.isequal');

class Distinct extends Iterator {
    constructor() {
        super();
        this._prev = null;
    }

    next() {
        let value, done;
        const sourceOperator = this._inputs[0];

        while (!done) {
            const next = sourceOperator.next();
            value = next.value;
            done = next.done;
            if (!isEqual(value, this._prev)) {
                this._prev = value;
                return { value, done }
            }
        }

        return { value: void 0, done: true };
    }

    close() {
        // tidy up
    }
}

module.exports = Distinct;
