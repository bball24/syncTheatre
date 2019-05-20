/**
 * Created by brett on 5/14/19.
 */

import React, { Component } from "react";
import axios from "axios";
import Room from "./Room";

export default class PersistentRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName : this.props.match.params.roomName,
            apiHost : this.props.apiHost,
            userID : this.props.userID,
            loaded : false,
            error : false
        }

        // GET api/usrs/roomInfo/:userName
        axios.get(this.state.apiHost + '/api/users/roomInfo/' + this.state.roomName).then((info) =>  {
            this.setState({
                roomID : info.data.roomID,
                loaded : true,
                error: false
            })
        })
        .catch((err) => {
            console.error(err);
            this.setState({
                loaded : false,
                error: true
            })
        })

    }

    render() {
        if(this.state.loaded === true && this.state.error === false){
            //load room
            return(
                <Room
                      apiHost={this.state.apiHost}
                      userID={this.state.userID}
                      roomID={this.state.roomID}
                />
            )
        }else{
            return (<span>Sorry, error loading that room! :(</span>)
        }
    }
}
