import { values, mapValues, cloneDeep } from 'lodash';
import { SimulationState } from '../types';

/**
 * Verifica se a adição de um link criaria uma dependência circular.
 * Essencial para evitar que o usuário crie circuitos inválidos.
 * @param fromNodeId O nó de origem do link.
 * @param toNodeId O nó de destino do link.
 * @param simulation O estado atual da simulação.
 * @returns `true` se um ciclo for detectado, `false` caso contrário.
 */
export function checkCircularDependency(fromNodeId: string, toNodeId: string, simulation: SimulationState): boolean {
  const visited = new Set<string>();
  const queue = [toNodeId];

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    if (currentNodeId === fromNodeId) {
      return true; // Dependência circular encontrada
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

/**
 * Executa a simulação lógica usando um algoritmo de ordenação topológica.
 * Isso garante que os nós sejam avaliados na ordem correta de dependência.
 * @param simulation O estado atual da simulação a ser executado.
 * @returns Um novo objeto de estado da simulação com os estados dos nós e links atualizados.
 */
export function runSimulation(simulation: SimulationState): SimulationState {
  const sim = cloneDeep(simulation);
  const { nodes, links } = sim;

  const adj: { [key: string]: string[] } = mapValues(nodes, () => []);
  const inDegree: { [key: string]: number } = mapValues(nodes, () => 0);

  for (const link of values(links)) {
    if (!adj[link.from.nodeId].includes(link.to.nodeId)) {
      adj[link.from.nodeId].push(link.to.nodeId);
      inDegree[link.to.nodeId]++;
    }
  }

  const queue = Object.keys(nodes).filter(nodeId => inDegree[nodeId] === 0);
  const executionOrder: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    executionOrder.push(nodeId);

    for (const neighborId of adj[nodeId]) {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) {
        queue.push(neighborId);
      }
    }
  }

  if (executionOrder.length !== Object.keys(nodes).length) {
    console.warn("Foi detectado um ciclo no circuito. Alguns nós podem não ser avaliados.");
  }

  for (const nodeId of executionOrder) {
    const node = nodes[nodeId];
    if (!node) continue;

    if (node.type === 'INPUT') {
      continue;
    }

    const inputValues = node.inputs.map(port => {
      const incomingLink = values(links).find(l => l.to.portId === port.id);
      if (!incomingLink) {
        return false;
      }
      const sourceNode = nodes[incomingLink.from.nodeId];
      return sourceNode.state ?? false;
    });

    if (node.type === 'OUTPUT') {
      node.state = inputValues[0] ?? false;
    } else {
      const outputStates = node.logic(inputValues);
      node.state = outputStates[0];
    }
  }

  for (const link of values(links)) {
    const sourceNode = nodes[link.from.nodeId];
    link.state = sourceNode.state;
  }

  return sim;
}
