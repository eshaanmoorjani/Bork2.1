import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {auth, db, firebase} from '../services/firebase';

import './Chat.css';
import { BorkHeader } from './Login';
import { Button } from 'react-bootstrap';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            chatID: "0",
            userID: auth.currentUser.uid,
            numParticipants: 0,
            lastMessageTime: Math.floor(date.getTime() / 1000),
            numMessages: 2,
            messages: {
                "1": {
                    content: "I am dogshit at VALORANT",
                    username: "Vijen",
                    userID: auth.currentUser.uid,
                    timestamp: {
                        seconds: "123",
                        nanoseconds: "123000",
                    }
                },
                "2": {
                    content: "I agree.",
                    username: "Drmoor",
                    userID: "2222",
                    timestamp: {
                        seconds: "321",
                        nanoseconds: "321000",
                    }
                }
            }, // messageID: {message: "a", username: "vijen", userID: "q3d8ds", time: "12:08:2032"}
        };
        this.getMessage = this.getMessage.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.getMessage();
    }
    
    makeChat() {
        return (
        <section class="msger">
            <main class="msger-chat">    
                {this.makeAllMessages()}
            </main>

            <form class="msger-inputarea" onSubmit={this.handleEnter}>
                <input type="text" id="input" class="msger-input" placeholder="Send a message, you cunt"/>
                <Button type="button" class="msger-send-btn" onClick={this.handleClick}>Send</Button>
            </form>
        </section>
        );
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
        const ref = firebase.firestore().collection("chats").doc(this.state.chatID).collection("messages");
        ref.onSnapshot(collection => {
            // var changes = collection.docChanges();
            // changes.forEach(function(change) {
            //     console.log("here");
            //     const data = change.doc.data();
            //     console.log(this);
            //     if (data.timestamp.seconds >= this.state.lastMessageTime) {
            //         this.setState({lastMessageTime: data.timestamp.seconds});
            //         this.setState({
            //             ...this.state,
            //             messages: {
            //                 ...this.state.messages,
            //                 [this.state.numMessages + 1]: data,
            //             }
            //         });
            //         this.state.numMessages += 1;
            //     }
            // })
            collection.forEach(doc => {
                const data = doc.data();
                console.log(data.timestamp);
                if (data.timestamp.seconds >= this.state.lastMessageTime) {
                    this.setState({lastMessageTime: data.timestamp.seconds});
                    this.setState({
                        ...this.state,
                        messages: {
                            ...this.state.messages,
                            [this.state.numMessages + 1]: data,
                        }
                    });
                    this.state.numMessages += 1;
                }
            });
        });
    }

    
    handleClick() {
        const inputForm = document.getElementById("input");
        const message = inputForm.value;
        inputForm.value = "";
        if (message != "") {
            db.collection("chats/").doc(this.state.chatID).collection("messages/").add({
                content: message,
                timestamp: new Date(),
                userID: this.state.userID,
                username: "vijen the peejen",
            });
        }
    }

    handleEnter(event) {
        event.preventDefault();
        this.handleClick();
    }

}


export default ChatApp;