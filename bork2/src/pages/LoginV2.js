import './LoginV2.css';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import logo from "../pig_logo/pig_logo.png";

console.log("image: ", logo)

const LEFT_FRAME_COLOR = "#000000";
const RIGHT_FRAME_COLOR = "#FFFFFF";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    amongUsCharacter() {
        return (
            <img class="among-us-character" src={require("./hog_pub.png")} alt="Among Us character" />
        );
    }

    render() {
        return (
            <div class="full-frame">

                <LeftFrame />
                <RightFrame />
                {this.amongUsCharacter()
                }
                <BackgroundDots numDots={10}/>
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
            <div class="meet-game-description">
                <h2 class="meet-game-description" >Enter Among Us lobbies with a single click.</h2>
                <h2 class="meet-game-subdescription">Now supporting video and audio!</h2>
            </div>
        );
    }

    usernameBox() {
        return (
            <div class="username-box">
                <h3 class="username-label">Username</h3>
                <input id="username" class="username-input" type="text" autoComplete="off" placeholder="Your username" required></input>
                <p id="username-warning" class="username-warning"></p>
            </div>
        );
    }

    soloQueueButton() {
        return (
            <div class='solo-queue-box'>
                <style type="text/css">
                    { // style shit idk, don't change for now
                    ` 
                        .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
                            background-color: #8064A2 !important;
                        }
                        .btn-xxl {
                        padding: .5rem 1.5rem;
                        font-style: bold;
                        font-size: 2.5rem;
                        }
                    `}
                </style>
                <Button id="submit_button" style={{backgroundColor: "#023E8A", borderColor: "#1F2833", borderRadius: "100px", fontWeight: "bold"}} class="solo-queue-button" variant="primary" size="xxl" block>
                    Solo Queue
                </Button>
            </div>
        );
    }

    createLobbyButton() {
        return (
            <div class='create-lobby-box'>
                <Button id="create_lobby_button" style={{backgroundColor: "#55ACEE", borderColor: "#1F2833", borderRadius: "100px", fontWeight: "bold"}}
                 class="create-lobby-button" variant="primary" size="xxl" block>
                    Create Lobby
                </Button>
            </div>
        );
    }

    joinLobbyButton() {
        return (
            <div class='join-lobby-box' id='join-lobby-box'>
                <Button id="join_lobby_button" style={{backgroundColor: "#55ACEE", borderColor: "#1F2833", borderRadius: "100px", fontWeight: "bold"}}
                 class="-lobby-button" variant="primary" size="xxl" block>
                    Join Lobby
                </Button>
            </div>
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

        // the button
        var joinButton = document.createElement("BUTTON");
        joinButton.className = "join-input-button";

        // the button inner text
        var joinButtonText = document.createElement("p");
        joinButtonText.className = "join-input-text";
        joinButtonText.innerHTML = "Join!";

        joinButton.appendChild(joinButtonText);
        inputDiv.appendChild(idInput);
        inputDiv.appendChild(joinButton);
        jlb.appendChild(inputDiv);
    }

    joinLobbyNoHover() {
        var jlb = document.getElementById('join-lobby-box');
        jlb.removeChild(jlb.lastChild);
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
                Hog Pub
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
            style["background-color"] = RIGHT_FRAME_COLOR;
        } else {
            style["background-color"] = LEFT_FRAME_COLOR;
        }

        return (
            <span class="dot" style={style}></span>
        );
    }

    makeDots() {
        var dots = [];
        for (var i = 0; i < this.state.numDots; i++) {
            var xxyy = this.getXXYY();
            dots.push(this.makeDot(xxyy[0], xxyy[1]));
        }
        return dots;
    }

    getXXYY() {
        var xx = 0;
        var yy = Math.random() * 100;
        if (yy < 15) {
            xx = Math.random() * 68;
        } else if (15 < yy && yy < 35) {
            if (Math.random() < 0.15) {
                xx = Math.random() * 7;
            } else {
                xx = Math.random() * 40 + 60;
            }
        } else if (35 < yy && yy < 47) {
            xx = Math.random() * 100;
        } else if (47 < yy && yy < 70) {
            if (Math.random() < 0.3) {
                xx = Math.random() * 19;
            } else {
                xx = Math.random() * 54 + 47;
            }
        } else if (70 < yy && yy < 85) {
            xx = Math.random() * 100;
        } else if (93 < yy) {
            xx = Math.random() * 100;
        } else {
            return this.getXXYY(); // potential infinite loop but me like statistics
        }
        return [xx, yy];
    }

    render() {
        return (
            <div class="all-dots">
                {this.makeDots()}
            </div>
        )
    }
}
