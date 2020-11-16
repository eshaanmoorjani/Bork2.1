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
        <Form usernameError={this.props.usernameError} usernameHelperText={this.props.usernameHelperText}
         chatIDError={this.props.chatIDError} chatIDHelperText={this.props.chatIDHelperText}></Form>
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
        {this.form()}
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

  form() {
    const soloStyle = {
      background: 'linear-gradient(45deg, #2196F3 5%, #21CBF3 90%)',
      color: 'white',
      fontSize: 20,
    };

    const otherStyle = {
      borderColor: '#21CBF3',
      color: '#21CBF3',
      borderWidth: 1.2,
      fontSize: 20,
    };

    return (
      <Grid container class="container">
          <TextField class="username-textfield" id="username-textfield" variant="outlined" error={this.props.usernameError}
          label="Username" helperText={this.props.usernameHelperText} fullWidth={true} autoComplete="off"
          InputLabelProps={{style: {fontSize: 25}}}
          InputProps={{style: {height: 65, fontSize: 25}}}
          inputProps={{style: {fontSize: 40, textAlign: "center"}}}>
          </TextField>

          <Button className="solo-queue-button" id="solo-queue-button" style={soloStyle} variant="contained" color="primary" size="large" fullWidth={true}>Solo Queue</Button>

          <Grid item class="buttons">
            <Button id="create-lobby-button" variant="outlined" style={otherStyle} color="primary" size="large" fullWidth={true}>Create Lobby</Button>
            <div id="join-lobby-box" onMouseEnter={this.joinHoverTrue} onMouseLeave={this.joinHoverFalse}>
                <Button id="join-lobby-button" variant="outlined" style={otherStyle} color="primary" size="large" fullWidth={true} >Join Lobby</Button>
                {this.joinLobbyDropdown()}
            </div>
          </Grid>
      </Grid>
    );
  }

  joinLobbyDropdown() {
    const joinLobbyInputButtonStyle = {
      background: '#21CBF3',
      color: 'white',
    };

    return (
      <div class="join-lobby-div" id="invis">
        <TextField className="join-lobby-input" hidden={true} id="join-lobby-input" variant="filled" type="text" autoComplete="off"
          label="Enter Lobby ID" error={this.props.chatIDError} helperText={this.props.chatIDHelperText}
          InputProps={{style: {position: "absolute", margin: "auto"}}} >
         </TextField>
        <Button className="join-lobby-button" id="join-input-button" variant="contained" color="primary" style={joinLobbyInputButtonStyle}>
          <p class="join-input-text">Join!</p>
        </Button>
      </div>
    );
  }

  joinHoverTrue() {
    const div = document.getElementById("invis");
    div.setAttribute("id", "not-invis");
  }

  joinHoverFalse() {
    const div = document.getElementById("not-invis");
    div.setAttribute("id", "invis");
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

