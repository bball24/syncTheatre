/**
 * Created by brett on 5/5/19.
 */

/**
 * Created by brett on 5/5/19.
 */

import React from 'react';
import axios from 'axios';
import "./VideoQueue.scss";

export default class VideoQueue extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            videoQueue : [],
            userID : props.userID,
            roomID : props.roomID,
            apiHost : props.apiHost
        };

        //bindings
        this.updateQueue = this.updateQueue.bind(this);
        this.renderVids = this.renderVids.bind(this);
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

    renderVids(){
        if(this.state.videoQueue){
            return this.state.videoQueue.map((vid, i) => {
                return(<div className='vid' draggable key={i}>
                    <div className="vidThumb">
                        <img src={vid.thumb.url} />
                    </div>
                    <span className="vidTitle">
                        {vid.title}
                    </span>
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