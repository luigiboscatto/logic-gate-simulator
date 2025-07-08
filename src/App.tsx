import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { SimulationProvider } from './context/SimulationContext';
import { Board } from './components/Board/Board';
import { Palette } from './components/Palette/Palette';
import { TruthTable } from './components/TruthTable/TruthTable';
import './App.css';

const App: React.FC = () => {
  return (
    <SimulationProvider>
      <div className="App">
        <Navbar className="navbar-custom" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home" className="navbar-brand-custom">
              <span role="img" aria-label="light-bulb" style={{ marginRight: '10px', fontSize: '1.5rem' }}>
                💡
              </span>
              Simulador de Portas Lógicas
            </Navbar.Brand>
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
