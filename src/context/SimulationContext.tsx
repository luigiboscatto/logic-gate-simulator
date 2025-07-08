import React, { createContext, useState, useCallback } from 'react';
import { runSimulation, checkCircularDependency } from '../utils/simulation';
import { v4 as uuidv4 } from 'uuid';
import { LinkType, NodeType, SimulationState } from '../types';

type NewNodeData = {
    type: string;
    position: { x: number; y: number };
    logic: any;
};

interface SimulationContextProps {
    simulation: SimulationState;
    addNode: (nodeData: NewNodeData, gateType: any) => void;
    moveNode: (nodeId: string, position: { x: number; y: number }) => void;
    removeNode: (nodeId: string) => void;
    addLink: (from: { nodeId: string; portId: string }, to: { nodeId: string; portId: string }) => void;
    toggleInputNode: (nodeId: string) => void;
    highlightedNodeId: string | null;
    setHighlightedNodeId: (nodeId: string | null) => void;
}

export const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [simulation, setSimulation] = useState<SimulationState>({ nodes: {}, links: {} });
    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

    const updateAndRunSimulation = (newSim: SimulationState) => {
        const updatedSim = runSimulation(newSim);
        setSimulation(updatedSim);
    };

    const addNode = useCallback((nodeData: NewNodeData, gateType: any) => {
        const id = uuidv4();
        const inputs = Array.from({ length: gateType.numInPorts }, () => ({ id: uuidv4(), nodeId: id, isInput: true }));
        const outputs = Array.from({ length: gateType.numOutPorts }, () => ({ id: uuidv4(), nodeId: id, isInput: false }));

        const newNode: NodeType = {
            ...nodeData,
            id,
            inputs,
            outputs,
            state: false
        };

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

    const removeNode = (nodeId: string) => {
        setSimulation(prev => {
            const newNodes = { ...prev.nodes };
            delete newNodes[nodeId];

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
        <SimulationContext.Provider value={{
            simulation,
            addNode,
            moveNode,
            removeNode,
            addLink,
            toggleInputNode,
            highlightedNodeId,
            setHighlightedNodeId
        }}>
            {children}
        </SimulationContext.Provider>
    );
};
