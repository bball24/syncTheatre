import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"
import Room from "./components/Room"
import Signup from './components/Signup'
import CreateRoom from './components/CreateRoom';

export default class Routes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            apiHost : props.apiHost,
            userID : props.userID
        };
    }

    render(){
        return (<Switch>
            <Route path="/" exact component={Home} />
            <Route path='/signup' exact component={Signup}/>
            <Route path="/login" exact component={Login} />
            <Route
                path="/room"
                exact
                render={(props) => <CreateRoom
                    {...props}
                    apiHost={this.state.apiHost}
                    userID={this.state.userID}
                />}
            />
            <Route
                exact
                path='/room/:roomID'
                render={(props) => <Room {...props} apiHost={this.state.apiHost} userID={this.state.userID} />}
            />
        </Switch>);
    }
}
