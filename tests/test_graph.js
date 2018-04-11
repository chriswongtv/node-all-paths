'use strict';

const Graph = require('../libs/Graph');

let graph = new Graph();

graph.addNode('A', {'B': 1, 'D': 1, 'E': 1});
graph.addNode('B', {'C': 1, 'D': 1});
// create a closed path: C -> A
graph.addNode('C', {'D': 1, 'A': 1});
graph.addNode('E', {'F': 1});
graph.addNode('F', {'D': 1});

// [ [ 'A', 'B', 'D' ], [ 'A', 'D' ] ]
graph.path('A', 'D', {depth: 2});

// [ [ 'A', 'B', 'C', 'D' ], [ 'A', 'B', 'D' ], [ 'A', 'D' ], [ 'A', 'E', 'F', 'D' ] ]
graph.path('A', 'D', {depth: 3});