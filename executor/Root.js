class Root {
    constructor(operator, limit=Infinity) {
        this._source = operator; // operator represents the head of the linked list
        this.limit = limit;
    }

    next(perform=console.log) {
        let count = 0;
        let value, done;

        while (!done) {
            const next = this._source.next();
            done = next.done;
            value = next.value;
            if (!done && count++ < this.limit) {
                perform(value);
            } else if (done) {
                value !== void 0 && perform(value) // used in aggregation
            }
        }
    }

    close() {
        // tidy up
    }

}

module.exports = Root;
