/**
 * Created by brett on 5/13/19.
 */

import React from 'react';
import axios from 'axios';

export default class RoomUsers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users : this.props.users,
            userID : this.props.userID,
            roomID : this.props.roomID,
        };

        //bindings
        this.renderUsers = this.renderUsers.bind(this);
    }

    renderUsers(){
        if(this.state.users){
            return this.state.users.map((user, i) =><li key={i}><span>{user.userName}</span></li>);
        }
        else{
            return <li>Loading..</li>
        }
    }

    render(){
        return(
            <div className="UserList">
                <ul>
                    {this.renderUsers()}
                </ul>
            </div>
        )
    }
}