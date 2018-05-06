const Iterator = require('./Iterator');

class Average extends Iterator {
    constructor(key) {
        super();
        this._sum = 0;
        this._count = 0;
        this._key = key;
    }

    /*
     * Assumes that projection is used by caller so that each record represents a numerical tuple
     * */
    next() {

        const sourceOperator = this._inputs[0],
              key = this._key;

        let value, done;

        while (!done) {
            const next = sourceOperator.next();
            done = next.done;
            value = next.value;
            if (!done) {
                this._count++
                this._sum += value[key]
            }
        }

        const average = this._sum / this._count;

        return { value: average, done };
    }

    close() {
    }
}

module.exports = Average;
