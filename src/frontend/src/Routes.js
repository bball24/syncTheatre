import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"
import Room from "./components/Room"
import Signup from './components/Signup'

export default class Routes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userID : props.userID
        };
    }

    render(){
        return (<Switch>
            <Route path="/" exact component={Home} />
            <Route path='/signup' exact component={Signup}/>
            <Route path="/login" exact component={Login} />
            <Route
                exact
                path='/room/:roomID'
                render={(props) => <Room {...props} userID={this.state.userID} />}
            />
        </Switch>);
    }
}
