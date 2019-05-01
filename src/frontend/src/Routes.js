import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"
import Room from "./components/Room"
import Signup from './components/Signup'

export default () =>
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path='/signup' exact component={Signup}/>
        <Route path="/login" exact component={Login} />
        <Route path='/room' exact component={Room}/>
    </Switch>;
