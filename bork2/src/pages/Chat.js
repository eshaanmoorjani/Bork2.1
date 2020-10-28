import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {auth, db, firebase} from '../services/firebase';

import './Chat.css';
import { BorkHeader } from './Login';
import { Button, Navbar, Nav, NavDropdown, Form, FormControl, NavItem } from 'react-bootstrap';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        var date = new Date();
        const userID = auth.currentUser.uid;
        this.state = {
            chatID: this.props.chatID,
            userID: userID,
            username: this.props.username,
            numParticipants: 0,
            joinTime: this.props.joinTime,
            lastMessageTime: Math.floor(date.getTime() / 1000),
            numMessagesSent: 0, // might not need this but whatever
            numMessagesReceived: 0,
            messages: {
            }, // messageID: {message: "a", username: "vijen", userID: "q3d8ds", time: "12:08:2032"}
            participants: {
            }, // usernames
        };
        this.getMessage = this.getMessage.bind(this);
        this.getParticipants = this.getParticipants.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.getMessage();
        this.getParticipants();
    }
    
    makeChat() {
        return (
        <section class="msger" id="chatbox">
            <main class="msger-chat">    
                {this.makeAllMessages()}
                <div id="dummyScroll"></div>
            </main>
            <form class="msger-inputarea" onSubmit={this.handleEnter}>
                <input type="text" id="input" class="msger-input" placeholder="Send a message, you cunt"/>
                <Button type="button" class="msger-send-btn" onClick={this.handleSend}>Send</Button>
            </form>
        </section>
        );
    }

    // auto scroll down
    componentDidUpdate() {
        const scrollDiv = document.getElementById("dummyScroll");
        if (scrollDiv != null) {
            scrollDiv.scrollIntoView(true, { behavior: "smooth" });
        }
    }

    // bork header, not being used rn, using navbar
    makeHeader() {
        return (
        <header class="msger-header">
            <div class="msger-header-title">
                <i class="fas fa-comment-alt"></i> Bork.cc
            </div>
            <div class="msger-header-options">
                <span><i class="fas fa-cog"></i></span>
            </div>
        </header>
        );
    }

    // need to make multiple lines of text if too long
    makeMessageBubble(messageID) {
        const messageData = this.state.messages[messageID];
        var rightOrLeft = assignRightOrLeft(messageData, this.state.userID);
        var date = new Date(messageData.timestamp.seconds * 1000);
        var timeFormatted = getFormattedTime(date);
        return (
            <div class={rightOrLeft}>
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">{messageData.username}</div>
                        <div class="msg-info-time">{timeFormatted}</div>
                    </div>
                    <div class="msg-text">
                        {messageData.content}
                    </div>
                </div>
            </div>
        );
    }

    makeAllMessages() {
        var allMessages = [];
        for (var key in this.state.messages) {
            allMessages.push(this.makeMessageBubble(key))
        }
        return allMessages;
    }

    makeNavbar() {
        return (
            <div class="navbar">
                <Navbar fixed="top" bg="light" variant="light" expand="lg">
                    <Navbar.Brand>Meet.Game</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavItem class="lobbyTag">Among us</NavItem>
                        </Nav>
                        <Nav>
                            {this.displayCapacity()}
                        </Nav>
                        <Nav>
                            <NavDropdown title="Participants" id="participants-dropdown">
                                {this.makeParticipants()}
                            </NavDropdown>
                        </Nav>
                        <Form inline>
                            <Button variant="danger" onClick={this.handleLogout}>Logout</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.makeNavbar()}
                {this.makeChat(this.state.messages)}
            </div>
            );
    }

    // every room 10 people max for now 
    displayCapacity() {
        return (
        <div id="capacity">
            {this.state.numParticipants}/10
        </div>
        );
    }

    getMessage() {
        const ref = firebase.firestore().collection("chats").doc(this.state.chatID).collection("messages").orderBy("timestamp", "desc").limit(1);
        ref.onSnapshot(collection => {
            collection.forEach(doc => {
                const data = doc.data();
                    this.setState({lastMessageTime: data.timestamp.seconds});
                    this.setState({
                        ...this.state,
                        messages: {
                            ...this.state.messages,
                            [this.state.numMessagesReceived + 1]: data,
                        }
                    });
                    this.state.numMessagesReceived += 1;
            });
        });
    }

    getParticipants() {
        console.log("im getting the participants");
        const ref = firebase.firestore().collection("chats").doc(this.state.chatID).collection("participants").orderBy("timestamp");
        ref.onSnapshot(collection => {
            var participants = 0;
            collection.forEach(doc => {
                participants++;
                const data = doc.data();
                console.log(data);
                this.setState({
                    ...this.state,
                    numParticipants: participants,
                    participants: {
                        ...this.state.participants,
                        [data.user_id]: data.username,
                    },
                });
            });
        });
    }

    makeParticipants() {
        const participants = this.state.participants;
        var dropDown = [];
        for (var userID in participants) {
            dropDown.push(<NavDropdown.Item>{participants[userID]}</NavDropdown.Item>);
        }
        return dropDown;
    }
    
    handleSend() {
        const inputForm = document.getElementById("input");
        const message = inputForm.value;
        inputForm.value = "";
        if (message != "") {
            this.state.numMessagesSent += 1;
            db.collection("chats/").doc(this.state.chatID).collection("messages/").add({
                content: message,
                timestamp: new Date(),
                userID: this.state.userID,
                username: this.state.username,
                messageNumber: this.state.numMessagesSent,
            });
        }
    }
    
    // this deletes from local participants, need to delete from DATABASE
    handleLogout() {
        console.log("a")
        const deleteInfo = firebase.functions().httpsCallable('deleteUserInformation')
        console.log("b")
        deleteInfo({userId: this.state.userID, chatId: this.state.chatID}).then(result => {
            console.log("b.5");
            console.log(result.data); // Will tell you if they signed them out or not
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log("c");
        firebase.auth().signOut().then(() => {
            
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        })
    }

    handleEnter(event) {
        event.preventDefault();
        this.handleSend();
    }
}

function getFormattedTime(date) {
    var timeFormatted = date.toTimeString().substr(0,5);
    if (timeFormatted.substr(0, 2) <= 12) {
        timeFormatted += " am";
    } else {
        timeFormatted = timeFormatted.substr(0, 2) % 12 + timeFormatted.substr(2, 5) + " pm";
    }
    return timeFormatted
}

function assignRightOrLeft(messageData, userID) {
    var rightOrLeft = "";
    if (messageData["userID"] == userID) {
        rightOrLeft = "msg right-msg";
    } else {
        rightOrLeft = "msg left-msg";
    }
    return rightOrLeft;
}

export default ChatApp;