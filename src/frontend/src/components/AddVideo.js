/**
 * Created by brett on 5/5/19.
 */

import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import "./AddVideo.scss"

export default class AddVideo extends React.Component {
    constructor(props){
        super(props);
        this.socket = props.socket;
        this.state = {
            youtubeURL : "",
            userID : props.userID,
            roomID : props.roomID,
            apiHost : props.apiHost,
            currentVid : null
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

            this.setState({
                youtubeURL : ""
            });
        })
        .catch((err) => {
            console.error(err);
        })
    }

    setCurrentVideo(vid){
        this.setState({
            currentVid : vid
        });
    }

    render(){

        return(
            <div className="addVideoWrap">
                {this.state.currentVid && <div className="videoInfoWrap">
                    <span className='videoInfoLabel'>Now Playing</span>
                    <img className='videoInfoImg' src={this.state.currentVid.thumb.url}/>
                    <div className='videoInfoDetails'>
                        <span className='videoInfoTitle'> {this.state.currentVid.title}</span>
                        <span className='videoInfoLink'> <a href={ 'https://www.youtube.com/watch?v=' + this.state.currentVid.videoID}>Watch on Youtube.com</a></span>
                    </div>
                </div>}
                <div className="addVideoInnerWrap">
                    <span className='videoInfoLabel'>Add A Video</span>
                    <div className="inputWrap">
                        <input type="text" value={this.state.youtubeURL} onChange={this.handleChange} placeholder=' Enter a youtube URL'/>
                    </div>
                    <div className="buttonWrap">
                        <Button variant="primary" onClick={this.handleSubmit}>Add</Button>
                    </div>
                </div>
            </div>

        )
    }
}