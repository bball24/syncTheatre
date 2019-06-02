/**
 * Created by brett on 5/5/19.
 */

/**
 * Created by brett on 5/5/19.
 */

import React from 'react';
import axios from 'axios';
import "./VideoQueue.scss";
import { FaPlayCircle, FaCaretSquareLeft, FaCaretSquareRight, FaTimesCircle} from "react-icons/fa";

export default class VideoQueue extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            videoQueue : [],
            userID : props.userID,
            roomID : props.roomID,
            apiHost : props.apiHost,
            socket : props.socket,
        };

        //bindings
        this.updateQueue = this.updateQueue.bind(this);
        this.renderVids = this.renderVids.bind(this);
        this.shiftLeft = this.shiftLeft.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.shiftRight = this.shiftRight.bind(this);
        this.deleteVid = this.deleteVid.bind(this);
        this.updateQueue();
    }

    updateQueue(){
        const url = this.state.apiHost + '/api/rooms/queue/' + this.state.roomID;
        axios.get(url).then((queue) => {
            this.setState({
                videoQueue : queue.data.queue
            });
        })
        .catch((err) => {
            console.error(err);
        })
    }

    swapVids(i, j){
        let temp = this.state.videoQueue[i];
        this.state.videoQueue[i] = this.state.videoQueue[j];
        this.state.videoQueue[j] = temp;
    }

    playVideo(i){
        console.log(i);
        if( i >= 0 && i <= this.state.videoQueue.length){
            this.swapVids(0, i)
            axios.put(this.state.apiHost + '/api/rooms/' + this.state.roomID, {videoQueue: this.state.videoQueue})
            .then((queue) => {
                axios.get(this.state.apiHost + '/api/rooms/queue/' + this.state.roomID)
                .then((queue) => {
                    this.setState({
                        videoQueue : queue.data.queue
                    });

                    this.state.socket.emit('doneVideo', this.state.roomID, this.state.userID);
                })
                .catch((err) => {
                    console.error(err);
                })
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }

    shiftLeft(i){
        if(i > 0 && i <= this.state.videoQueue.length){
            this.swapVids(i-1, i);
        }

        axios.put(this.state.apiHost + '/api/rooms/' + this.state.roomID, {videoQueue: this.state.videoQueue})
        .then((queue) => {
            this.state.socket.emit('updateQueue', this.state.roomID, this.state.userID);
        })
        .catch((err) => {
            console.error(err);
        })
    }
    shiftRight(i){
        if(i >= 0 && (i + 1) < this.state.videoQueue.length){
            this.swapVids(i, i+1);
        }

        axios.put(this.state.apiHost + '/api/rooms/' + this.state.roomID, {videoQueue: this.state.videoQueue})
        .then((queue) => {
            this.state.socket.emit('updateQueue', this.state.roomID, this.state.userID);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    deleteVid(i){
        let newVidQueue = []
        let idx = 0;
        this.state.videoQueue.forEach((vid) => {
            if(idx != i){
                newVidQueue.push(vid);
            }
            idx++;
        })

        axios.put(this.state.apiHost + '/api/rooms/' + this.state.roomID, {videoQueue: newVidQueue})
        .then((queue) => {
            this.state.socket.emit('updateQueue', this.state.roomID, this.state.userID);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    renderVids(){
        if(this.state.videoQueue){
            return this.state.videoQueue.map((vid, i) => {
                return(
                <div className='vid' key={i}>
                    <div className='vidControl'>
                        <div className='vidControlIcons'>
                            <div className='deleteWrapper'>
                                <span title='delete video'><FaTimesCircle className='trashIcon' size={15} onClick={()=>{this.deleteVid(i)}}/></span>
                            </div>
                            <div className='ctrlWrapper'>
                                <span title='shift left'><FaCaretSquareLeft className='ctrlIcons' onClick={()=>{this.shiftLeft(i)}} size={30}/></span>
                                <span title='play now'><FaPlayCircle className='ctrlIcons' size={30} onClick={()=>{this.playVideo(i)}}/></span>
                                <span title='shift right'><FaCaretSquareRight className='ctrlIcons' size={30} onClick={()=>{this.shiftRight(i)}}/></span>
                            </div>
                        </div>
                    </div>
                    <div className='vidQueueInfo'>
                        <div className="vidThumb">
                            <img src={vid.thumb.url} />
                        </div>
                        <span className="vidTitle">
                            {vid.title}
                        </span>
                    </div>
                </div>);
            });
        }
        else{
            return <div>Loading..</div>
        }
    }

    render(){
        return(
            <div className="VideoQueue">
                {this.renderVids()}
            </div>
        )
    }
}