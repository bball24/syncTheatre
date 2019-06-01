import React, { Component } from "react";
import "./Home.scss";
import axios from 'axios';
import queryString from 'query-string';
import Button from 'react-bootstrap/Button';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            userID : values.uid,
            apiHost : this.props.apiHost,
            roomName : "",
            photo : "",
            userName : "",
            badName : false
        };
        axios.get(this.state.apiHost + '/api/users/ ' + this.state.userID)
            .then((user) => {
                console.log(user.data.userName);
            })
            .catch((err)=>{
            console.error(err);
        })

    }
    render() {
        return (
            <div className="outerWrap">
                <div className="innerWrap">
                    <h2>Profile</h2>
                    <span className="profile">
                            Current UserName: {this.state.userName}
                        <Button variant="primary" onClick={this.handleSubmit}>Change UserName</Button>
                    </span>
                </div>
            </div>
        );
    }
}