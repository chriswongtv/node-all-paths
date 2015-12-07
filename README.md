# node-all-paths

> JavaScript implementation to find all possible paths in a graph

## Installation

This plugin uses some ES6 features. You can run the latest version on **NodeJS `v4.0.0` or newer**

```shell
npm install node-all-paths --save
```

## Usage

Basic example:

```js
const Graph = require('node-all-paths')

const graph = new Graph()

graph.addNode('A', { B:1 });
graph.addNode('B', { C:2, D: 4 });
graph.addNode('C', { D:1 });
graph.addNode('D', { });

route.path('A', 'D') // => [ [ "A", "B", "C", "D" ], [ "A", "B", "D" ] ]
```

## API

### `Graph([nodes])`

#### Parameters

- `Object nodes` _optional_: Initial nodes graph.

A nodes graph must follow this structure:

```
{
  node: {
    neighbor: cost Number
  }
}
```

```js
{
  'A': {
    'B': 1
  },
  'B': {
    'C': 2,
    'D': 4
  }
}
```

#### Example

```js
const route = new Graph()

// or with pre-populated graph
const route = new Graph({
  'A': { 'B': 1 },
  'B': { 'A': 1, 'C': 2, 'D': 4 }
})
```



### `Graph#addNode(name, edges)`

Add a node to the nodes graph

#### Parameters

- `String name`: name of the node
- `Object edges`: object containing the name of the neighboring nodes and their cost

#### Returns

Returns `this` allowing chained calls.

```js
const route = new Graph()

route.addNode('A', { B: 1 })

// chaining is possible
route.addNode('B', { C: 3 }).addNode('C', { });
```

### `Graph#path(start, goal [, options])`

#### Parameters

- `String start`: Name of the starting node
- `String goal`: Name of out goal node
- `Object options` _optional_: Addittional options:
  - `Boolean trim`, deafult `false`: If set to true, the result won't include the start and goal nodes
  - `Boolean reverse`, default `false`: If set to true, the result will be in reverse order, from goal to start
  - `Boolean cost`, default `false`: If set to true, an object will be returned with the following keys:
    - `Array path`: Computed path (subject to other options)
    - `Number cost`: Total cost for the found path

#### Returns

If `options.cost` is `false` (default behaviour) an `Array` will be returned, containing the name of the crossed nodes. By default it will be ordered from start to goal, and those nodes will also be included. This behaviour can be changes with `options.trim` and `options.reverse` (see above)

If `options.cost` is `true`, an `Object` with keys `path` and `cost` will be returned. `path` follows the same rules as above and `cost` is the total cost of the found route between nodes.

When to route can be found, the path will be set to `null`.

```js
const Graph = require('node-all-paths')

const route = new Graph()

route.addNode('A', { B:1 });
route.addNode('B', { C:2, D: 4 });
route.addNode('C', { D:1 });
route.addNode('D', { });

route.path('A', 'D') // => [ [ "A", "B", "C", "D" ], [ "A", "B", "D" ] ]

// trimmed
route.path('A', 'D', { trim: true }) // => [ [ "B", "C" ], [ "B" ] ]

// reversed
route.path('A', 'D', { reverse: true }) // => [ [ "D", "C", "B", "A" ], [ "D", "B", "A" ] ]

// include the cost
route.path('A', 'D', { cost: true })
// => [
//      {
//        "path": [
//          "A",
//          "B",
//          "C",
//          "D"
//        ],
//        "cost": 1
//      },
//      {
//        "path": [
//          "A",
//          "B",
//          "D"
//        ],
//        "cost": 4
//      }
//    ]
```

[1]: https://github.com/andrewhayward/dijkstra
[2]: https://github.com/albertorestifo/node-dijkstra