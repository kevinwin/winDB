const Iterator = require('./Iterator');

class Select extends Iterator {
    constructor(testFn) {
        super();
        this.testFn = testFn;
    }

    next() {
        // use next operator in _inputs array as source 
        let value, done;
        const sourceOperator = this._inputs[0];

        // return if sourceOperator is undefined for some reason
        if (!sourceOperator) return { value: void 0, done: true };

        // iterate until testFn passes or we are done
        do {
            const next = sourceOperator.next();
            value = next.value;
            done = next.done;
            if (this.testFn(value)) {
                return { value, done };
            }
        } while (!done)

        return { value: void 0, done: true }
    }

    close() {
        // clean up
    }
}

module.exports = Select;
