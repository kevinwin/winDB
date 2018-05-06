class Root {
    constructor(operator, limit=Infinity) {
        this._source = operator; // operator represents the head of the linked list
        this.limit = limit;
    }

    next() {
        return this._source.next();
    }

    close() {
        // tidy up
    }

}

module.exports = Root;
