import './LoginV2.css';
import { joinLobbyTransition } from './LoginFirebase.js';
import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
        <Form usernameError={this.props.usernameError} usernameLabel={this.props.usernameLabel}></Form>
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
    return (
      <Grid container class="container">
          <TextField class="username-textfield" id="username-textfield" variant="outlined" error={this.props.usernameError}
          label={this.props.usernameLabel} fullWidth={true} autoComplete="off"
          InputLabelProps={{style: {fontSize: 25}}}
          InputProps={{style: {height: 65, fontSize: 25}}}
          inputProps={{style: {fontSize: 40, textAlign: "center"}}}
          >
          </TextField>

          <Button className="solo-queue-button" id="solo-queue-button" variant="contained" color="primary" size="large" fullWidth={true}>Solo Queue</Button>

          <Grid item class="buttons">
            <Button  id="create-lobby-button" variant="outlined" color="primary" size="large" fullWidth={true}>Create Lobby</Button>
            <div id="join-lobby-box">
                <Button id="join-lobby-button" variant="outlined" color="primary" size="large" fullWidth={true}>Join Lobby</Button>
            </div>
          </Grid>
      </Grid>
    );
  }

    componentDidMount() {
        var jlb = document.getElementById("join-lobby-box");
        jlb.addEventListener("mouseover", this.joinLobbyHover);
        jlb.addEventListener("mouseleave", this.joinLobbyNoHover);
    }

    joinLobbyHover() {
        var jlb = document.getElementById('join-lobby-box');

        // if there input div is already attached, don't do anything
        if (jlb.childElementCount > 1) {
            return null;
        }

        // container for both the form input and the button
        var inputDiv = document.createElement("div");
        inputDiv.className = "join-lobby-div"

        // the form input
        var idInput = document.createElement("INPUT");
        idInput.setAttribute("type", "text");
        idInput.setAttribute("autocomplete", "off");
        idInput.setAttribute("placeholder", "Enter Lobby ID");
        idInput.className = "join-lobby-input";
        idInput.id = "join-lobby-input";

        // the button
        var joinButton = document.createElement("BUTTON");
        joinButton.className = "join-input-button";
        joinButton.id = "join-input-button";

        // the button inner text
        var joinButtonText = document.createElement("p");
        joinButtonText.className = "join-input-text";
        joinButtonText.innerHTML = "Join!";

        joinButton.appendChild(joinButtonText);
        inputDiv.appendChild(idInput);
        inputDiv.appendChild(joinButton);
        jlb.appendChild(inputDiv);
        joinLobbyTransition();
    }

    joinLobbyNoHover() {
        var jlb = document.getElementById('join-lobby-box');
        jlb.removeChild(jlb.lastChild);
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

