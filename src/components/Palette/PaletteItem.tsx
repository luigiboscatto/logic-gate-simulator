import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from 'types';

export const PaletteItem: React.FC<{ gate: any }> = ({ gate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
    item: { gate },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        border: '1px solid gray',
        borderRadius: '4px',
        cursor: 'move',
        backgroundColor: 'white',
        textAlign: 'center',
      }}
    >
      {gate.type}
    </div>
  );
};
