/**
 * Created by brett on 5/5/19.
 */

import React from 'react';
import axios from 'axios';
import Room from "./Room"
import { Redirect } from 'react-router-dom'

export default class CreateRoom extends React.Component {
    constructor(props){
        super(props);
        const apiHost = this.props.apiHost;
        const userID  = this.props.userID;
        this.state = {
            apiHost : apiHost,
            userID : userID
        }
        axios.post(apiHost + '/api/rooms/', { founderID : userID})
        .then((room) => {
            this.setState({
                redirect : true,
                roomID : room.data.roomID
            });
        })
        .catch((err) => {
            console.error(err);
        })
    }
    renderRedirect = () =>{
        if(this.state.redirect){
            const roomPath = '/room/' + this.state.roomID;
            return(
                <Redirect
                    to={{
                        pathname: roomPath,
                        state : this.state
                    }}
                />);
        }
        else{
            return (<div><p>Creating Room, please wait.</p></div>);
        }
    }

    render(){
        return this.renderRedirect();
    }
}