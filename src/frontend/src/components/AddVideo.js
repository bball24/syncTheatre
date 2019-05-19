/**
 * Created by brett on 5/5/19.
 */

import React from 'react';
import axios from 'axios';
import "./AddVideo.scss"

export default class AddVideo extends React.Component {
    constructor(props){
        super(props);
        this.socket = props.socket;
        this.state = {
            youtubeURL : "",
            userID : props.userID,
            roomID : props.roomID,
            apiHost : props.apiHost
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({youtubeURL: event.target.value});
    }

    handleSubmit(event){

        const url = this.state.youtubeURL;
        event.preventDefault();

        const postData = {
            userID : this.state.userID,
            roomID : this.state.roomID,
            videoURL : this.state.youtubeURL
        }
        axios.post(this.state.apiHost + '/api/rooms/addVideo', postData)
        .then((data) => {
            this.socket.emit('updateQueue', this.state.roomID, this.state.userID);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    render(){
        return(
            <form className='addVideo' onSubmit={this.handleSubmit}>
                <label>
                Add Video
                    <input type="text" value={this.state.youtubeURL} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Add" />
            </form>
        )
    }
}