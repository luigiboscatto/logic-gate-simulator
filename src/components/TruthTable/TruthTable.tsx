import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { values, cloneDeep } from 'lodash';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationState } from '../../types';
import { runSimulation } from '../../utils/simulation';
import './TruthTable.css';

export const TruthTable: React.FC = () => {
  const { simulation, setHighlightedNodeId } = useSimulation();
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_ROWS_COLLAPSED = 4;

  const getTruthTableData = () => {
    const inputNodes = values(simulation.nodes).filter(node => node.type === 'INPUT');
    const outputNodes = values(simulation.nodes).filter(node => node.outputs.length === 0);

    if (inputNodes.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = [
      ...inputNodes.map(n => ({ label: `IN ${n.id.substring(0, 2)}`, nodeId: n.id, isInput: true })),
      ...outputNodes.map(n => ({ label: `OUT ${n.id.substring(0, 2)}`, nodeId: n.id, isInput: false }))
    ];

    const rows: (boolean | string)[][] = [];
    const numCombinations = 2 ** inputNodes.length;

    for (let i = 0; i < numCombinations; i++) {
      const tempSim: SimulationState = cloneDeep(simulation);
      const row: (boolean | string)[] = [];

      inputNodes.forEach((node, index) => {
        const state = ((i >> (inputNodes.length - 1 - index)) & 1) === 1;
        if (tempSim.nodes[node.id]) {
          tempSim.nodes[node.id].state = state;
        }
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
  const displayedRows = isExpanded ? rows : rows.slice(0, MAX_ROWS_COLLAPSED);

  return (
    <div className="truth-table-container">
      <div className="truth-table-title">
        <h4>Truth Table</h4>
        {rows.length > MAX_ROWS_COLLAPSED && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="expand-button">
            {isExpanded ? 'Recolher' : `Expandir (${rows.length} linhas)`}
          </button>
        )}
      </div>
      <div className="table-responsive">
        <Table className="truth-table" bordered size="sm">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  onMouseEnter={() => setHighlightedNodeId(header.nodeId)}
                  onMouseLeave={() => setHighlightedNodeId(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, i) => (
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
