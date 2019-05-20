/**
 * Created by brett on 5/19/19.
 */

import React, { Component } from "react";
import "./UserToken.scss";
import queryString from 'query-string';
import axios from 'axios';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

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
            successful : (values.s == 'true'),
            userID : values.uid,
            apiHost : this.props.apiHost,
            user : {},
            roomName : "",
            userName : ""
        };


    }

    componentWillMount(){
        if(this.state.successful){
            axios.get(this.state.apiHost + "/api/users/" + this.state.userID)
            .then((user) => {
                console.log(user);
                this.setState({
                    user : user.data
                });
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }

    validateForm() {
        return this.state.roomName.length < 30 && this.state.userName.length < 30;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    render() {
        console.log(this.state.successful);
        if(this.state.successful === true){
            return (
                <div className="outerWrap">
                    <div className="innerWrap">
                        <h2>Welcome to SyncTheatre!</h2>
                        <div className="introText">
                            <span className="innerText">
                                You have successfully created a new account!
                                Use the form below to choose your user name and room name.
                            </span>
                        </div>
                        <div className="userIntroForm">
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup controlId="userName" bsSize="large">
                                    <ControlLabel><FaUser/> User Name</ControlLabel>
                                    <FormControl
                                        autoFocus
                                        type="text"
                                        value={this.state.userName}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup controlId="roomName" bsSize="large">
                                    <ControlLabel><FaYoutube/> Room Name</ControlLabel>
                                    <FormControl
                                        value={this.state.roomName}
                                        onChange={this.handleChange}
                                        type="text"
                                    />
                                </FormGroup>
                                <Button
                                    className="btn btn-primary"
                                    block
                                    bsSize="large"
                                    disabled={!this.validateForm()}
                                    type="submit"
                                >
                                    Complete Sign-Up.
                                </Button>
                            </form>
                        </div>
                    </div>
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