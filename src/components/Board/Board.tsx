import React from 'react';
import { useDrop } from 'react-dnd';
import { values } from 'lodash';
import { useSimulation } from '../../hooks/useSimulation';
import { ItemTypes, NodeType } from '../../types';
import { Link } from './Link';
import { NodeComponent } from './Node';

export const Board: React.FC = () => {
    const { simulation, addNode, moveNode } = useSimulation();

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.NODE,
        drop: (item: { gate: any }, monitor) => {
            const offset = monitor.getClientOffset();
            if (offset) {
                // FIX 2: Removed the 'as NodeType' assertion.
                // Let the addNode function determine how to handle this data.
                const newNodeData = {
                    type: item.gate.type,
                    position: { x: offset.x - 250, y: offset.y - 50 },
                    logic: item.gate.logic,
                };
                addNode(newNodeData, item.gate);
            }
        },
    }), [addNode]);

    // A function to handle moving nodes that are already on the board
    const handleMoveNode = (id: string, x: number, y: number) => {
        moveNode(id, { x, y });
    };

    return (
        // FIX 1: Cast the drop connector to the ref type React expects for a div.
        <div ref={drop as unknown as React.Ref<HTMLDivElement>} className="board">
            {values(simulation.nodes).map((node: NodeType) => (
                <NodeComponent key={node.id} node={node} onMove={handleMoveNode} />
            ))}
            {simulation.links && values(simulation.links).map(link => (
                 <Link key={link.id} link={link} nodes={simulation.nodes} />
            ))}
        </div>
    );
};
