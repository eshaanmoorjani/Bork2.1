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
                {//this.amongUsCharacter()
                }
                <BackgroundDots numDots={15}/>
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
                <input id="username" class="username-input" type="text" autcomplete="off" placeholder="Your username" required></input>
            </div>
        );
    }

    soloQueueButton() {
        return (
            <button id="submit_button" class="solo-queue-button" type="submit" >
                <p class="solo-queue-text">Solo Queue</p>
            </button>
        );
    }

    createLobbyButton() {
        return (
            <button class="create-lobby-button">
                <p class="create-lobby-text">Create Lobby</p>
            </button>
        );
    }

    joinLobbyButton() {
        return (
            <button class="join-lobby-button">
                <p class="join-lobby-text">Join Lobby</p>
            </button>
        );
    }

    render() {
        return (
            <div class="left-frame">
                {this.description()}
                {this.usernameBox()}
                {this.soloQueueButton()}
                <div class="create-join-lobby">
                    {this.createLobbyButton()}
                    {this.joinLobbyButton()}
                </div>
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
                Hog.Pub
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

class BackgroundDots extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numDots: this.props.numDots,
        };
    }

    makeDot(xx, yy) {
        const style = {
            left: xx + "%",
            bottom: yy + "%",
        };
        if (xx < 66) {
            style["background-color"] = "#FFFFFF";
        } else {
            style["background-color"] = "#000000";
        }

        return (
            <span class="dot" style={style}></span>
        );
    }

    makeDots() {
        var dots = [];
        for (var i = 0; i < this.state.numDots; i++) {
            var xx = Math.random() * 100;
            var yy = Math.random() * 100;
            dots.push(this.makeDot(xx, yy));
        }
        return dots;
    }

    render() {
        return (
            <div class="all-dots">
                {this.makeDots()}
            </div>
        )
    }
}
