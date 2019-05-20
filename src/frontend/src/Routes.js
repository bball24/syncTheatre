import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room"
import Signup from './components/Signup'
import CreateRoom from './components/CreateRoom';
import PersistentRoom from "./components/PersistentRoom";
import UserToken from "./components/UserToken";

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
            <Route path="/token/"
                   exact
                   render={(props) => <UserToken {...props}
                                                 apiHost={this.state.apiHost}/>}/>
            <Route
                exact
                path="/user/:roomName"
                render={(props) => <PersistentRoom {...props}
                                         apiHost={this.state.apiHost}
                                         userID={this.state.userID} />}
            />
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
                render={(props) => <Room {...props}
                                         apiHost={this.state.apiHost}
                                         userID={this.state.userID} />}
            />
        </Switch>);
    }
}
