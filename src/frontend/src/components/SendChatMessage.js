/**
 * Created by brett on 5/9/19.
 */

import React from 'react';
import "./SendChatMessage.scss"
import { FaCommentAlt } from "react-icons/fa";

export default class SendChatMessage extends React.Component {
    constructor(props){
        super(props);
        this.socket = props.socket;
        this.state = {
            message : "",
            userID : props.userID,
            roomID : props.roomID,
        };

        //bindings
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Change the state of state.message to the value inside
     * the send message bar.
     * @param event
     */
    handleChange(event){
        this.setState({message: event.target.value});
    }

    /**
     * On submit, we emit a `sendMessage` event back to the server.
     * The server then re-emits the message to all connected clients
     * in the room. (Including the person who sent it). - This is how
     * The message gets added to the chatbox.
     * @param event
     */
    handleSubmit(event){
        const message = this.state.message;
        this.socket.emit('sendMessage', this.state.roomID, this.state.userID, this.state.message);
        this.setState({
            message : ""
        });
        event.preventDefault();
    }

    /**
     * Render the send message box. Edit this html to change the layout of the
     * send message bar.
     * @returns {XML}
     */
    render(){
        return(
            <form className="sendForm" onSubmit={this.handleSubmit}>
                    <span className="sendLabel"><FaCommentAlt/></span>
                    <input className="sendInput" type="text" value={this.state.message} onChange={this.handleChange} placeholder="Type Here"/>
            </form>
        )
    }
}