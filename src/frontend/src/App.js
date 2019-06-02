import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.scss";
import Routes from "./Routes";
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import {FaIdCard} from "react-icons/fa";

import axios from "axios"


class App extends Component {
    constructor(props){
        super(props);
        const host = 'http://192.168.33.129:3001';
        //const host = 'http://localhost:3001';


        this.state = {
            apiHost : host,
            userID : JSON.parse(sessionStorage.getItem('SyncTheatre:userID')) || -1,
            loggedIn : false
    };

        if(this.state.userID === -1){
            axios.post(this.state.apiHost + '/api/users/temp')
            .then((tempUser) => {
                this.setState({
                    userID : tempUser.data.userID
                }, () => {
                    sessionStorage.setItem('SyncTheatre:userID', JSON.stringify(this.state.userID));
                });
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }

    logInCheck(){
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

    renderUserAccountNav(){
        this.logInCheck();
        if(this.state.loggedIn){
            return( <NavItem href={'/profile/' + this.state.userID}><FaIdCard/> Profile</NavItem>);
        }
        else{
            return <NavItem href="/signup"><FaUser/> Signup</NavItem>
        }
    }

    render() {
        //wait for userID from API
        if(this.state.userID === -1){
            return (<h3>Loading, Please Wait.</h3>)
        }
        else{
            return (
                <div className="Appcontainer">
                    <Navbar className="navbar" fluid collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/"><FaHome></FaHome></Link>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav pullRight>
                                {this.renderUserAccountNav()}
                                <NavItem href='/room'><FaYoutube/> Room</NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Routes userID={this.state.userID} apiHost={this.state.apiHost}/>
                </div>
            );
        }
    }
}

export default App;

