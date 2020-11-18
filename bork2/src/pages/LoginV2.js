import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

import './LoginV2.css';
import { joinLobbyTransition } from './LoginFirebase';
import Logo from './../pig_logo/pig_logo.png';


export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="full-frame">
        {this.loginFrame()}
      </div>
    );
  }

  loginFrame() {
    return (
      <div class="login-frame">
        <Form {...this.props}></Form>
        <HogPub></HogPub>
      </div>
    );
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="form-frame">
        {this.description()}
        <FormGrid {...this.props}></FormGrid>
      </div>
    );
  }

  description() {
    return (
      <div class="descriptions">
        <h2 class="main-description">
          Enter Among Us Lobbies!
        </h2>
        <h3 class="sub-description">
          <p id="username-warning"></p>
        </h3>
      </div>

    );
  }
}

class FormGrid extends Component {
  constructor(props) {
    super(props);

    this.styles = importStyles();
  }

  render() {
    return this.formGrid();
  }

  

  formGrid() {
    return (
      <Grid container class="container">
          <TextField class="username-textfield" id="username-textfield" variant="outlined" error={this.props.usernameError}
          label="Username" helperText={this.props.usernameHelperText} fullWidth={true} autoComplete="off"
          InputLabelProps={{style: {fontSize: 25}}}
          InputProps={{style: {height: 65, fontSize: 25}}}
          inputProps={{style: {fontSize: 40, textAlign: "center"}}}>
          </TextField>

          <Button className="solo-queue-button" id="solo-queue-button" variant="contained" color="primary" size="large" fullWidth={true}
           style={this.styles.soloStyle} >Solo Queue</Button>

          <Grid item class="buttons">
            {this.createLobbyButtonSet()}
            {this.joinLobbyButtonSet()}
          </Grid>
      </Grid>
    );
  }


  createLobbyButtonSet() {
    return (
      <div id="create-lobby-box" onMouseEnter={this.displayChange("create-invis", "create-show")} onMouseLeave={this.displayChange("create-show", "create-invis")} >
        <Button id="create-lobby-button" variant="outlined" color="primary" size="large" fullWidth={true} style={this.styles.createStyle}>Create Lobby</Button>
        {this.createLobbyDropdown()}
      </div>
    );
  }

  joinLobbyButtonSet() {
    return (
      <div id="join-lobby-box"
       onMouseEnter={this.displayChange("join-invis", "join-show")} onMouseLeave={this.displayChange("join-show", "join-invis")} >
          <Button id="join-lobby-button" variant="outlined" color="primary" size="large" fullWidth={true} style={this.styles.joinStyle} >Join Lobby</Button>
          {this.joinLobbyDropdown()}
      </div>
    );
  }

  createLobbyDropdown() {
    return (
      <div class="create-lobby-div" id="create-invis">
        <TextField className="create-lobby-input" hidden={true} id="create-lobby-input" variant="outlined" type="text" autoComplete="off"
          label="Enter Lobby ID" error={this.props.createLobbyError} helperText={this.props.createLobbyHelperText} 
          InputProps={{style: this.styles.textFieldStyle}} >
         </TextField>
        <Button id="create-input-button" variant="contained" color="primary" style={this.styles.buttonStyle}>
          <p class="create-input-text">Join!</p>
        </Button>
      </div>
    );
  }

  joinLobbyDropdown() {
    return (
      <div class="join-lobby-div" id="join-invis">
        <TextField className="join-lobby-input" hidden={true} id="join-lobby-input" variant="outlined" type="text" autoComplete="off"
          label="Enter Lobby ID" error={this.props.joinLobbyError} helperText={this.props.joinLobbyHelperText} 
          InputProps={{style: this.styles.textFieldStyle}} >
         </TextField>
        <Button id="join-input-button" variant="contained" color="primary" style={this.styles.buttonStyle}>
          <p class="join-input-text">Join!</p>
        </Button>
      </div>
    );
  }

  displayChange(idFrom, idTo) {
    function helper() {
      const div = document.getElementById(idFrom);
      div.setAttribute("id", idTo);
    }
    return helper
  }
}

class HogPub extends Component {
  render() {
    return (
      <div class="hog-pub-frame">
        {this.hogPubHeader()}
        {this.comingSoon()}
        {this.logo()}
      </div>
    );
  }

  hogPubHeader() {
    return (
      <h1 class="header">Hog Pub</h1>
    )
  }

  comingSoon() {
    return (
      <h3 class="coming-soon">Other games coming soon!</h3>
    );
  }

  logo() {
    return (
      <img class="logo" src={Logo} alt="logo"/>
    )
  }
}


function importStyles() {
  return {
    soloStyle: {
      fontSize: 20,

      background: 'linear-gradient(45deg, #2196F3 5%, #21CBF3 90%)',
      color: 'white',
    },

    createStyle: {
      height: '100%',
      width: '100%',

      borderWidth: 1.2,
      borderColor: '#21CBF3',
      
      fontSize: 20,

      color: '#21CBF3',
    },

    joinStyle: {
      height: '100%',
      width: '100%',

      borderWidth: 1.2,
      borderColor: '#21CBF3',
      
      fontSize: 20,

      color: '#21CBF3',
    },

    textFieldStyle: {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: '20px',
      borderBottomLeftRadius: '20px',
    },

    buttonStyle: {
      height: '100%',
      width: '30%',

      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',

      background: '#21CBF3',
      color: 'white',
    },
  }
}
