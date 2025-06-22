import React from 'react';
import { useDrop } from 'react-dnd';
import { values } from 'lodash';
import { useSimulation } from '../../hooks/useSimulation';
import { ItemTypes, NodeType } from '../../types';
import { Link } from './Link';

export const Board: React.FC = () => {
  const { simulation, addNode, moveNode } = useSimulation();

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.NODE,
    drop: (item: { gate: any }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        // We will create a simplified node for now
        const newNodeData = {
          type: item.gate.type,
          position: { x: offset.x - 250, y: offset.y - 50 }, // Adjust for palette width and header height
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
    <div ref={drop} className="board">
      {values(simulation.nodes).map((node: NodeType) => (
        <Node key={node.id} node={node} onMove={handleMoveNode} />
      ))}
      {values(simulation.links).map(link => (
          <Link key={link.id} link={link} nodes={simulation.nodes} />
      ))}
    </div>
  );
};
