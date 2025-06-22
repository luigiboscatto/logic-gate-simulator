import React from 'react';
import { Accordion } from 'react-bootstrap';
import { gateTypes } from '../../types/gateTypes';
import { PaletteItem } from './PaletteItem';
import { PaletteSection } from './PaletteSection';

export const Palette: React.FC = () => {
  return (
    <Accordion defaultActiveKey="0" alwaysOpen>
      <PaletteSection eventKey="0" title="Inputs">
        {gateTypes.inputs.map(gate => <PaletteItem key={gate.type} gate={gate} />)}
      </PaletteSection>
      <PaletteSection eventKey="1" title="Logic Gates">
        {gateTypes.gates.map(gate => <PaletteItem key={gate.type} gate={gate} />)}
      </PaletteSection>
      <PaletteSection eventKey="2" title="Outputs">
        {gateTypes.outputs.map(gate => <PaletteItem key={gate.type} gate={gate} />)}
      </PaletteSection>
    </Accordion>
  );
};
