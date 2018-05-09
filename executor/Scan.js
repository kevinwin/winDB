const Iterator = require('./Iterator');

class Scan extends Iterator {
    constructor(data) {
        super();
        this._records = data; // [tuple1, tuple2, tuple3]
        this._recordsIterator = this._records[Symbol.iterator]();
    }

    next() {
        return this._recordsIterator.next();
    }

    close() {
        // clean up
    }

    reset() {
        this._recordsIterator = this._records[Symbol.iterator]();
    }
}

module.exports = Scan;
