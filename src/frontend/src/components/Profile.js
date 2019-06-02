import React, { Component } from "react";
import "./Profile.scss"
import axios from 'axios';
import queryString from 'query-string';
import Button from 'react-bootstrap/Button';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID : this.props.match.params.userID,
            apiHost : this.props.apiHost,
            roomName : "",
            photo : "",
            userName : "",
            badName : false,
            changeUserName: false
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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    handleSubmit(event){
        this.setState({changeUserName: true})
    }
    handleClick(event){
        this.setState({changeUserName: false})
        console.log(this.state.userName)
        event.preventDefault();

        const userInfo = {
            userName : this.state.userName
        }
        axios.put(this.state.apiHost + '/api/users/' + this.state.userID, userInfo)
            .then((user) => {
                console.log(user.data.userName);
            })
            .catch((err) => {
                console.error(err);
            });

    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }



    render() {
        if (this.state.changeUserName === false) {
            
        return (
            <div className="outerWrap">
                <div className="innerWrap">
                    <h2>Profile</h2>
                    <span className="profile">
                        <img className="profilePic" src={this.state.photo}/>
                        <div className='username'>Current UserName: {this.state.userName}</div>
                        <div className='yourRoom'>Your Permanent Room: <a href={'/user/' + this.state.userName}>room link</a></div>
                        <div className='button'>
                            <Button variant="primary" block size="lg"
                                    onClick={this.handleSubmit}>Change UserName</Button>
                        </div>
                    </span>
                </div>
            </div>
        );
    }
    else{
            return (
                <div className="outerWrap">
                    <div className="innerWrap">
                        <h2>Profile</h2>
                        <span className="profile">
                        <img className="profilePic" src={this.state.photo}/>
                        <div className='username'>Current UserName: {this.state.userName}</div>
                        <div className='yourRoom'>Your Permanent Room: <a href={'/user/' + this.state.userName}>room link</a></div>
                        <div className='button'>
                            <Button variant="primary" block size="lg"
                                    onClick={this.handleClick}>UserName</Button>
                            <div className='changeNameForm'>
                               <form onSubmit={this.handleClick}>
                                   <FormGroup controlId="userName" bsSize="large">
                                    <ControlLabel>Change UserName</ControlLabel>
                                    <FormControl
                                        autoFocus
                                        type="text"
                                        value={this.state.userName}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                               </form>

                            </div>
                        </div>
                    </span>
                    </div>
                </div>
            );
        }
    }
}