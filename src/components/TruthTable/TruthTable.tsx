// TruthTable.tsx
import React from 'react';
import { Table } from 'react-bootstrap';
import { values, cloneDeep } from 'lodash';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationState } from '../../types';
import { runSimulation } from '../../utils/simulation';
import './TruthTable.css';

export const TruthTable: React.FC = () => {
  const { simulation } = useSimulation();

  const getTruthTableData = () => {
    const inputNodes = values(simulation.nodes).filter(node => node.type === 'INPUT');
    const outputNodes = values(simulation.nodes).filter(node => node.outputs.length === 0);

    if (inputNodes.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = [
      ...inputNodes.map(n => `IN ${n.id.substring(0, 2)}`),
      ...outputNodes.map(n => `OUT ${n.id.substring(0, 2)}`)
    ];

    const rows: (boolean | string)[][] = [];
    const numCombinations = 2 ** inputNodes.length;

    for (let i = 0; i < numCombinations; i++) {
      const tempSim: SimulationState = cloneDeep(simulation);
      const row: (boolean | string)[] = [];

      inputNodes.forEach((node, index) => {
        const state = ((i >> (inputNodes.length - 1 - index)) & 1) === 1;
        tempSim.nodes[node.id].state = state;
        row.push(state);
      });

      const resultSim = runSimulation(tempSim);
      outputNodes.forEach(node => {
        const state = resultSim.nodes[node.id]?.state;
        row.push(state === undefined ? '?' : state);
      });

      rows.push(row);
    }

    return { headers, rows };
  };

  const { headers, rows } = getTruthTableData();

  return (
    <div className="truth-table-container">
      <h4 className="truth-table-title">Truth Table</h4>
      <div className="table-responsive">
        <Table className="truth-table" striped bordered hover size="sm">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  const text = cell.toString();
                  const cls = text === 'true' ? 'cell-true' : text === 'false' ? 'cell-false' : 'cell-unknown';
                  return <td key={j} className={cls}>{text}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};