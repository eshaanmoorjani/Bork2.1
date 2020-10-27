import React, { Component, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {auth, db, firebase} from '../services/firebase';

import './Chat.css';
import { BorkHeader } from './Login';
import { Button } from 'react-bootstrap';

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
            lastMessageTime: Math.floor(date.getTime() / 1000),
            numMessagesSent: 0, // might not need this but whatever
            numMessagesReceived: 0,
            messages: {
            }, // messageID: {message: "a", username: "vijen", userID: "q3d8ds", time: "12:08:2032"}
        };
        this.getMessage = this.getMessage.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.getMessage();
    }
    
    makeChat() {
        return (
        <section class="msger" id="chatbox">
            <main class="msger-chat">    
                {this.makeAllMessages()}
                {// <div ref={(el) => {this.messagesEnd = el}}></div> 
                }
                <div id="dummyScroll"></div>
            </main>

            <form class="msger-inputarea" onSubmit={this.handleEnter}>
                <input type="text" id="input" class="msger-input" placeholder="Send a message, you cunt"/>
                <Button type="button" class="msger-send-btn" onClick={this.handleClick}>Send</Button>
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

    makeMessageBubble(messageID) {
        const messageData = this.state.messages[messageID];
        var rightOrLeft = "";
        if (messageData["userID"] == this.state["userID"]) {
            rightOrLeft = "msg right-msg";
        } else {
            rightOrLeft = "msg left-msg";
        }
        return (
            <div class={rightOrLeft}>
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">{messageData.username}</div>
                        <div class="msg-info-time">{messageData.timestamp.seconds}</div>
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

    render() {
        return (
            <div>
                {this.makeHeader()}
                {this.makeChat(this.state.messages)}
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
                    console.log(data);
            });
        });
    }
    
    handleClick() {
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

    handleEnter(event) {
        event.preventDefault();
        this.handleClick();
    }
}

export default ChatApp;