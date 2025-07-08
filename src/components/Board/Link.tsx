import React from 'react';
import { LinkType, NodeType } from '../../types';

interface LinkProps {
  link: LinkType;
  nodes: { [id: string]: NodeType };
}

export const Link: React.FC<LinkProps> = ({ link, nodes }) => {
  const fromNode = nodes[link.from.nodeId];
  const toNode = nodes[link.to.nodeId];

  if (!fromNode || !toNode) {
    return null;
  }

  const fromPortIndex = fromNode.outputs.findIndex(p => p.id === link.from.portId);
  const toPortIndex = toNode.inputs.findIndex(p => p.id === link.to.portId);

  const x1 = fromNode.position.x + 80;
  const y1 = fromNode.position.y + 25 + (fromPortIndex * 20);
  const x2 = toNode.position.x;
  const y2 = toNode.position.y + 15 + (toPortIndex * 20);

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path
        d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
        stroke={link.state ? "lime" : "gray"}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};
