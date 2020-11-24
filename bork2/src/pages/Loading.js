import React, { Component } from 'react';
import Circle from '@material-ui/core/CircularProgress';

import './Loading.css';

export default class Loading extends Component {
    render() {
        return (
            <div class="full-frame-loading">
                <h1 class="hog-pub-text">Hog Pub</h1>
                <h2 class="loading-text">Your lobby is loading...</h2>
                <Circle size={100} className="loading"></Circle>
            </div>
        );
    }
}