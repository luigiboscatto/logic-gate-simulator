import React from 'react';
import { useDrag } from 'react-dnd';
import { useSimulation } from '../../hooks/useSimulation';
import { NodeType, ItemTypes } from '../../types';
import { Port } from './Port';

interface NodeProps {
  node: NodeType;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}

export const NodeComponent: React.FC<NodeProps> = ({ node, onMove, onRemove }) => {
  const { toggleInputNode, highlightedNodeId } = useSimulation();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOARD_NODE,
    item: { id: node.id },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item) {
        onMove(item.id, node.position.x + delta.x, node.position.y + delta.y);
      }
    },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }), [node.id, node.position, onMove]);

  const handleNodeClick = () => {
    if (node.type === 'INPUT') {
      toggleInputNode(node.id);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove(node.id);
  };

  const isHighlighted = node.id === highlightedNodeId;

  return (
    <div
      ref={drag as any}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        opacity: isDragging ? 0.5 : 1,
        padding: '10px 20px',
        border: isHighlighted ? '2px solid #00BFFF' : (node.state ? '2px solid lime' : '1px solid gray'),
        boxShadow: isHighlighted ? '0 0 12px #00BFFF' : 'none',
        borderRadius: '8px',
        backgroundColor: 'white',
        cursor: 'grab',
        textAlign: 'center',
        transition: 'border 0.2s ease-out, box-shadow 0.2s ease-out',
      }}
      onClick={handleNodeClick}
    >
      <button
        onClick={handleDeleteClick}
        style={{
          position: 'absolute',
          top: '-10px', right: '-8px',
          width: '20px', height: '20px',
          borderRadius: '50%', background: '#ff4d4d',
          color: 'white', border: '1px solid white',
          cursor: 'pointer', fontSize: '14px',
          lineHeight: '18px', padding: 0, fontWeight: 'bold'
        }}
      >
        &times;
      </button>
      {node.type}
      {node.inputs.map((port, index) => (
        <Port key={port.id} port={port} isInput={true} index={index} count={node.inputs.length} />
      ))}
      {node.outputs.map((port, index) => (
        <Port key={port.id} port={port} isInput={false} index={index} count={node.outputs.length} />
      ))}
    </div>
  );
};
