class Iterator {
    constructor() {
        this._inputs = [];
    }

    reset() {
        this._inputs.forEach(operator => operator.reset());
    }
    
}

module.exports = Iterator;
