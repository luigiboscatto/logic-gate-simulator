import React, { createContext, useState, useCallback } from 'react';
import { Simulation, Node, Link } from '../types';
import { runSimulation, checkCircularDependency } from '../utils/simulation';
import { v4 as uuidv4 } from 'uuid';

interface SimulationContextProps {
  simulation: Simulation;
  addNode: (node: Omit<Node, 'id' | 'inputs' | 'outputs'>, gateType: any) => void;
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;
  addLink: (from: { nodeId: string; portId: string }, to: { nodeId: string; portId: string }) => void;
  toggleInputNode: (nodeId: string) => void;
}

export const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simulation, setSimulation] = useState<Simulation>({ nodes: {}, links: {} });

  const updateAndRunSimulation = (newSim: Simulation) => {
    const updatedSim = runSimulation(newSim);
    setSimulation(updatedSim);
  };

  const addNode = useCallback((node: Omit<Node, 'id' | 'inputs' | 'outputs'>, gateType: any) => {
    const id = uuidv4();
    const inputs = Array.from({ length: gateType.numInPorts }, (_, i) => ({ id: uuidv4(), nodeId: id, isInput: true }));
    const outputs = Array.from({ length: gateType.numOutPorts }, (_, i) => ({ id: uuidv4(), nodeId: id, isInput: false }));

    const newNode: Node = { ...node, id, inputs, outputs };

    updateAndRunSimulation({
      ...simulation,
      nodes: { ...simulation.nodes, [id]: newNode },
    });
  }, [simulation]);

  const moveNode = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setSimulation(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: { ...prev.nodes[nodeId], position },
      },
    }));
  }, []);

  const addLink = useCallback((from: { nodeId: string; portId: string }, to: { nodeId: string; portId: string }) => {
    if (checkCircularDependency(from.nodeId, to.nodeId, simulation)) {
      alert("Cannot create a circular connection.");
      return;
    }
    
    const id = uuidv4();
    const newLink: Link = { id, from, to };
    updateAndRunSimulation({
      ...simulation,
      links: { ...simulation.links, [id]: newLink },
    });
  }, [simulation]);

  const toggleInputNode = useCallback((nodeId: string) => {
    const node = simulation.nodes[nodeId];
    if (node.type === 'INPUT') {
      const newState = !node.state;
      const newLogic = () => [newState];
      const updatedNode = { ...node, state: newState, logic: newLogic };
      updateAndRunSimulation({
        ...simulation,
        nodes: { ...simulation.nodes, [nodeId]: updatedNode },
      });
    }
  }, [simulation]);

  return (
    <SimulationContext.Provider value={{ simulation, addNode, moveNode, addLink, toggleInputNode }}>
      {children}
    </SimulationContext.Provider>
  );
};
