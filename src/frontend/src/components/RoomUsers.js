/**
 * Created by brett on 5/13/19.
 */

import React from 'react';
import axios from 'axios';

export default class RoomUsers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users : [],
            userID : props.userID,
            roomID : props.roomID,
            apiHost : props.apiHost
        };

        //bindings
        this.updateUsers = this.updateUsers.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
        this.updateUsers();
    }

    updateUsers(){
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