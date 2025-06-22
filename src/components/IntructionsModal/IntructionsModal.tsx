import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface InstructionsModalProps {
  show: boolean;
  handleClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Adding Components</h5>
        <p>To add a component like an input, logic gate, or output, drag it from the menu on the left onto the main board.</p>
        <h5>Connecting Components</h5>
        <p>To create a connection, drag from a port (the small circles) on one component to a port on another.</p>
        <h5>Toggling Inputs</h5>
        <p>Click on an 'INPUT' gate on the board to toggle its state between ON (true) and OFF (false).</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
