/**
 * Created by brett on 5/19/19.
 */

import React, { Component } from "react";
import "./UserToken.scss";
import queryString from 'query-string';

/**
 * Urls that follow this syntax will work
 * /token?tok=<token>&s=true
 * /token?s=true&tok=<token>
 * /token?tok=<token>&s=false
 * /token?s=false
 * etc..
 */
export default class UserToken extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            token : values.tok || "",
            successful : (values.s == 'true')
        };
    }

    render() {
        console.log(this.state.successful);
        if(this.state.successful === true){
            return (
                <div className="userTokenWrap">
                    <h3>Successful sign-in</h3>
                    <span>Token: {this.state.token}</span>
                </div>
            );
        }
        else{
            return (
                <div className="userTokenWrap">
                    <h3>Error</h3>
                </div>
            );
        }

    }
}