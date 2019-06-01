import React, { Component } from "react";
import "./Home.scss";
import UserToken from './UserToken'
import queryString from "query-string";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            token : values.tok || "",
            successful : (values.s == 'true'),
            userID : values.uid,
            apiHost : this.props.apiHost,
            user : {},
            roomName : "",
            userName : "",
            badName : false
        };

    }
    render() {
        return (
            <div className="outerWrap">
                <div className="innerWrap">
                    <h2>Profile</h2>
                    <p className="profile">
                        {this.state.userName}
                    </p>
                </div>
            </div>
        );
    }
}