import React, { Component } from 'react';
import Logo from './../pig_logo/pig_logo.png';

import './Mobile.css';

export default class Mobile extends Component {
    render() {
        return (
            <div className="mobile-frame">
                <img className="mobile-logo" src={Logo} alt="logo"/>
                <h1 className="mobile-text">Hog Pub is for desktop sized screens only</h1>
            </div>
        );
    }
}