import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {auth, db, rt_db, functions, firebase} from '../services/firebase';

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
        this.chatConnection = this.chatConnection.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.chatConnection();
        this.getMessage();
        this.getParticipants();
    }

    chatConnection() {
        firebase.database().ref('users/'+this.state.userID+"/is_disconnected").set(false); // ayoooo dont change baby girl
        var presenceRef = rt_db.ref("users/"+this.state.userID+"/is_disconnected");     
        presenceRef.onDisconnect().set(true);
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
        // check if its a disconnect message
        if (messageData.type == "user_content") {
            return makeUserContentMessage(messageData, this.state.userID);
        } else {
            return makeEntryStatusMessage(messageData);
        }
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
        const ref = db.collection("chats").doc(this.state.chatID).collection("messages").orderBy("timestamp", "desc").limit(1);
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
        const ref = db.collection("chats").doc(this.state.chatID).collection("participants").orderBy("timestamp");
        ref.onSnapshot(collection => {
            console.log("THE PARTICIPANTS HAVE CHANGED")
            var numParticipants = 0;
            var participants = {};
            collection.forEach(doc => {
                numParticipants++;
                const data = doc.data();
                console.log(data);
                participants[data.user_id] = data.username;
                // this.setState({
                //     ...this.state,
                //     numParticipants: participants,
                //     participants: {
                //         ...this.state.participants,
                //         [data.user_id]: data.username,
                //     },
                // });
            });
            this.setState({
                numParticipants: numParticipants,
                participants: participants,
            })
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
            this.sendMessage(message);
        }
    }

    sendMessage(message) {
        db.collection("chats/").doc(this.state.chatID).collection("messages/").add({
            content: message,
            timestamp: new Date(),
            userID: this.state.userID,
            username: this.state.username,
            messageNumber: this.state.numMessagesSent,
            type: "user_content",
        });
        db.collection("chats").doc(this.state.chatID).update({
            last_message_time: new Date()
        })
    }
    
    // this deletes from local participants, need to delete from DATABASE
    async handleLogout() {
        console.log("a")
        const deleteInfo = functions.httpsCallable('deleteUserInfo')
        console.log("b")
        await deleteInfo({userId: this.state.userID, chatId: this.state.chatID, username: this.state.username}).then(result => { // CORS error that wasn't there earlier
            console.log("b.5")
            console.log(result.data); // Will tell you if they signed them out or not
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log("c");
        auth.signOut().then(() => {
            
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
// yo when can i save to test 2 min okok
function makeUserContentMessage(messageData, userID) {
    var rightOrLeft = assignRightOrLeft(messageData, userID);
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

function makeEntryStatusMessage(messageData) {
    return (
        <div class="disconnect-msg">
            {messageData.content}
        </div>
    );
}

export default ChatApp;