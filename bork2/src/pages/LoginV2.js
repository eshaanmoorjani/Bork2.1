import './LoginV2.css';
import React, { Component } from 'react';


export default class App extends Component {
    constructor(props) {
        super(props);
    }

    amongUsCharacter() {
        return (
            <img class="among-us-character" src="AmongUsCharacter.png" alt="Among Us character"></img>
        );
    }

    render() {
        return (
            <div class="full-frame">
                <LeftFrame />
                <RightFrame />
                {this.amongUsCharacter()}
            </div>
        );
    }
}

class LeftFrame extends Component {
    constructor(props) {
        super(props);
    }

    description() {
        return (
            <h2 class="meet-game-description">Enter video/audio/text Among Us lobbies with a single click.</h2>
        );
    }

    usernameBox() {
        return (
            <div class="username-box">
                <h3 class="username-label">Username</h3>
                <input class="username-input" type="text" autcomplete="off" placeholder="Your username" required></input>
            </div>
        );
    }

    soloQueueButton() {
        return (
            <button class="solo-queue-button" type="submit" >
                Solo Queue
            </button>
        );
    }

    createLobbyButton() {
        return (
            <button class="create-lobby-button">
                Create Lobby
            </button>
        );
    }

    joinLobbyButton() {
        return (
            <button class="join-lobby-button">
                Join Lobby
            </button>
        );
    }

    render() {
        return (
            <div class="left-frame">
                {this.description()}
                {this.usernameBox()}
                {this.soloQueueButton()}
                {this.createLobbyButton()}
                {this.joinLobbyButton()}
            </div>
        );
    }
}

class RightFrame extends Component {
    constructor(props) {
        super(props);
    }

    header() {
        return (
            <h1 class="meet-game-header">
                Meet.Game
            </h1>
        )
    }

    comingSoon() {
        return (
            <h3 class="coming-soon">
                Other games coming soon!
            </h3>
        )
    }

    render() {
        return(
            <div class="right-frame">
                {this.header()}
                {this.comingSoon()}
            </div>
        )
    }
}