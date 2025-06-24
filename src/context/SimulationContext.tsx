import React, { createContext, useState, useCallback } from 'react';
import { runSimulation, checkCircularDependency } from '../utils/simulation';
import { v4 as uuidv4 } from 'uuid';
import { LinkType, NodeType, SimulationState } from '../types';

// Define the shape of the data needed to create a new node.
// This makes it clear what `addNode` expects.
type NewNodeData = {
    type: string;
    position: { x: number; y: number };
    logic: any; // Or a more specific function type if you have one
};

interface SimulationContextProps {
    simulation: SimulationState;
    // FIX: Changed the type of the 'node' parameter to match the actual data object being passed.
    addNode: (nodeData: NewNodeData, gateType: any) => void;
    moveNode: (nodeId: string, position: { x: number; y: number }) => void;
    removeNode: (nodeId: string) => void;
    addLink: (from: { nodeId: string; portId: string }, to: { nodeId: string; portId: string }) => void;
    toggleInputNode: (nodeId: string) => void;
}

export const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [simulation, setSimulation] = useState<SimulationState>({ nodes: {}, links: {} });

    const updateAndRunSimulation = (newSim: SimulationState) => {
        const updatedSim = runSimulation(newSim);
        setSimulation(updatedSim);
    };

    // FIX: Updated the parameter name to reflect it's data. The logic inside was already correct.
    const addNode = useCallback((nodeData: NewNodeData, gateType: any) => {
        const id = uuidv4();
        // Assuming gateType has these properties. It's good practice to type gateType as well.
        const inputs = Array.from({ length: gateType.numInPorts }, () => ({ id: uuidv4(), nodeId: id, isInput: true }));
        const outputs = Array.from({ length: gateType.numOutPorts }, () => ({ id: uuidv4(), nodeId: id, isInput: false }));

        const newNode: NodeType = {
            ...nodeData,
            id,
            inputs,
            outputs,
            state: false // Provide a default initial state
        };

        updateAndRunSimulation({
            ...simulation,
            nodes: { ...simulation.nodes, [id]: newNode },
        });
    }, [simulation]);

    // ... (rest of your provider code is fine)
    const moveNode = useCallback((nodeId: string, position: { x: number; y: number }) => {
        setSimulation(prev => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [nodeId]: { ...prev.nodes[nodeId], position },
            },
        }));
    }, []);

    const removeNode = (nodeId: string) => {
        setSimulation(prev => {
            // Create a new nodes object without the deleted node
            const newNodes = { ...prev.nodes };
            delete newNodes[nodeId];

            // Create a new links object, filtering out any that connect to the deleted node
            const newLinks = Object.values(prev.links).reduce((acc, link) => {
                if (link.from.nodeId !== nodeId && link.to.nodeId !== nodeId) {
                    acc[link.id] = link;
                }
                return acc;
            }, {} as { [id: string]: LinkType });

            return {
                ...prev,
                nodes: newNodes,
                links: newLinks,
            };
        });
    };

    const addLink = useCallback((from: { nodeId: string; portId: string }, to: { nodeId: string; portId: string }) => {
        if (checkCircularDependency(from.nodeId, to.nodeId, simulation)) {
            alert("Cannot create a circular connection.");
            return;
        }

        const id = uuidv4();
        const newLink: LinkType = { id, from, to };
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
        <SimulationContext.Provider value={{ simulation, addNode, moveNode, removeNode, addLink, toggleInputNode }}>
            {children}
        </SimulationContext.Provider>
    );
};
