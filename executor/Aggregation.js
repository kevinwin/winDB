const Sum = require('./Sum');
const Average = require('./Average');

class Aggregation {
    constructor(key, aggregationType) {
        this._aggregationNodeMap = {
            sum: Sum,
            average: Average
        };
        this._aggregationNode = new this._aggregationNodeMap[aggregationType](key);
        this._inputs = this._aggregationNode._inputs;
    }

    // Todo: Generalize the logic contained in all aggregation nodes instead of calling aggregation nodes, Use a function to determine what should be done with incoming values. Use a function to determine once iteration is done. These function will be called based on argument passed to Aggregation node.
    next() {
        return this._aggregationNode.next();
    }

    close() {
        // tidy up
    }
}

module.exports = Aggregation;
