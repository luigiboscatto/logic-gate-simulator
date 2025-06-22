import { values, mapValues } from 'lodash';
import { SimulationType } from '../types';

export function checkCircularDependency(fromNodeId: string, toNodeId: string, simulation: SimulationType): boolean {
  const visited = new Set<string>();
  const queue = [toNodeId];

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    if (currentNodeId === fromNodeId) {
      return true; // Circular dependency found
    }
    if (visited.has(currentNodeId)) {
      continue;
    }
    visited.add(currentNodeId);

    const outgoingLinks = values(simulation.links).filter(link => link.from.nodeId === currentNodeId);
    for (const link of outgoingLinks) {
      queue.push(link.to.nodeId);
    }
  }
  return false;
}

export function runSimulation(simulation: SimulationType): SimulationType {
  const newSimulation = {
    ...simulation,
    nodes: mapValues(simulation.nodes, node => ({ ...node, state: undefined })),
    links: mapValues(simulation.links, link => ({ ...link, state: undefined })),
  };

  const nodeQueue = values(newSimulation.nodes)
    .filter(node => node.inputs.length === 0)
    .map(node => node.id);

  const processedNodes = new Set<string>();

  while (nodeQueue.length > 0) {
    const nodeId = nodeQueue.shift()!;
    if (processedNodes.has(nodeId)) continue;

    const node = newSimulation.nodes[nodeId];
    const inputLinks = values(newSimulation.links).filter(link => link.to.nodeId === nodeId);

    if (inputLinks.some(link => typeof link.state === 'undefined')) {
      // Not all inputs are ready, put it back in the queue
      nodeQueue.push(nodeId);
      continue;
    }

    const inputValues = node.inputs.map(port => {
        const link = values(newSimulation.links).find(l => l.to.portId === port.id);
        return link?.state ?? false;
    });

    const [outputState] = node.logic(inputValues);
    node.state = outputState;

    const outputLinks = values(newSimulation.links).filter(link => link.from.nodeId === nodeId);
    for (const link of outputLinks) {
      link.state = outputState;
      nodeQueue.push(link.to.nodeId);
    }
    processedNodes.add(nodeId);
  }

  return newSimulation;
}
