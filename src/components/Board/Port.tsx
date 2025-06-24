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
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }), [port.id, port.nodeId, isInput]);

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.PORT,
        drop: (item: { portId: string, nodeId: string, isInput: boolean }) => {
            if (item.isInput === isInput) return;
            const from = item.isInput ? { nodeId: port.nodeId, portId: port.id } : { nodeId: item.nodeId, portId: item.portId };
            const to = item.isInput ? { nodeId: item.nodeId, portId: item.portId } : { nodeId: port.nodeId, portId: port.id };
            addLink(from, to);
        },
    }), [addLink, port.id, port.nodeId, isInput]);

    const portStyle: React.CSSProperties = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: 'black',
        borderRadius: '50%',
        top: `${(100 / (count + 1)) * (index + 1)}%`,
        [isInput ? 'left' : 'right']: '-5px',
        transform: 'translateY(-50%)',
        opacity: isDragging ? 0.5 : 1,
    };

    return <div ref={(node) => {
        drag(drop(node));
    }} style={portStyle} />;
};

