import './App.css';
import React, { Component } from 'react';
import { Button, Form, Container, Row, Col} from 'react-bootstrap';
import  'bootstrap/dist/css/bootstrap.min.css';

export function App() {
  return (
    <div className="App">
      <BorkHeader />
      <BorkDescription />
      <InputBoxes />
    </div>
  );
}


export function App() {
  return (
    <div className="App">
      <BorkHeader />
      <BorkDescription />
      <InputBoxes />
    </div>
  );
}

function BorkHeader() {
  return (<h1 id="header">Bork</h1>);
}

function BorkDescription() {
  return (<h2>Bork matches gamers to other gamers. Find Among Us lobbies, Valorant teams, and some fun people to chill with!</h2>);
}

function NoUsernameWarning() {
  return (<p id="no-username-warning"></p>);
}

function InputBoxes() {
  return (<Form inline className="fixed-bottom" id="input">
    <Container fluid>
    <Row>
      <Col>
        <Form.Label id="inputForm">Username</Form.Label>
        <Form.Control id="username" type="username" placeholder="Your Username" size="lg"/> 
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm">Tags</Form.Label>
        <Form.Control id="tags" type="tags" placeholder="Enter tags" size="lg"/> 
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm">Bork!</Form.Label>
        <Button id="submit_button" variant="info" size="lg" >Submit</Button>
      </Col>

      <Col>
        <Form.Label id="inputForm"> </Form.Label>
        <NoUsernameWarning />
      </Col>
    </Row>
    </Container>
  </Form>);
}


export default App;