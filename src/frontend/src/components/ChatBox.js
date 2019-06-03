/**
 * Created by brett on 5/9/19.
 */

import React from 'react';
import ReactDom from 'react-dom'
import "./VideoQueue.scss";
import SendChatMessage from './SendChatMessage';
import RoomUsers from "./RoomUsers";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import axios from 'axios';
import { FaCrown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import "./ChatBox.scss"
import { Button } from 'react-bootstrap'

export default class ChatBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages : [],
            users : [],
            userID : props.userID,
            roomID : props.roomID,
            socket  : props.socket,
            apiHost : props.apiHost,
            partyLeaderID : props.partyLeaderID,
            founderID : props.founderID,
            theatreMode : props.theatreMode
        };

        this.state._userList = React.createRef();

        //bindings
        this.addMessage = this.addMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
        this.updateUserList = this.updateUserList.bind(this);
        this.changePartyLeaderTo = this.changePartyLeaderTo.bind(this);
        this.toggleTheatreMode = this.toggleTheatreMode.bind(this);
        this.renderMessages();
        this.updateUserList()
    }

    toggleTheatreMode(){
        this.setState({
            theatreMode : !this.state.theatreMode
        })
    }

    /**
     * addMessage
     * adds a message object to the messages array.
     * @NOTE This method is called when a `chatMessage` event is received.
     * @param user - the userID of the user who sent the message
     * @param text - the text of the message sent by the user
     */
    addMessage(userName, userID, text){
        const msg = {
            userName: userName,
            userID : userID,
            text : text
        };
        this.setState({
            messages : [...this.state.messages, msg]
        });
    }

    updateUserList(){
        const url = this.state.apiHost + '/api/rooms/users/' + this.state.roomID;
        axios.get(url).then((users) => {
            this.setState({
                users : users.data.users
            });

        })
        .catch((err) => {
            console.error(err);
        })
    }

    isInViewport(offset = 0){
        if (!this.tabsRef) return false;
        const top = this.tabsRef.getBoundingClientRect().top;
        console.log(top);
        console.log(window.innerHeight);
        return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
    }

    scrollToBottom = () => {
        if(this.isInViewport()){
            if(this.messagesEnd){
                this.messagesEnd.scrollIntoView({behavior: "smooth"});
            }
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    changePartyLeaderTo(newLeaderID){
        this.state.socket.emit('leaderChange', this.state.roomID, this.state.userID, newLeaderID );
    }

    updateCurrentLeader(newLeaderID){
        console.log("chatbox updating leader with ID" + newLeaderID);
        this.setState({ partyLeaderID : newLeaderID });
    }

    renderUsers(){
        let curUserIsLeader = this.state.partyLeaderID == this.state.userID;
        if(this.state.users && this.state.partyLeaderID !== -1) {
            return this.state.users.map((user, i) => {
                if(user.isPartyLeader){
                    return (
                        <div className="userLine" key={i}>
                            <span className="crownIcon">
                                <FaCrown/>
                                <span className="userText">{user.userName}</span>
                                {user.userID == this.state.userID && <span> (you)</span>}
                            </span>
                        </div>
                    )
                }
                else{
                    return (
                        <div className="userLine" key={i}>
                            <span className="userIcon">
                                <FaUser/>
                                <span className="userText">{user.userName}</span>
                                {user.userID == this.state.userID && <span> (you)</span>}
                            </span>
                            {curUserIsLeader &&
                            <Button onClick={() => {this.changePartyLeaderTo(user.userID)}}
                                className="changePLButton"
                                variant="outline-secondary"
                                size="sm">
                                <FaArrowUp className="buttonUp"/> Make Leader
                            </Button>
                            }
                        </div>
                    )
                }

            })
        }
        else{
            return <li>Loading..</li>
        }
    }

    /**
     * render messages - maps the html seen below to each
     * element of the messages array.
     */
    renderMessages(){
        if(this.state.messages){
            //@TODO use msg.userID to build an <a href=/user/profile/msg.userID>msg.userName</a> link
            // for the chatUser span
            return this.state.messages.map((msg, i) => {
                return(
                    <div class="chatMessage" key={i}>
                        <span class="chatUser">{msg.userName}:  </span>
                        <span class="chatText">{msg.text}</span>
                    </div>
                );
            });
        }
        else{
            return <li>Loading Messages..</li>
        }
    }

    /**
     * render
     * renders the chat. Chat messages are added by calling the
     * renderMessages() function. The send message 'bar' is
     * instantiated here as <SendChatMessage. To change the html
     * layout of hte send message bar look in the SendChatMessage
     * component.
     * @returns {[XML,XML]}
     */
    render(){

        if(this.state.theatreMode){
            return[
                <span ref={(el) => { this.tabsRef = el; }}></span>,
                <Tabs style={{ width: '100%' }}>
                    <TabList>
                        <Tab>Users</Tab>
                        <Tab>Chat</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="UserList">
                            <div>
                                {this.renderUsers()}
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div key="chatWrap" className="chatBox">
                            <div className="chatList">
                                {this.renderMessages()}
                            </div>
                        </div>
                        <SendChatMessage
                            key="sendMsg"
                            socket={this.state.socket}
                            userID={this.state.userID}
                            roomID={this.state.roomID}
                        />
                    </TabPanel>
                </Tabs>

            ]
        }
        else{
            return[
                <span ref={(el) => { this.tabsRef = el; }}></span>,
                <Tabs>
                    <TabList>
                        <Tab>Users</Tab>
                        <Tab>Chat</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="UserList">
                            <div>
                                {this.renderUsers()}
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div key="chatWrap" className="chatBox">
                            <div className="chatList">
                                {this.renderMessages()}
                                <div style={{ float:"left", clear: "both" }}
                                     ref={(el) => { this.messagesEnd = el; }}>
                                </div>
                            </div>
                        </div>
                        <SendChatMessage
                            key="sendMsg"
                            socket={this.state.socket}
                            userID={this.state.userID}
                            roomID={this.state.roomID}
                        />
                    </TabPanel>
                </Tabs>
            ]
        }

    }
}