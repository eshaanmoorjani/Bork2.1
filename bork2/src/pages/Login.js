import './Login.css';
import React, { Component } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <Col md="auto">
        <Form.Label id="inputForm">Username</Form.Label>
        <Form.Control id="username" type="username" placeholder="Your Username" size="lg"/> 
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm">Custom Tags</Form.Label>
        <Form.Control id="tags" type="tags" placeholder="Enter tags" size="lg"/> 
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm"> </Form.Label>
        <GenerateTagForms tags={["Among Us", "League of Legends", "Valorant"]}/>
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm"> </Form.Label>
        <GenerateTagForms tags={["Brawl", "Overwatch", "CS:GO"]}/>
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm">Bork!</Form.Label>
        <Button id="submit_button" variant="info" size="lg" >Submit</Button>
      </Col>

      <Col md="auto">
        <Form.Label id="inputForm"> </Form.Label>
        <NoUsernameWarning />
      </Col>

    </Row>
    </Container>
  </Form>);
}

function GenerateTagForms({tags}) {
  const tagForms = tags.map((tag) => 
    <TagBox tag={tag}/>
  );
  return (tagForms);
}


class TagBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.tag = props.tag;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState({checked: !this.state.checked})
  }
  
  render() {
    return (
      <Form.Check>
        inline
        label = this.tag
        type="checkbox"
      </Form.Check>
    );
  }
}


export default App;