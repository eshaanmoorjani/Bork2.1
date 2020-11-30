import React, { Component } from 'react';

import DailyIframe from '@daily-co/daily-js';

import { TextField, Button, AppBar, Menu, MenuItem } from '@material-ui/core';

import { auth, db, functions, rt_db } from '../services/firebase';

import './Chat.css';
import { throttle } from './LoginFirebase';
import { renderLoading } from './../index';


export default class LobbyApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatID: null,
            userID: auth.currentUser.uid,
            
            lobbyType: null,
            lobbyOpen: null,

            participants: {},
            numParticipants: 0,
        };

        this.init = this.init.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    
        this.chatListener = this.chatListener.bind(this);
        this.getChatID = this.getChatID.bind(this);
        this.addAllListeners = this.addAllListeners.bind(this);
        this.setPersistence = this.setPersistence.bind(this);
        
        this.init().then(() => {
            this.addAllListeners();
        });
    }

    render() {
        /* If the chat is still being created, do not render anything!! */
        if (this.state.chatID === null) {
            return null;
        }
        return (
            <div class="page">
                    <div class="full-frame-chat">
                        <LobbyFrame lobbyID={this.state.chatID} lobbyType={this.state.lobbyType} lobbyOpen={this.state.lobbyOpen}
                        numParticipants={this.state.numParticipants} participants={this.state.participants}/>

                        <ChatFrame chatID={this.state.chatID} userID={this.state.userID} username={this.props.username} initTime={new Date()}/>

                        <VideoFrame ref="videoFrame" videoCallURL={`https://hogpub.daily.co/${this.state.chatID}`} username={this.props.username} />
                    </div>

                    <HeaderFrame handleLogout={throttle(this.handleLogout, 10000)} handleLobbyStatusChange={this.handleLobbyStatusChange}
                     lobbyType={this.state.lobbyType} lobbyOpen={this.state.lobbyOpen}></HeaderFrame>
            </div>
        );
    }

    /** 
     * Redirect listeners after chatID has changed 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.chatID !== this.state.chatID) {
            this.addAllListeners();
        }
    }

    addAllListeners() {
        this.getChatID();
        this.chatListener();
    }

    /**
     * Assign this chat its correct chatID, lobbyOpen, and lobbyType
     */
    async init() {
        await db.collection("users").doc(this.state.userID).get().then(async user => {
            const chatID = user.data().chat_id;
            await db.collection("chats").doc(chatID).get().then(doc => {
                this.setState({
                    chatID: chatID,
                    lobbyOpen: doc.data().lobby_open,
                    lobbyType: doc.data().lobby_type,
                });
            });
        });
        this.setPersistence();
    }

    getChatID() {
        const ref = db.collection("users").doc(this.state.userID);
        ref.onSnapshot(doc => {
            if (!doc.exists) {
                return null;
            }
            const chatID = doc.data().chat_id; 
            this.setState({
                chatID: chatID,
            });
        });
    }

    chatListener() {
        const reloadIfLeft = (participants) => {
            if (!(this.state.userID in participants)) {
                window.location.reload();
            }
        }

        const ref = db.collection("chats").doc(this.state.chatID)
        ref.onSnapshot(doc => {
            if (!doc.exists) {
                return null;
            }
            const numParticipants = doc.data().num_participants;
            const lobbyOpen = doc.data().lobby_open;
            const lobbyType = doc.data().lobby_type;

            ref.collection("participants").orderBy("timestamp").get().then(querySnapshot => {
                var participants = {}
                querySnapshot.forEach(doc => {
                    participants[doc.data().user_id] = doc.data().username;
                });

                reloadIfLeft(participants);

                this.setState({
                    participants: participants,
                    numParticipants: numParticipants,
                    lobbyOpen: lobbyOpen,
                    lobbyType: lobbyType,
                });
            });
        });
    }

    handleLobbyStatusChange() {
        const changeLobbyStatus = functions.httpsCallable('changeLobbyStatus')
        const status = changeLobbyStatus({});
    }

    setPersistence() {
        var presenceRef = rt_db.ref("users/" + this.state.userID + "/is_disconnected");
        console.log("set persistence: ", this.state.userID);
        presenceRef.onDisconnect().set(true).then(() => {
          console.log("set to disconnected:", this.state.userID);
        });
      
        presenceRef.on("value", (snapshot) => {
          console.log("inside the weird function");
          if (snapshot.val()) {
            console.log("set to connected:", this.state.userID);
            presenceRef.set(false); 
          }
        });
      }

    // this deletes from local participants, need to delete from DATABASE
    async handleLogout() {
        // disconnect from the video call using the VideoFrame class's method
        if (this.refs.videoFrame || null !== null) {
            this.refs.videoFrame.disconnect();
        } 
        renderLoading();
        const signOut = functions.httpsCallable('signOut');
        
        await signOut({userId: this.state.userID, chatId: this.state.chatID, username: this.props.username}).then(result => { // CORS error that wasn't there earlier
        })
        .catch(function (error) {
            console.log(error);
        });
        auth.signOut()
    }

}

class HeaderFrame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const lightBlue = {
            background: '#2196F3',
            color: 'white',
        };

        const darkBlue = {
            height: '80%',
            color: 'white',
        };
        
        return (
            <AppBar className="appbar" position="sticky">
                <div className="toolbar">
                        <Button className="leave-lobby-temp" variant="contained" color="secondary"
                         onClick={this.props.handleLogout}>Leave Lobby</Button>
                        <Button className="start-queue-temp" variant="contained" color="primary" style={lightBlue}
                         onClick={this.props.handleLobbyStatusChange}>{this.getLobbyButtonMessage()}</Button>
                        <Button className="hog-pub-header-temp" variant="outlined" color="primary" style={darkBlue}><h1>The Pub</h1></Button>
                </div>
            </AppBar>
        );
    }

    getLobbyButtonMessage() {
        if (this.props.lobbyType === "Premade") {
            return this.props.lobbyOpen ? "Loading..." : "Find More Players";
        } else {
            return this.props.lobbyOpen ? "Close Lobby" : "Find More Players";
        }
    }
}

class LobbyFrame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLobbyID: false,
            showLobbyCapacity: false,
            showParticipants: false,
            menuOpen: false,
            anchorEl: null,
        };

        this.handleLobbyCapacityClick = this.handleLobbyCapacityClick.bind(this);
        this.handleLobbyIDEnter = this.handleLobbyIDEnter.bind(this);
        this.handleLobbyIDLeave = this.handleLobbyIDLeave.bind(this);
        this.handleLobbyIDClick = this.handleLobbyIDClick.bind(this);
        this.handleParticipantsClick = this.handleParticipantsClick.bind(this);
    }

    render() {
        return (
            <div class="lobby-frame">
                {this.misc()}
            </div>
        );
    }

    misc() {
        return (
            <div class="misc-box">
                {this.lobbyFrameButton(this.lobbyIDText(), this.handleLobbyIDClick, "lobby-id", this.handleLobbyIDEnter, this.handleLobbyIDLeave)}
                {this.simpleMenu()}
                {this.lobbyFrameButton(this.lobbyCapacityText(), this.handleLobbyCapacityClick)}
            </div>
        );
    }

    handleLobbyIDClick() {
        function copyToClipboard(str) {
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        };

        this.setState({
            showLobbyID: !this.state.showLobbyID,
        });
        
        copyToClipboard(this.props.lobbyID);
    }

    handleLobbyIDEnter() {
        const button = document.getElementById("lobby-id");
        button.innerText = this.props.lobbyID;
    }

    handleLobbyIDLeave() {
        const button = document.getElementById("lobby-id");
        button.innerText = this.lobbyIDText();
    }

    handleLobbyCapacityClick() {
        this.setState({
            showLobbyCapacity: !this.state.showLobbyCapacity,
        });
    }

    handleParticipantsClick() {
        this.setState({
            showParticipants: !this.state.showParticipants,
        })
    }

    lobbyIDText() {
        return this.state.showLobbyID ? "Copied!" : "Copy Lobby ID";
    }

    lobbyCapacityText() {
        return this.state.showLobbyCapacity ? this.props.numParticipants + "/10" : "Show Lobby Capacity";
    }

    participantsText() {
        return this.state.showParticipants ? this.makeParticipants() : "Show Participants";
    }

    lobbyFrameButton(text, clickHandler, id, enterHandler, leaveHandler) {
        const style = {
            height: '5%',
            width: '85%',
            marginLeft: 'auto',
            marginRight: 'auto',
    
            outline: 'none',
            color: 'black',
            borderColor: 'black',
            boxShadow: '2px 2px 5px -3px black',
            textTransform: 'none',
        }

        return (
            <Button className="lobby-frame-button" id={id} variant="outlined" style={style}
            onClick={clickHandler} onMouseOver={enterHandler} onMouseOut={leaveHandler} >{text}</Button>
        );
    }

    simpleMenu() {
        const handleClick = (event) => {
            this.setState({
                menuOpen: !this.state.menuOpen,
                anchorEl: event.currentTarget,
            })
        }

        const handleClose = () => {
            this.setState({
                menuOpen: false,
            })
        }

        const makeParticipants = () => {
            var participants = []
            for (var key in this.props.participants) {
                participants.push(<MenuItem onClick={handleClose}>{this.props.participants[key]}</MenuItem>)
            }
            return participants;
        }
      
        return (
            <React.Fragment>
                {this.lobbyFrameButton("Show Participants", handleClick, "participants")}
                <Menu keepMounted anchorEl={this.state.anchorEl} getContentAnchorEl={null} open={this.state.menuOpen} onClose={handleClose} 
                 anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} transformOrigin={{vertical: 'top', horizontal: 'center'}}> 
                    {makeParticipants()}
                </Menu>
            </React.Fragment>
        );
    }
}

class ChatFrame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numMessagesSent: 0,
            numMessagesReceived: 0,
            messages: {},
            lastMessageTime: Math.floor(this.props.initTime.getTime() / 1000),
            messageHelperText: "",
        }

        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.makeMessageBubble = this.makeMessageBubble.bind(this);

        this.getMessages = this.getMessages.bind(this);
        this.addAllListeners = this.addAllListeners.bind(this);

        this.addAllListeners();
    }

    render() {
        return (
            <div class="chat-frame-no-video" id="chat-frame">
                {this.messages()}
                {this.sendMessageBox()}
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        /* Auto scroll down */
        const scrollDiv = document.getElementById("dummyScroll");
        if (scrollDiv != null) {
            scrollDiv.scrollIntoView(true, { behavior: "smooth" });
        }

        /* Redirect listeners after chatID has changed */
        if (prevProps.chatID !== this.props.chatID) {
            this.addAllListeners();
        }
    }

    addAllListeners() {
        this.getMessages();
    }

    messages() {
        return (
            <div class="messages-frame">
                {this.makeMessages()}
                <div id="dummyScroll"></div>
            </div>
        );
    }

    makeMessages() {
        var messages = [];
        for (var key in this.state.messages) {
            messages.push(this.makeMessageBubble(key))
        }
        return messages;
    }

    makeMessageBubble(messageID) {
        function getFormattedTime(date) {
            var timeFormatted = date.toTimeString().substr(0,5);
            const hour = timeFormatted.substr(0, 2);
            if (hour == 0) {
                timeFormatted = "12" + timeFormatted.substr(2) + " am";
            } else if (hour <= 12) { // need to change 00:01 am to 12:01 am
                timeFormatted += " am";
            } else {
                timeFormatted = timeFormatted.substr(0, 2) % 12 + timeFormatted.substr(2, 5) + " pm";
            }
            return timeFormatted
        }

        function makeUserMessage(messageData, userID) {
            const messageClass = (messageData.userID == userID) ? "user-message" : "other-message";
            var date = new Date(messageData.timestamp.seconds * 1000);
            var timeFormatted = getFormattedTime(date);
            return (
                <div class={messageClass}>
                    <div class="message-bubble">
                        <div class="message-metadata">
                            <div class="message-username">{messageData.username}</div>
                            <div class="message-timestamp">{timeFormatted}</div>
                        </div>
                        <div class="message-content">
                            {messageData.content}
                        </div>
                    </div>
                </div>
            );
        }

        function makeStatusMessage(messageData, userID) {
            return (
                <div class="status-msg">
                    {messageData.content}
                </div>
            );
        }

        const messageData = this.state.messages[messageID];
        if (messageData.type == "user_content") {
            return makeUserMessage(messageData, this.props.userID);
        } else {
            return makeStatusMessage(messageData, this.props.userID);
        }
    }

    sendMessageBox() {
        return (
            <form class="send-message-form" onSubmit={this.handleSendMessage}>
                <TextField className="send-message-input" id="message-input" variant="outlined"
                 label="Enter a message" error={this.state.messageHelperText} helperText={this.state.messageHelperText} fullWidth={true} autoComplete="off"></TextField>
            </form>
        );
    }

    getMessages() {
        const ref = db.collection("chats").doc(this.props.chatID).collection("messages").orderBy("timestamp", "desc").limit(1);
        const unsubscribe = ref.onSnapshot(collection => {
            collection.forEach(doc => {
                const data = doc.data();
                    this.setState({
                        messages: {
                            ...this.state.messages,
                            [this.state.numMessagesReceived + 1]: data,
                        },
                        numMessagesReceived: this.state.numMessagesReceived + 1,
                        lastMessageTime: data.timestamp.seconds,
                    });
            });
        });
    }

    handleSendMessage(event) {
        event.preventDefault();
        const inputForm = document.getElementById("message-input");
        const message = inputForm.value;
        inputForm.value = "";
        if (message != "") {
            this.setState({
                numMessagesSent: this.state.numMessagesSent + 1,
            });
            this.sendMessage(message);
        }
    }

    sendMessage(message) {
        const send = functions.httpsCallable('sendMessage');
        const success = send({message: message, messageNumber: this.state.numMessagesSent}).then(result => {
            this.setState({
                messageHelperText: result.data.verified ? "" : result.data.message,
            });
        });
    }
}

class VideoFrame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            callFrame: null,
        };

        this.joinCall = this.joinCall.bind(this);
        this.makeCallFrame = this.makeCallFrame.bind(this);
        this.joinButton = this.joinButton.bind(this);

        this.addDisconnectListener = this.addDisconnectListener.bind(this);
        this.addListeners = this.addListeners.bind(this);
    }

    render() {
        return (
            <div class="video-frame-no-video" id="video-frame">
                {this.joinButton()}
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.videoCallURL !== this.props.videoCallURL) {
            this.disconnect();
        }
    }

    joinButton() {
        const style = {
            marginLeft: 'auto',
            marginRight: 'auto',
        };

        return (
            <Button className="join-video-button" id="join-video-button" variant="contained" color="primary" style={style} onClick={this.joinCall}>
                <p class="join-video-text">Join Voice and Video!</p>
            </Button>
        );
    }

    joinCall() {
        this.makeCallFrame();

        this.state.callFrame.join({url: this.props.videoCallURL});

        this.addListeners();
        this.cssYesVideo();
    }

    makeCallFrame() {
        const style = {
            iframeStyle: {
                position: "fixed",
                left: "16%",
                top: "8%",
                width: "48%",
                height: "90%",
            },
            showLeaveButton: true,
            showFullscreenButton: true,
            userName: this.props.username,
        };
        const callFrame = DailyIframe.createFrame(style);
        this.state.callFrame = callFrame;
    }

    addListeners() {
        this.addDisconnectListener();
    }

    addDisconnectListener() {
        this.state.callFrame.on("left-meeting", (event) => {
            this.state.callFrame.destroy();
            this.cssNoVideo();
        })
    }

    disconnect() {
        if (this.state.callFrame !== null) {
            this.state.callFrame.leave();
        }
    }

    cssYesVideo() {
        const chatFrame = document.getElementById("chat-frame");
        const videoFrame = document.getElementById("video-frame");
        chatFrame.setAttribute("class", "chat-frame-yes-video");
        videoFrame.setAttribute("class", "video-frame-yes-video");
    }

    cssNoVideo() {
        const chatFrame = document.getElementById("chat-frame");
        const videoFrame = document.getElementById("video-frame");
        chatFrame.setAttribute("class", "chat-frame-no-video");
        videoFrame.setAttribute("class", "video-frame-no-video");
    }
}