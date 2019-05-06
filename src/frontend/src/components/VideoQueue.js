/**
 * Created by brett on 5/5/19.
 */

/**
 * Created by brett on 5/5/19.
 */

import React from 'react';
import axios from 'axios';
import "./VideoQueue.scss";

export default class AddVideo extends React.Component {
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
            return this.state.videoQueue.map((vid, i) =><li key={i}><img src={vid.thumb.url} />{vid.title}</li>);
        }
        else{
            return <li>Loading..</li>
        }
    }

    render(){
        return(
            <div className="VideoQueue">
                <ul>
                    {this.renderVids()}
                </ul>
            </div>
        )
    }
}