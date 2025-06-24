import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { SimulationProvider } from './context/SimulationContext';
import { Board } from './components/Board/Board';
import { Palette } from './components/Palette/Palette';
import { TruthTable } from './components/TruthTable/TruthTable';

const App: React.FC = () => {
  return (
    <SimulationProvider>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">Logic Gate Simulator</Navbar.Brand>
          </Container>
        </Navbar>
        <Container fluid className="mt-4">
          <Row>
            <Col md={3}>
              <div className="mb-4">
                <Palette />
              </div>
              <TruthTable />
            </Col>
            <Col md={9}>
              <Board />
            </Col>
          </Row>
        </Container>
      </div>
    </SimulationProvider>
  );
};

export default App;