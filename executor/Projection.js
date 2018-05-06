const Iterator = require('./Iterator');

class Projection extends Iterator {
    constructor(...columns) {
        super();
        this.columns = [].concat(...columns);
    }

    next() {
        const sourceOperator = this._inputs[0];

        if (!sourceOperator) return { value: void 0, done: true };

        const next = sourceOperator.next();
        next.value = this.columns[0] === '*' ? next.value : mapObject(next.value, this.columns);
        return next;
    }

    close() {

    }
}

// this only filters out columns but does not handle expressions
function mapObject(object, columns) {
    if (!object) return;

    return columns.reduce((newObj, col) => {
        newObj[col] = object[col];
        return newObj;
    }, {}) 
}

module.exports = Projection;
