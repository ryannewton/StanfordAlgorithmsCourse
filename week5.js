// Answer:

const filename = 'SCC_small.txt'
const graph = BuildDirectedGraph()
const SCCs_nodes_list = GetListOfSCCsNodes(graph)
console.log('SCCs_nodes_list: ', SCCs_nodes_list)
console.log('The 5 largest SCCs are of size: ', GetSizeOfLargestSCCs(SCCs_nodes_list, 5))

function GetSizeOfLargestSCCs(SCC_nodes_list, count = 1) {
  let SCC_sizes = []
  for (let SCC_nodes of SCC_nodes_list) {
    SCC_sizes.push(SCC_nodes.length)
  }

  SCC_sizes.sort((a, b) => b - a)

  return SCC_sizes.slice(0, count)
}

function GetListOfSCCsNodes(graph) {
  const ordering_of_nodes = ComputeOrderingOfNodes(graph)
  const SCCs_nodes_list = ComputeSCCsGivenOrdering(graph, ordering_of_nodes)

  return SCCs_nodes_list
}

function ComputeSCCsGivenOrdering(graph, ordering_of_nodes) {
  let current_source_node = null
  let explored_nodes = new Set()
  let SCCs_nodes_by_source_node = {}
  let SCCs_nodes_list = []
  const number_of_nodes = ordering_of_nodes.length

  for (let i = number_of_nodes - 1; i >= 0; i--) {
    const node = ordering_of_nodes[i]
    if (!explored_nodes.has(node)) {
      current_source_node = node
      SCCs_nodes_by_source_node[current_source_node] = []
      DFS(node)
    }
  }

  function DFS(node) {
    explored_nodes.add(node)
    SCCs_nodes_by_source_node[current_source_node].push(node)

    if (graph[node] == undefined) return

    for (let tail_node of graph[node]) {
      if (!explored_nodes.has(tail_node)) {
        DFS(tail_node)
      }
    }
  }

  for (let source_nodes of Object.keys(SCCs_nodes_by_source_node)) {
    SCCs_nodes_list.push(SCCs_nodes_by_source_node[source_nodes])
  }

  return SCCs_nodes_list
}

function ComputeOrderingOfNodes(graph) {
  const graph_rev = BuildReverseGraph(graph)
  const nodes_random_order = GetNodes(graph)
  const nodes_count = nodes_random_order.length
  let explored_nodes = new Set()

  let nodes_order = []

  for (let index = nodes_count - 1; index >= 0; index--) {
    const node = nodes_random_order[index]
    if (!explored_nodes.has(node)) {
      DFS(node)
    }
  }

  function DFS(node) {
    explored_nodes.add(node)
    if (graph_rev[node] == undefined) return

    for (let neighbor of graph_rev[node]) {
      if (!explored_nodes.has(neighbor)) {
        DFS(neighbor)
      }
    }

    nodes_order.push(node)
  }

  return nodes_order
}

function BuildReverseGraph(graph) {
  let graph_rev = {}
  const head_nodes = Object.keys(graph).map(val => Number(val))

  for (let head_node of head_nodes) {
    let tail_nodes = graph[head_node]
    for (let tail_node of tail_nodes) {
      if (graph_rev[tail_node] == undefined) graph_rev[tail_node] = []
      graph_rev[tail_node].push(head_node)
    }
  }

  return graph_rev
}

function GetNodes(graph) {
  let nodes = new Set()
  let head_nodes = Object.keys(graph).map(val => Number(val))

  for (let head_node of head_nodes) {
    if (!nodes.has(head_node)) {
      nodes.add(head_node)
    }

    for (let tail_node of graph[head_node]) {
      if (!nodes.has(tail_node)) {
        nodes.add(tail_node)
      }
    }
  }

  return Array.from(nodes)
}

function BuildDirectedGraph() {
  const text = GetTextFromFile(filename)
  const edges_list_as_strs = text.split(' \n')
  const edges_list = edges_list_as_strs.map(pair_str => {
    return pair_str.split(' ').map(val => Number(val))
  })

  let graph = {}
  for (let edge of edges_list) {
    const [head, tail] = edge
    if (graph[head] == undefined) graph[head] = []
    graph[head].push(tail)
  }

  return graph
}

function GetTextFromFile(filename) {
  const fs = require('fs')
  const text = fs.readFileSync(`./${filename}`, 'utf-8')

  return text
}
