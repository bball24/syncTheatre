import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.scss";
import Routes from "./Routes";
import { FaHome } from "react-icons/fa";
import axios from "axios"


class App extends Component {
    constructor(props){
        super(props);
        const host = 'http://localhost:3001';
        this.state = {
            apiHost : host,
            userID : JSON.parse(sessionStorage.getItem('SyncTheatre:userID')) || -1
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

    render() {
        //wait for userID from API
        if(this.state.userID === -1){
            return (<h3>Loading, Please Wait.</h3>)
        }
        else{
            return (
                <div className="App container">
                    <Navbar fluid collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/"><FaHome></FaHome></Link>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav pullRight>
                                <NavItem href="/signup">Signup</NavItem>
                                <NavItem href='/room'> Room </NavItem>
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

