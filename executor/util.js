// nodes could look something like this:
// [
//  new Node1(...args), [
//      new Node2(...args), [
//          new Node3(...args),
//          ],
//          [
//          new Node4(...args)
//          ]    
//      ]
// ]
function createTree(nodes) {
    if (!nodes) throw new Error('You must pass a list of nodes to create a tree.')

    for (let i = 1; i < nodes.length; i++) {
        const child = createTree(nodes[i]);
        child && nodes[0]._inputs.push(child); // only push into _inputs if child is defined because JS will increment length even when undefined is pushed
    }
    return nodes[0];
}

// Currently assumes no branching (linked list)
// Todo: branching, breadth-first
function serialize(root) {
    let node = root;
    const output = [];

    while (node) {
       const operator = [];

       operator.push(node.constructor.name.toUpperCase(), [...Object.values(node)]) 

       output.push(operator);
       node = node._inputs[0]; 
    }

    return output;
}

module.exports = {
    createTree,
    serialize,
};
