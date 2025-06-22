import React from 'react';
import { useDrag } from 'react-dnd';
import { useSimulation } from '../../hooks/useSimulation';
import { NodeType, ItemTypes } from '../../types';
import { Port } from './Port';


interface NodeProps {
  node: NodeType;
  onMove: (id: string, x: number, y: number) => void;
}

export const Node: React.FC<NodeProps> = ({ node, onMove }) => {
  const { toggleInputNode } = useSimulation();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOARD_NODE,
    item: { id: node.id, type: ItemTypes.BOARD_NODE },
    end: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
            const newX = node.position.x + delta.x;
            const newY = node.position.y + delta.y;
            onMove(item.id, newX, newY);
        }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [node.id, node.position.x, node.position.y, onMove]);
  
  const handleNodeClick = () => {
    if (node.type === 'INPUT') {
      toggleInputNode(node.id);
    }
  }

  return (
    <div
      ref={drag}
      className={`node ${node.state ? 'active' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        opacity: isDragging ? 0.5 : 1,
      }}
      onClick={handleNodeClick}
    >
      <div>{node.type}</div>
      {node.inputs.map((port, index) => (
        <Port key={port.id} port={port} isInput={true} index={index} count={node.inputs.length} />
      ))}
      {node.outputs.map((port, index) => (
        <Port key={port.id} port={port} isInput={false} index={index} count={node.outputs.length} />
      ))}
    </div>
  );
};
