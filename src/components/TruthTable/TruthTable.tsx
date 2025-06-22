import React from 'react';
import { Table } from 'react-bootstrap';
import { values, cloneDeep } from 'lodash';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationType } from '../../types';
import { runSimulation } from '../../utils/simulation';

export const TruthTable: React.FC = () => {
    const { simulation } = useSimulation();

    const getTruthTableData = () => {
        const inputNodes = values(simulation.nodes).filter(node => node.type === 'INPUT');
        const outputNodes = values(simulation.nodes).filter(node => node.outputs.length === 0);

        if (inputNodes.length === 0) return [];

        const headers = [...inputNodes.map(n => n.type + ' ' + n.id.substring(0, 2)), ...outputNodes.map(n => 'OUT ' + n.id.substring(0, 2))];
        const rows = [];
        const numCombinations = Math.pow(2, inputNodes.length);

        for (let i = 0; i < numCombinations; i++) {
            const tempSim: SimulationType = cloneDeep(simulation);
            const row: (boolean | string)[] = [];

            // Set input values for this combination
            inputNodes.forEach((node, index) => {
                const state = ((i >> (inputNodes.length - 1 - index)) & 1) === 1;
                tempSim.nodes[node.id].state = state;
                tempSim.nodes[node.id].logic = () => [state];
                row.push(state);
            });

            // Run simulation for this combination
            const resultSim = runSimulation(tempSim);

            // Get output values
            outputNodes.forEach(node => {
                const outputNode = resultSim.nodes[node.id];
                row.push(outputNode.state === undefined ? '?' : outputNode.state);
            });
            rows.push(row);
        }

        return { headers, rows };
    };

    const { headers, rows } = getTruthTableData();

    return (
        <div style={{ marginTop: '20px' }}>
            <h4>Truth Table</h4>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        {headers?.map((header, i) => <th key={i}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows?.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => <td key={j}>{cell.toString()}</td>)}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
