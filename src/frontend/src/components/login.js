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
            userID : values.uid
        };

        sessionStorage.setItem('SyncTheatre:userID', JSON.stringify(this.state.userID));
        sessionStorage.setItem('SyncTheatre:token', JSON.stringify(this.state.token));
    };


    render() {
        return (
            <Redirect to="/" />
        );
    }
}