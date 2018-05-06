const Iterator = require('./Iterator');

class Sum extends Iterator {
    constructor(key) {
        super();
        this._sum = 0;
        this._key = key;
    }

    /*
     * Assumes that projection is used by caller so that each record represents a numerical tuple
     * */
    next() {

        const sourceOperator = this._inputs[0],
              key = this._key;

        let done;

        while (!done) {
            const next = sourceOperator.next();
            done = next.done;
            const value = next.value;
            if (!done) {
                this._sum += value[key]
            }
        }

        return { value: this._sum, done };
    }

    close() {
    }
}

module.exports = Sum;
