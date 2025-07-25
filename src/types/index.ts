export interface PortType {
  id: string;
  nodeId: string;
  isInput: boolean;
}

export interface NodeType {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs: PortType[];
  outputs: PortType[];
  state?: boolean;
  logic: (inputs: boolean[]) => boolean[];
}

export interface LinkType {
  id: string;
  from: { nodeId: string; portId: string };
  to: { nodeId: string; portId: string };
  state?: boolean;
}

export interface SimulationState {
  nodes: { [id: string]: NodeType };
  links: { [id: string]: LinkType };
}

export const ItemTypes = {
  NODE: 'node',
  BOARD_NODE: 'board_node',
  PORT: 'port',
};