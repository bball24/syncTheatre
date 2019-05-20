import React, { Component } from "react";
import "./Home.scss";
import logo from "../img/logo_big.png"

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <img src={logo} className="homeLogo"></img>
                    <p>The #1 provider of remote entertainment</p>
                </div>
            </div>
        );
    }
}
