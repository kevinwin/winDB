const Iterator = require('./Iterator');

class Count extends Iterator {
    constructor() {
        super();
        this._count = 0;
    }

    next() {

        const sourceOperator = this._inputs[0];

        let done;

        while (!done) {
            const next = sourceOperator.next();
            done = next.done;
            const value = next.value;
            !done && this._count++;
        }

        return { value: this._count, done };
    }

    close() {
    }
}

module.exports = Count;
