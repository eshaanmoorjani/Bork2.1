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

export function BorkHeader() {
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
        <Form.Label id="inputForm">Custom Tags (coming soon!)</Form.Label>
        <Form.Control id="customTags" type="tags" disabled={true} placeholder="Enter tags" size="lg"/> 
      </Col>

      <GenerateTagBoxes tags={["Among Us"]} />
      {
        //, "League of Legends", "Valorant", "Brawl", "Overwatch", "CS:GO"
      }

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


class GenerateTagBoxes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagBoxes: [],
    };
    this.callMakeTagBoxes = this.callMakeTagBoxes.bind(this);
    this.makeTagBoxes = this.makeTagBoxes.bind(this);
  }
  
  callMakeTagBoxes() {
    const cols = []
    for (var i = 0; i < this.props.tags.length; i += 3) { // i += 3 means 3 tags per line
      const end = Math.min(this.props.tags.length, i + 3);
      cols.push(<Col md="auto">
        <Form.Label id="inputForm"> </Form.Label>
        {this.makeTagBoxes(this.props.tags.slice(i, end))}
      </Col>)
    }
    return (cols);
  }

  makeTagBoxes(tagSubarray) {
    const tagForms = []
    for (var i = 0; i < tagSubarray.length; i++) {
      const tag = <TagBox tag={tagSubarray[i]} />;
      tagForms.push(tag);
      this.state.tagBoxes.push(tag);
    }

    // temporary other games coming soon tag
    tagForms.push(
      <Form.Check
      inline
      id="poop"
      label="Other games"
      disabled={true}
      checked={false}
      name="tag_checkbox"
      type="checkbox"
/>
    )
    tagForms.push(
      <div id="also-coming-soon">
        Also coming soon!
      </div>
    )
    return (tagForms);
  }

  render() {
    return (this.callMakeTagBoxes());
  }
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
    // disabled = true, checked=true, temporarily
    return (
        <Form.Check
          inline
          id={this.tag}
          label={this.tag}
          disabled={true}
          checked={true}
          name="tag_checkbox"
          type="checkbox"
        />
    );
  }
}


export default App;