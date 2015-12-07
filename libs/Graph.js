'use strict'

const Queue = require('./PriorityQueue')
const populateMap = require('./populateMap')

class Graph {

  /**
   * Constrict the graph
   *
   * @param {object} [graph] - Nodes to initiate the graph with
   */
  constructor (graph) {
    this.graph = new Map()

    if (graph) populateMap(this.graph, graph, Object.keys(graph))
  }

  /**
   * Add a node to the graph
   *
   * @param {string} name      - Name of the node
   * @param {object} neighbors - Neighbouring nodes and cost to reach them
   */
  addNode (name, neighbors) {
    let _neighbors = new Map()

    populateMap(_neighbors, neighbors, Object.keys(neighbors))
    this.graph.set(name, _neighbors)

    return this
  }

  /**
   * Compute the shortest path between the specified nodes
   *
   * @param {string}  start     - Starting node
   * @param {string}  goal      - Node we want to reach
   * @param {object}  [options] - Options
   *
   * @param {boolean} [options.trim]    - Exclude the origin and destination nodes from the result
   * @param {boolean} [options.reverse] - Return the path in reversed order
   * @param {boolean} [options.cost]    - Also return the cost of the path when set to true
   *
   * @return {array|object} Computed path between the nodes.
   *  When `option.cost` is set to true, the returned value will be an object
   *  with keys:
   *
   *    - `Array path`: Computed path between the nodes
   *    - `Number cost`: Cost of the path
   */
  path (start, goal, options) {
    options = options || {}

    // Don't run when we don't have nodes set
    if (!this.graph.size) {
      if (options.cost) return { path: null, cost: 0 }

      return null
    }

    let frontier = new Queue()
    let previous = new Map()
    let cost = new Map()

    let paths = []
    let totalCost = 0

    // Add the starting point to the frontier, it will be the first node visited
    frontier.set(start, 0)

    findAll(this.graph, frontier.next());

    function findAll(graph, node) {
      // When the node with the lowest cost in the frontier in our goal node,
      // we can compute the path and exit the loop
      if (node.key === goal) {
        let path = [];
        // Set the total cost to the current value
        totalCost = node.priority

        let _nodeKey = node.key
        while (previous.has(_nodeKey)) {
          path.push(_nodeKey)
          totalCost += cost.get(_nodeKey)
          _nodeKey = previous.get(_nodeKey)
        }

        // Remove the first value (the goal node) if we want a trimmed result
        if (options.trim) {
          path.shift()
        } else {
          // Add the origin waypoint at the end of the array
          path = path.concat([ start ])
        }

        // Reverse the path if we don't want it reversed, so the result will be
        // from `start` to `goal`
        if (!options.reverse) {
          path = path.reverse()
        }

        // Return an object if we also want the cost
        if (options.cost) {
          paths.push({
            path: path,
            cost: totalCost
          })
        } else
          paths.push(path)

        return;
      } else {
        // Loop all the neighboring nodes
        let neighbors = graph.get(node.key) || new Map()
        neighbors.forEach(function (_cost, _node) {
          var element = { 'key': _node, 'priority': _cost };
          previous.set(_node, node.key);
          cost.set(_node, _cost);
          findAll(graph, element);
        })
      }
    }

    // Return null when no path can be found
    if (!paths.length) {
      if (options.cost) return { paths: null, cost: 0 }

      return null
    }

    return paths
  }

}

module.exports = Graph