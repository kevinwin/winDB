const Iterator = require('./Iterator');

// Todo: Explore out-of-core sorting
class Sort extends Iterator {
    constructor(key, descending=false) {
        super();
        this._records = [];        
        this._key = key;
        this._isFirstPass = true;
        this._sortMap = {
            string: compareStrings.bind(this, key, descending),
            number: compareNums.bind(this, key, descending)
        };
        this._recordsIndex = 0;
    }

    next() {
        const sourceOperator = this._inputs[0];
        const key = this._key;

        if (this._isFirstPass) {
            let done;

            while (!done) {
                const next = sourceOperator.next();
                done = next.done;
                const value = next.value;

                this._records.push(value);
            }

            const type = typeof this._records[0][key];
            const handleSort = this._sortMap[type];
            
            this._records = this._records.slice().sort(handleSort);

            this._isFirstPass = false;
        }


        const currentIndex = this._recordsIndex++;

        return this._recordsIndex < this._records.length ? { value: this._records[currentIndex], done: false } : { value: void 0, done: true }
    }

    close() {

    }
}

function compareNums(key, descending, a, b) {
    a = a[key];
    b = b[key];
    return descending ? b - a : a - b;
}

function compareStrings(key, descending, a, b) {
    a = a[key].toLowerCase();
    b = b[key].toLowerCase();

    if (descending) {
        if (b < a) {
            return -1
        }
        if (b > a) {
            return 1;
        }
    } else {
        if (a < b) {
            return -1;
        } 
        if (a > b) {
            return 1;
        }
    }
    return 0;
}

module.exports = Sort;
