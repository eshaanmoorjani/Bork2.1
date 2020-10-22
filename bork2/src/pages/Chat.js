import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Chat.css';
import { BorkHeader } from './Login';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "1111",
            participants: new Set(),
            messages: {
                "1": {
                    message: "I am dogshit at VALORANT",
                    username: "Vijen",
                    userID: "1111",
                    time: "5:35 pm",
                },
                "2": {
                    message: "I agree.",
                    username: "Drmoor",
                    userID: "2222",
                    time: "5:36 pm",
                }
            }, // messageID: {message: "a", username: "vijen", userID: "q3d8ds", time: "12:08:2032"}
        }
    }
    
    makeChat() {
        return (<section class="msger">
            <header class="msger-header">
                <div class="msger-header-title">
                <i class="fas fa-comment-alt"></i> Bork.cc
                </div>
                <div class="msger-header-options">
                <span><i class="fas fa-cog"></i></span>
                </div>
            </header>

            <main class="msger-chat">    
                {this.makeAllMessages()}
            </main>

            <form class="msger-inputarea">
                <input type="text" class="msger-input" placeholder="Send a message, you cunt"/>
                <button type="submit" class="msger-send-btn">Send</button>
            </form>
            </section>
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
                        <div class="msg-info-name">{messageData["username"]}</div>
                        <div class="msg-info-time">{messageData["time"]}</div>
                    </div>

                    <div class="msg-text">
                        {messageData["message"]}
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
        return this.makeChat(this.state.messages);
    }
}

export default ChatApp;