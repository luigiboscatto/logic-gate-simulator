import React, { useRef } from 'react'; // 1. Import useRef
import { useDrop } from 'react-dnd';
import { values } from 'lodash';
import { useSimulation } from '../../hooks/useSimulation';
import { ItemTypes, NodeType } from '../../types';
import { Link } from './Link';
import { NodeComponent } from './Node';

export const Board: React.FC = () => {
    const { simulation, addNode, moveNode, removeNode } = useSimulation();

    const boardRef = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.NODE,
        drop: (item: { gate: any }, monitor) => {

            const boardRect = boardRef.current?.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();

            if (boardRect && clientOffset) {
                const x = clientOffset.x - boardRect.left;
                const y = clientOffset.y - boardRect.top;

                // Optional: A final check to make sure it's within the actual bounds
                if (x < 0 || y < 0 || x > boardRect.width || y > boardRect.height) {
                    return;
                }

                const newNodeData = {
                    type: item.gate.type,
                    position: { x, y }, // No more magic numbers!
                    logic: item.gate.logic,
                };
                addNode(newNodeData, item.gate);
            }
        },
    }), [addNode]);

    const handleMoveNode = (id: string, x: number, y: number) => {
        moveNode(id, { x, y });
    };

    // 5. Connect both the react-dnd ref and our custom ref to the div
    // We pass our boardRef to the `drop` connector from react-dnd
    drop(boardRef);

    return (
        <div ref={boardRef} className="board"> {/* Use the connected ref */}
            {values(simulation.nodes).map((node: NodeType) => (
                <NodeComponent key={node.id} node={node} onMove={handleMoveNode} onRemove={removeNode} />
            ))}
            {simulation.links && values(simulation.links).map(link => (
                <Link key={link.id} link={link} nodes={simulation.nodes} />
            ))}
        </div>
    );
};