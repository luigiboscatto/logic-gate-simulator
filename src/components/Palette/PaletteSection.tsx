import React from 'react';
import { Accordion } from 'react-bootstrap';

interface PaletteSectionProps {
  eventKey: string;
  title: string;
  children: React.ReactNode;
}

export const PaletteSection: React.FC<PaletteSectionProps> = ({ eventKey, title, children }) => {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
};
