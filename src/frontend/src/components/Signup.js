import React, { Component } from "react";
import "./Signup.scss";
import GoogleButton from 'react-google-button'

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            googleAuthHost : 'http://localhost:3001/auth/google',
            loading: true
        }

        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.isLoggedIn();

        this.state.loading = false;
    };

    isLoggedIn(){
        let userID = JSON.parse(sessionStorage.getItem('SyncTheatre:userID')) || -1;
        let tok = JSON.parse(sessionStorage.getItem('SyncTheatre:token')) || -1;

        //if the user has a valid token, they are signed in
        //as a registered user
        if(tok === -1){
            this.state.loggedIn = false;
        }
        else{
            this.state.loggedIn = true;
        }
    }


    render() {
        console.log(this.state);
        if(this.state.loading){
            return (
                <div className="outerWrap">
                    <div className="innerWrap">
                        <h2>Hang on we're loading..</h2>
                    </div>
                </div>
            );
        }
        else if(this.state.loggedIn){
            return (
                <div className="outerWrap">
                    <div className="innerWrap">
                        <h2>You are already signed in!</h2>
                        <p className="introMessage">
                            Start watching videos with your friends!
                        </p>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="outerWrap">
                    <div className="innerWrap">
                        <h2>Create Account and Sign In</h2>
                        <span className="introMessage">
                        You can create an account by signing in with google.
                        To log-in to your account, sign-in again. Registered users
                        get their own private permanent room and a custom user name!
                    </span>
                        <div className="googleBtnWrap">
                            <a href={this.state.googleAuthHost}>
                                <GoogleButton className="googleButton"/>
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
    }
}