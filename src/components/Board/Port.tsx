import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSimulation } from '../../hooks/useSimulation';
import { ItemTypes, PortType } from '../../types';

interface PortProps {
    port: PortType;
    isInput: boolean;
    index: number;
    count: number;
}

export const Port: React.FC<PortProps> = ({ port, isInput, index, count }) => {
    const { addLink } = useSimulation();

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PORT,
        item: { portId: port.id, nodeId: port.nodeId, isInput },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [port.id, port.nodeId, isInput]);

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.PORT,
        drop: (item: { portId: string, nodeId: string, isInput: boolean }) => {
            // Prevent connecting an output to an output, or an input to an input
            if (item.isInput === isInput) return;

            // To ensure data flow is always from an output to an input,
            // the 'from' node must be the output, and the 'to' node must be the input.
            const from = item.isInput ? { nodeId: port.nodeId, portId: port.id } : { nodeId: item.nodeId, portId: item.portId };
            const to = item.isInput ? { nodeId: item.nodeId, portId: item.portId } : { nodeId: port.nodeId, portId: port.id };
            
            addLink(from, to);
        },
    }), [addLink, port.id, port.nodeId, isInput]);

    const portStyle: React.CSSProperties = {
        top: `${(100 / (count + 1)) * (index + 1)}%`,
        transform: 'translateY(-50%)',
        // Visually indicate when a port is being dragged
        opacity: isDragging ? 0.5 : 1, 
    };

    return (
        // FIX: Wrap the drag(drop(node)) call in a function body to ensure a void return type.
        <div 
            ref={(node) => {
                drag(drop(node));
            }} 
            className={`port ${isInput ? 'input' : 'output'}`} 
            style={portStyle} 
        />
    );
};