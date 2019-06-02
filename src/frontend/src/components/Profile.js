import React, { Component } from "react";
import "./Profile.scss"
import axios from 'axios';
import queryString from 'query-string';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom'

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID : this.props.match.params.userID,
            apiHost : this.props.apiHost,
            redirect: false,
            photo : "",
            userName : "",
            badName : false


        };


        axios.get(this.state.apiHost + '/api/users/' + this.state.userID).then((user) => {
            this.setState({
                userName: user.data.userName,
                photo: user.data.photo
            })
            console.log(user.data.userName);
            console.log(user.data.userID);
        })
            .catch((err)=>{
                console.error(err);
            })


    }


    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/target' />
        }
    }

    render() {
        return (
            <div className="outerWrap">
                <div className="innerWrap">
                    <h2>Profile</h2>
                    <span className="profile">
                        <img className="profilePic" src={this.state.photo}/>
                        <div className='username'>Current UserName: {this.state.userName}</div>
                        <div className='button'>
                             {this.renderRedirect()}
                            <Button variant="primary" block size="lg" onClick={this.setRedirect}>Change UserName</Button>
                        </div>
                    </span>
                </div>
            </div>
        );
    }
}