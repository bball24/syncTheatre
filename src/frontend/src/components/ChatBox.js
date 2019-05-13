/**
 * Created by brett on 5/9/19.
 */

import React from 'react';
import "./VideoQueue.scss";
import SendChatMessage from './SendChatMessage';
import RoomUsers from "./RoomUsers";

export default class ChatBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages : [],
            userID : props.userID,
            roomID : props.roomID,
            socket  : props.socket,
            apiHost : props.apiHost
        };

        this._userList = React.createRef();

        //bindings
        this.addMessage = this.addMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.renderMessages();
    }

    /**
     * addMessage
     * adds a message object to the messages array.
     * @NOTE This method is called when a `chatMessage` event is received.
     * @param user - the userID of the user who sent the message
     * @param text - the text of the message sent by the user
     */
    addMessage(user, text){
        console.log("adding msg");
        const msg = {
            user : user,
            text : text
        };
        this.setState({
            messages : [...this.state.messages, msg]
        });
    }

    updateUserList(){
        this._userList.current.updateUsers();
    }

    /**
     * render messages - maps the html seen below to each
     * element of the messages array.
     */
    renderMessages(){
        console.log(this.state.messages);
        if(this.state.messages){
            return this.state.messages.map((msg, i) => {
                return(
                    <div class="chatMessage" key={i}>
                        <span class="chatUser">{msg.user}</span>
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
        return[
            <RoomUsers
                key="userList"
                ref={this._userList}
                userID={this.state.userID}
                roomID={this.state.roomID}
                apiHost={this.state.apiHost}
            />,
            <div key="chatWrap" className="chatBox">
                <ul>
                    {this.renderMessages()}
                </ul>
            </div>,
            <SendChatMessage
                key="sendMsg"
                socket={this.state.socket}
                userID={this.state.userID}
                roomID={this.state.roomID}
            />
        ]
    }
}