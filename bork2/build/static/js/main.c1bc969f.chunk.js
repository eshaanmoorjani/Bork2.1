(this.webpackJsonpbork2=this.webpackJsonpbork2||[]).push([[0],{55:function(e,t,a){e.exports=a.p+"static/media/pig_logo.d0d99a55.png"},68:function(e,t,a){e.exports=a(94)},85:function(e,t,a){},86:function(e,t,a){},92:function(e,t,a){},93:function(e,t,a){},94:function(e,t,a){"use strict";a.r(t),a.d(t,"renderLogin",(function(){return G})),a.d(t,"renderPageWithUserID",(function(){return Y})),a.d(t,"renderChat",(function(){return K})),a.d(t,"renderLoading",(function(){return Z}));var n=a(18),o=a.n(n),s=a(26),r=a(0),i=a.n(r),c=a(8),l=a.n(c);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var u=a(74);u.initializeApp({apiKey:"AIzaSyBriNz3DFDo1ra0CmHC0_ZpoCYnonSWOoo",authDomain:"bork-cc.firebaseapp.com",projectId:"bork-cc",databaseURL:"https://bork-cc.firebaseio.com"});var d=u.auth(),b=u.firestore(),h=u.database(),m=u.functions(),p=(a(85),a(14)),y=a(15),f=a(20),v=a(19),g=a(137),E=a(130),j=a(134);a(86);function L(){C(document.getElementById("solo-queue-button"),"soloQueue"),function(){var e=document.getElementById("join-lobby-button"),t=document.getElementById("join-input-button");C(e,"joinLobby"),C(t,"joinLobby")}(),function(){var e=document.getElementById("create-lobby-button"),t=document.getElementById("create-input-button");C(e,"createLobby"),C(t,"createLobby")}()}function k(){!function(){var e=document.getElementById("solo-queue-button");e.parentNode.replaceChild(e.cloneNode(!0),e)}(),function(){var e=document.getElementById("join-lobby-button"),t=document.getElementById("join-input-button");e.parentNode.replaceChild(e.cloneNode(!0),e),t.parentNode.replaceChild(t.cloneNode(!0),t)}(),function(){var e=document.getElementById("create-lobby-button"),t=document.getElementById("create-input-button");e.parentNode.replaceChild(e.cloneNode(!0),e),t.parentNode.replaceChild(t.cloneNode(!0),t)}()}function C(e,t){e.addEventListener("click",function(e){function t(){return(t=Object(s.a)(o.a.mark((function t(){var a,n,s,r,i,c;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=document.getElementById("username-textfield"),n=a.value,s=O(e),Z(),r=m.httpsCallable("signIn"),t.next=7,r({username:n,chatID:s,signInType:e});case 7:i=t.sent,c=i.data,console.log(c),c.usernameError||c.createLobbyError||c.joinLobbyError?(G(c.usernameError,c.usernameErrorMessage,c.createLobbyError,c.createLobbyErrorMessage,c.joinLobbyError,c.joinLobbyErrorMessage),k(),L()):K(c.chatID,c.username);case 11:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return I((function(){return t.apply(this,arguments)}),2e3)}(t))}function I(e,t){var a=0;return function(){var n=new Date;n-a>=t?(e(),a=n):console.log("waiting")}}function O(e){var t=document.getElementById("join-lobby-input"),a=document.getElementById("create-lobby-input");return"joinLobby"===e?t.value:"createLobby"===e?a.value:null}var S=a(55),D=a.n(S),x=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){return Object(p.a)(this,a),t.call(this,e)}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"full-frame-login"},this.loginFrame())}},{key:"loginFrame",value:function(){return i.a.createElement("div",{class:"login-frame"},i.a.createElement(w,this.props),i.a.createElement(M,null))}}]),a}(r.Component),w=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){return Object(p.a)(this,a),t.call(this,e)}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"form-frame"},this.description(),i.a.createElement(B,this.props))}},{key:"description",value:function(){return i.a.createElement("div",{class:"descriptions"},i.a.createElement("h2",{class:"main-description"},"Enter Among Us Lobbies!"),i.a.createElement("h3",{class:"sub-description"},i.a.createElement("p",{id:"username-warning"})))}}]),a}(r.Component),B=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(p.a)(this,a),(n=t.call(this,e)).styles={soloStyle:{fontSize:20,background:"linear-gradient(45deg, #2196F3 5%, #21CBF3 90%)",color:"white"},createStyle:{height:"100%",width:"100%",borderWidth:1.2,borderColor:"#21CBF3",fontSize:20,color:"#21CBF3"},joinStyle:{height:"100%",width:"100%",borderWidth:1.2,borderColor:"#21CBF3",fontSize:20,color:"#21CBF3"},textFieldStyle:{borderTopRightRadius:"0px",borderBottomRightRadius:"0px",borderTopLeftRadius:"20px",borderBottomLeftRadius:"20px"},buttonStyle:{height:"100%",width:"30%",borderTopRightRadius:"20px",borderBottomRightRadius:"20px",borderTopLeftRadius:"0px",borderBottomLeftRadius:"0px",background:"#21CBF3",color:"white"}},n}return Object(y.a)(a,[{key:"render",value:function(){return this.formGrid()}},{key:"formGrid",value:function(){return i.a.createElement(E.a,{container:!0,class:"container"},i.a.createElement(g.a,{class:"username-textfield",id:"username-textfield",variant:"outlined",error:this.props.usernameError,label:"Username",helperText:this.props.usernameHelperText,fullWidth:!0,autoComplete:"off",InputLabelProps:{style:{fontSize:25}},InputProps:{style:{height:65,fontSize:25}},inputProps:{style:{fontSize:40,textAlign:"center"}}}),i.a.createElement(j.a,{className:"solo-queue-button",id:"solo-queue-button",variant:"contained",color:"primary",size:"large",fullWidth:!0,style:this.styles.soloStyle},"Solo Queue"),i.a.createElement(E.a,{item:!0,class:"buttons"},this.createLobbyButtonSet(),this.joinLobbyButtonSet()))}},{key:"createLobbyButtonSet",value:function(){return i.a.createElement("div",{id:"create-lobby-box",onMouseEnter:this.displayChange("create-invis","create-show"),onMouseLeave:this.displayChange("create-show","create-invis")},i.a.createElement(j.a,{id:"create-lobby-button",variant:"outlined",color:"primary",size:"large",fullWidth:!0,style:this.styles.createStyle},"Create Lobby"),this.createLobbyDropdown())}},{key:"joinLobbyButtonSet",value:function(){return i.a.createElement("div",{id:"join-lobby-box",onMouseEnter:this.displayChange("join-invis","join-show"),onMouseLeave:this.displayChange("join-show","join-invis")},i.a.createElement(j.a,{id:"join-lobby-button",variant:"outlined",color:"primary",size:"large",fullWidth:!0,style:this.styles.joinStyle},"Join Lobby"),this.joinLobbyDropdown())}},{key:"createLobbyDropdown",value:function(){return i.a.createElement("div",{class:"create-lobby-div",id:"create-invis"},i.a.createElement(g.a,{className:"create-lobby-input",hidden:!0,id:"create-lobby-input",variant:"outlined",type:"text",autoComplete:"off",label:"Enter Lobby ID",error:this.props.createLobbyError,helperText:this.props.createLobbyHelperText,InputProps:{style:this.styles.textFieldStyle}}),i.a.createElement(j.a,{id:"create-input-button",variant:"contained",color:"primary",style:this.styles.buttonStyle},i.a.createElement("p",{class:"create-input-text"},"Create!")))}},{key:"joinLobbyDropdown",value:function(){return i.a.createElement("div",{class:"join-lobby-div",id:"join-invis"},i.a.createElement(g.a,{className:"join-lobby-input",hidden:!0,id:"join-lobby-input",variant:"outlined",type:"text",autoComplete:"off",label:"Enter Lobby ID",error:this.props.joinLobbyError,helperText:this.props.joinLobbyHelperText,InputProps:{style:this.styles.textFieldStyle}}),i.a.createElement(j.a,{id:"join-input-button",variant:"contained",color:"primary",style:this.styles.buttonStyle},i.a.createElement("p",{class:"join-input-text"},"Join!")))}},{key:"displayChange",value:function(e,t){return function(){var a=document.getElementById(e);null!==a&&a.setAttribute("id",t)}}}]),a}(r.Component),M=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(){return Object(p.a)(this,a),t.apply(this,arguments)}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"hog-pub-frame"},this.hogPubHeader(),this.comingSoon(),this.logo())}},{key:"hogPubHeader",value:function(){return i.a.createElement("h1",{class:"header"},"Hog Pub")}},{key:"comingSoon",value:function(){return i.a.createElement("h3",{class:"coming-soon"},"Other games coming soon!")}},{key:"logo",value:function(){return i.a.createElement("img",{class:"logo",src:D.a,alt:"logo"})}}]),a}(r.Component);var T=a(46),F=a(50),P=a(12),N=a(57),A=a(135),R=a(58),H=a(138),z=(a(92),function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(p.a)(this,a),(n=t.call(this,e)).state={chatID:null,userID:d.currentUser.uid,lobbyType:null,lobbyOpen:null,participants:{},numParticipants:0},n.getChatIDInit=n.getChatIDInit.bind(Object(P.a)(n)),n.getChatIDInit().then((function(){n.setLobbySettings(),n.handleLogout=n.handleLogout.bind(Object(P.a)(n)),n.getParticipants=n.getParticipants.bind(Object(P.a)(n)),n.handleLobbyStatusChange=n.handleLobbyStatusChange.bind(Object(P.a)(n)),n.changeConnectionStatus=n.changeConnectionStatus.bind(Object(P.a)(n)),n.chatListener=n.chatListener.bind(Object(P.a)(n)),n.getChatID=n.getChatID.bind(Object(P.a)(n)),n.addAllListeners=n.addAllListeners.bind(Object(P.a)(n)),n.addAllListeners()})),n}return Object(y.a)(a,[{key:"render",value:function(){return null===this.state.chatID?null:i.a.createElement("div",{class:"page"},i.a.createElement("div",{class:"full-frame-chat"},i.a.createElement(_,{lobbyID:this.state.chatID,lobbyType:this.state.lobbyType,lobbyOpen:this.state.lobbyOpen,numParticipants:this.state.numParticipants,participants:this.state.participants}),i.a.createElement(W,{chatID:this.state.chatID,userID:this.state.userID,username:this.props.username,initTime:new Date}),i.a.createElement(V,{ref:"videoFrame",videoCallURL:"https://hogpub.daily.co/".concat(this.state.chatID),username:this.props.username})),i.a.createElement(U,{handleLogout:I(this.handleLogout,1e4),handleLobbyStatusChange:this.handleLobbyStatusChange,lobbyType:this.state.lobbyType,lobbyOpen:this.state.lobbyOpen}))}},{key:"componentDidUpdate",value:function(e,t){t.chatID!==this.state.chatID&&this.addAllListeners()}},{key:"addAllListeners",value:function(){this.getChatID(),this.getParticipants(),this.changeConnectionStatus(),this.chatListener()}},{key:"getChatIDInit",value:function(){var e=Object(s.a)(o.a.mark((function e(){var t=this;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.collection("users").doc(this.state.userID).get().then((function(e){t.setState({chatID:e.data().chat_id})}));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getChatID",value:function(){var e=this;b.collection("users").doc(this.state.userID).onSnapshot((function(t){if(!t.exists)return null;var a=t.data().chat_id;e.setState({chatID:a})}))}},{key:"getParticipants",value:function(){var e=this;b.collection("chats").doc(this.state.chatID).collection("participants").orderBy("timestamp").onSnapshot((function(t){var a={};t.forEach((function(e){var t=e.data();a[t.user_id]=t.username})),e.setState({participants:a})}))}},{key:"chatListener",value:function(){var e=this;b.collection("chats").doc(this.state.chatID).onSnapshot((function(t){if(!t.exists)return null;var a=t.data().num_participants,n=t.data().lobby_open,o=t.data().lobby_type;e.setState({numParticipants:a,lobbyOpen:n,lobbyType:o})}))}},{key:"setLobbySettings",value:function(){var e=Object(s.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.collection("chats").doc(this.state.chatID).get();case 2:t=e.sent,this.setState({lobbyOpen:t.data().lobby_open,lobbyType:t.data().lobby_type});case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"changeConnectionStatus",value:function(){h.ref("users/"+this.state.userID+"/is_disconnected").set(!1),h.ref("users/"+this.state.userID+"/is_disconnected").onDisconnect().set(!0)}},{key:"handleLobbyStatusChange",value:function(){m.httpsCallable("changeLobbyStatus")({}).then((function(e){console.log(e.data)}))}},{key:"handleLogout",value:function(){var e=Object(s.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.refs.videoFrame&&this.refs.videoFrame.disconnect(),Z(),t=m.httpsCallable("deleteUserInfo"),e.next=5,t({userId:this.state.userID,chatId:this.state.chatID,username:this.props.username}).then((function(e){})).catch((function(e){console.log(e)}));case 5:d.signOut();case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),a}(r.Component)),U=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){return Object(p.a)(this,a),t.call(this,e)}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement(A.a,{className:"appbar",position:"sticky"},i.a.createElement("div",{className:"toolbar"},i.a.createElement(j.a,{className:"leave-lobby-temp",variant:"contained",color:"secondary",onClick:this.props.handleLogout},"Leave Lobby"),i.a.createElement(j.a,{className:"start-queue-temp",variant:"contained",color:"primary",style:{background:"#2196F3",color:"white"},onClick:this.props.handleLobbyStatusChange},this.getLobbyButtonMessage()),i.a.createElement(j.a,{className:"hog-pub-header-temp",variant:"outlined",color:"primary",style:{height:"80%",color:"white"}},i.a.createElement("h1",null,"The Pub"))))}},{key:"getLobbyButtonMessage",value:function(){return"Premade"===this.props.lobbyType?this.props.lobbyOpen?"Loading...":"Find a match!":this.props.lobbyOpen?"Close Lobby":"Open Lobby"}}]),a}(r.Component),_=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(p.a)(this,a),(n=t.call(this,e)).state={showLobbyID:!1,showLobbyCapacity:!1,showParticipants:!1,menuOpen:!1,anchorEl:null},n.handleLobbyCapacityClick=n.handleLobbyCapacityClick.bind(Object(P.a)(n)),n.handleLobbyIDClick=n.handleLobbyIDClick.bind(Object(P.a)(n)),n.handleParticipantsClick=n.handleParticipantsClick.bind(Object(P.a)(n)),n}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"lobby-frame"},this.misc())}},{key:"misc",value:function(){return i.a.createElement("div",{class:"misc-box"},this.lobbyFrameButton(this.lobbyIDText(),this.handleLobbyIDClick),this.simpleMenu(),this.lobbyFrameButton(this.lobbyCapacityText(),this.handleLobbyCapacityClick))}},{key:"handleLobbyIDClick",value:function(){this.setState({showLobbyID:!this.state.showLobbyID})}},{key:"handleLobbyCapacityClick",value:function(){this.setState({showLobbyCapacity:!this.state.showLobbyCapacity})}},{key:"handleParticipantsClick",value:function(){this.setState({showParticipants:!this.state.showParticipants})}},{key:"lobbyIDText",value:function(){return this.state.showLobbyID?this.props.lobbyID:"Show Lobby ID"}},{key:"lobbyCapacityText",value:function(){return this.state.showLobbyCapacity?this.props.numParticipants+"/10":"Show Lobby Capacity"}},{key:"participantsText",value:function(){return this.state.showParticipants?this.makeParticipants():"Show Participants"}},{key:"lobbyFrameButton",value:function(e,t,a){return i.a.createElement(j.a,{className:"lobby-frame-button",id:a,variant:"outlined",onClick:t,style:{height:"5%",width:"85%",marginLeft:"auto",marginRight:"auto",outline:"none",color:"black",borderColor:"black",boxShadow:"2px 2px 5px -3px black"}},e)}},{key:"simpleMenu",value:function(){var e=this,t=function(){e.setState({menuOpen:!1})};return i.a.createElement(i.a.Fragment,null,this.lobbyFrameButton("Show Participants",(function(t){e.setState({menuOpen:!e.state.menuOpen,anchorEl:t.currentTarget})}),"participants"),i.a.createElement(R.a,{keepMounted:!0,anchorEl:this.state.anchorEl,open:this.state.menuOpen,onClose:t,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"bottom",horizontal:"center"}},function(){var a=[];for(var n in e.props.participants)a.push(i.a.createElement(H.a,{onClick:t},e.props.participants[n]));return a}()))}}]),a}(r.Component),W=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(p.a)(this,a),(n=t.call(this,e)).state={numMessagesSent:0,numMessagesReceived:0,messages:{},lastMessageTime:Math.floor(n.props.initTime.getTime()/1e3),messageHelperText:""},n.handleSendMessage=n.handleSendMessage.bind(Object(P.a)(n)),n.sendMessage=n.sendMessage.bind(Object(P.a)(n)),n.makeMessageBubble=n.makeMessageBubble.bind(Object(P.a)(n)),n.getMessages=n.getMessages.bind(Object(P.a)(n)),n.addAllListeners=n.addAllListeners.bind(Object(P.a)(n)),n.addAllListeners(),n}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"chat-frame-no-video",id:"chat-frame"},this.messages(),this.sendMessageBox())}},{key:"componentDidUpdate",value:function(e,t){var a=document.getElementById("dummyScroll");null!=a&&a.scrollIntoView(!0,{behavior:"smooth"}),e.chatID!==this.props.chatID&&this.addAllListeners()}},{key:"addAllListeners",value:function(){this.getMessages()}},{key:"messages",value:function(){return i.a.createElement("div",{class:"messages-frame"},this.makeMessages(),i.a.createElement("div",{id:"dummyScroll"}))}},{key:"makeMessages",value:function(){var e=[];for(var t in this.state.messages)e.push(this.makeMessageBubble(t));return e}},{key:"makeMessageBubble",value:function(e){var t=this.state.messages[e];return"user_content"==t.type?function(e,t){var a=e.userID==t?"user-message":"other-message",n=function(e){var t=e.toTimeString().substr(0,5),a=t.substr(0,2);return 0==a?t="12"+t.substr(2)+" am":a<=12?t+=" am":t=t.substr(0,2)%12+t.substr(2,5)+" pm",t}(new Date(1e3*e.timestamp.seconds));return i.a.createElement("div",{class:a},i.a.createElement("div",{class:"message-bubble"},i.a.createElement("div",{class:"message-metadata"},i.a.createElement("div",{class:"message-username"},e.username),i.a.createElement("div",{class:"message-timestamp"},n)),i.a.createElement("div",{class:"message-content"},e.content)))}(t,this.props.userID):function(e,t){return i.a.createElement("div",{class:"status-msg"},e.content)}(t,this.props.userID)}},{key:"sendMessageBox",value:function(){return i.a.createElement("form",{class:"send-message-form",onSubmit:this.handleSendMessage},i.a.createElement(g.a,{className:"send-message-input",id:"message-input",variant:"outlined",label:"Enter a message",error:this.state.messageHelperText,helperText:this.state.messageHelperText,fullWidth:!0,autoComplete:"off"}))}},{key:"getMessages",value:function(){var e=this;b.collection("chats").doc(this.props.chatID).collection("messages").orderBy("timestamp","desc").limit(1).onSnapshot((function(t){t.forEach((function(t){var a=t.data();e.setState({messages:Object(F.a)(Object(F.a)({},e.state.messages),{},Object(T.a)({},e.state.numMessagesReceived+1,a)),numMessagesReceived:e.state.numMessagesReceived+1,lastMessageTime:a.timestamp.seconds})}))}))}},{key:"handleSendMessage",value:function(e){e.preventDefault();var t=document.getElementById("message-input"),a=t.value;t.value="",""!=a&&(this.setState({numMessagesSent:this.state.numMessagesSent+1}),this.sendMessage(a))}},{key:"sendMessage",value:function(e){var t=m.httpsCallable("sendMessage"),a=this;t({message:e,messageNumber:this.state.numMessagesSent}).then((function(e){e.data.verified?a.setState({messageHelperText:""}):a.setState({messageHelperText:e.data.message})}))}}]),a}(r.Component),V=function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(p.a)(this,a),(n=t.call(this,e)).state={callFrame:null},n.joinCall=n.joinCall.bind(Object(P.a)(n)),n.makeCallFrame=n.makeCallFrame.bind(Object(P.a)(n)),n.joinButton=n.joinButton.bind(Object(P.a)(n)),n.addDisconnectListener=n.addDisconnectListener.bind(Object(P.a)(n)),n.addListeners=n.addListeners.bind(Object(P.a)(n)),n}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"video-frame-no-video",id:"video-frame"},this.joinButton())}},{key:"componentDidUpdate",value:function(e,t){e.videoCallURL!==this.props.videoCallURL&&this.disconnect()}},{key:"joinButton",value:function(){return i.a.createElement(j.a,{className:"join-video-button",id:"join-video-button",variant:"contained",color:"primary",style:{marginLeft:"auto",marginRight:"auto"},onClick:this.joinCall},i.a.createElement("p",{class:"join-video-text"},"Join Voice and Video!"))}},{key:"joinCall",value:function(){this.makeCallFrame(),this.state.callFrame.join({url:this.props.videoCallURL}),this.addListeners(),this.cssYesVideo()}},{key:"makeCallFrame",value:function(){var e={iframeStyle:{position:"fixed",left:"16%",top:"8%",width:"48%",height:"90%"},showLeaveButton:!0,showFullscreenButton:!0,userName:this.props.username},t=N.a.createFrame(e);this.state.callFrame=t}},{key:"addListeners",value:function(){this.addDisconnectListener()}},{key:"addDisconnectListener",value:function(){var e=this;this.state.callFrame.on("left-meeting",(function(t){e.state.callFrame.destroy(),e.cssNoVideo()}))}},{key:"disconnect",value:function(){null!==this.state.callFrame&&this.state.callFrame.leave()}},{key:"cssYesVideo",value:function(){var e=document.getElementById("chat-frame"),t=document.getElementById("video-frame");e.setAttribute("class","chat-frame-yes-video"),t.setAttribute("class","video-frame-yes-video")}},{key:"cssNoVideo",value:function(){var e=document.getElementById("chat-frame"),t=document.getElementById("video-frame");e.setAttribute("class","chat-frame-no-video"),t.setAttribute("class","video-frame-no-video")}}]),a}(r.Component),q=a(136),J=(a(93),function(e){Object(f.a)(a,e);var t=Object(v.a)(a);function a(){return Object(p.a)(this,a),t.apply(this,arguments)}return Object(y.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{class:"full-frame-loading"},i.a.createElement("h1",{class:"hog-pub-text"},"Hog Pub"),i.a.createElement("h2",{class:"loading-text"},"Loading..."),i.a.createElement(q.a,{size:100,className:"loading"}))}}]),a}(r.Component));function G(e,t,a,n,o,s){l.a.render(i.a.createElement(x,{usernameError:e,usernameHelperText:t,createLobbyError:a,createLobbyHelperText:n,joinLobbyError:o,joinLobbyHelperText:s}),document.getElementById("root")),d.setPersistence(u.auth.Auth.Persistence.SESSION).then((function(){return d.signInAnonymously()}))}function Y(e){return Q.apply(this,arguments)}function Q(){return(Q=Object(s.a)(o.a.mark((function e(t){var a,n,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=b.collection("users").doc(t),n="",s="",e.next=5,a.get().then((function(e){e.exists&&(n=e.data().chat_id,s=e.data().username)})).catch((function(e){console.error("broke here ",e)}));case 5:""!==n?K(n,s):(console.log("poo"),G(),k(),L());case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function K(e,t){l.a.render(i.a.createElement(z,{chatID:e,username:t}),document.getElementById("root"))}function Z(){l.a.render(i.a.createElement(J,null),document.getElementById("root"))}d.onAuthStateChanged((function(e){console.log("AUTH CHANGED!!!: ",e),e?Y(e.uid):(G(),k(),L())})),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[68,1,2]]]);
//# sourceMappingURL=main.c1bc969f.chunk.js.map