/**
 * Created by brett on 5/19/19.
 */

import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import queryString from 'query-string';

export default class Login extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            token : values.tok || "",
            userID : values.uid,
            updateFn : this.props.updateFn
        };

        sessionStorage.setItem('SyncTheatre:userID', JSON.stringify(this.state.userID));
        sessionStorage.setItem('SyncTheatre:token', JSON.stringify(this.state.token));

        //tell the Root App component to update its userIDs.
        this.state.updateFn();
    };


    render() {
        return (
            <Redirect to="/" />
        );
    }
}