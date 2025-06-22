// A file to define the properties of each logic gate
export const gateTypes = {
  inputs: [
    { type: 'INPUT', numInPorts: 0, numOutPorts: 1, logic: () => [false] },
  ],
  gates: [
    { type: 'AND', numInPorts: 2, numOutPorts: 1, logic: (inputs: boolean[]) => [inputs[0] && inputs[1]] },
    { type: 'OR', numInPorts: 2, numOutPorts: 1, logic: (inputs: boolean[]) => [inputs[0] || inputs[1]] },
    { type: 'NOT', numInPorts: 1, numOutPorts: 1, logic: (inputs: boolean[]) => [!inputs[0]] },
    { type: 'NAND', numInPorts: 2, numOutPorts: 1, logic: (inputs: boolean[]) => [!(inputs[0] && inputs[1])] },
    { type: 'NOR', numInPorts: 2, numOutPorts: 1, logic: (inputs: boolean[]) => [!(inputs[0] || inputs[1])] },
    { type: 'XOR', numInPorts: 2, numOutPorts: 1, logic: (inputs: boolean[]) => [inputs[0] !== inputs[1]] },
  ],
  outputs: [
    { type: 'OUTPUT', numInPorts: 1, numOutPorts: 0, logic: (inputs: boolean[]) => [] },
  ],
};