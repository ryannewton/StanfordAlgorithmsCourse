// Answer: 17

console.log('Min cuts: ', MinCuts())

function MinCuts() {
  let min_cuts = Infinity
  const runs = 200

  for (let i = 0; i < runs; i++) {
    let graph = BuildGraphFromFile()
    let min_cuts_this_round = MinCutsWithRandomContractions(graph)
    console.log('min_cuts_this_round: ', min_cuts_this_round)
    min_cuts = Math.min(min_cuts, min_cuts_this_round)
  }

  return min_cuts
}

function GetTextFromFile(filename) {
  const fs = require('fs')
  const text = fs.readFileSync(`./${filename}`, 'utf-8')

  return text
}

function BuildGraphFromFile() {
  const filename = 'kargerMinCut.txt'
  const text = GetTextFromFile(filename)

  const edge_list_str = text.split('\t\r\n')

  let graph = {}
  for (let list_str of edge_list_str) {
    const adjacency_list_vals = list_str.split('\t').map(val => Number(val))
    const node = adjacency_list_vals[0]
    graph[node] = adjacency_list_vals.slice(1)
  }

  return graph
}

function MinCutsWithRandomContractions(graph) {
  let nodes = Object.keys(graph)
  if (nodes.length <= 1) return 0

  while (nodes.length > 2) {
    graph = RandomContraction(graph)
    nodes = Object.keys(graph)
  }

  const min_cuts = graph[nodes[0]].length

  return min_cuts
}

function RandomContraction(graph) {
  const nodes_to_combine = SelectRandomEdge(graph)
  const [node1, node2] = nodes_to_combine

  UpdateNeighborsAdjacencyList(graph, node1, node2)
  graph[node1] = ContractedAdjacencyList(graph, node1, node2)
  delete graph[node2]

  return graph
}

function UpdateNeighborsAdjacencyList(graph, new_node, old_node) {
  for (let old_nodes_neighbor of graph[old_node]) {
    graph[old_nodes_neighbor] = graph[old_nodes_neighbor].map(neighbor => {
      return neighbor === old_node ? new_node : neighbor
    })
  }
}

function ContractedAdjacencyList(graph, node1, node2) {
  let adjacency_list = []

  for (let neighbor of graph[node1]) {
    if (neighbor !== node1 && neighbor !== node2) {
      adjacency_list.push(neighbor)
    }
  }

  for (let neighbor of graph[node2]) {
    if (neighbor !== node1 && neighbor !== node2) {
      adjacency_list.push(neighbor)
    }
  }

  return adjacency_list
}

function SelectRandomEdge(graph) {
  const edges_list = CreateListOfEdgesFromGraph(graph)
  const random_index = Math.floor(edges_list.length * Math.random())

  return edges_list[random_index]
}

function CreateListOfEdgesFromGraph(graph) {
  const nodes = Object.keys(graph).map(node_str => Number(node_str))
  let edges = []

  for (let node of nodes) {
    for (let neighbor of graph[node]) {
      edges.push([node, neighbor])
    }
  }

  return edges
}
