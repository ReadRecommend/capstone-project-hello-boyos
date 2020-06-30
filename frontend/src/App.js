import React, { Component } from 'react';
import Main from './Main'

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { username: localStorage.getItem('username') || null, accessToken: localStorage.getItem('accessToken') || null };

    }

    handleUser = (username, accessToken) => {
        this.setState({ username: username, accessToken: accessToken });
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', accessToken);
        console.log(this.state);
    }

    render() {
        return (
            <div className="App" >
                <Main username={this.state.username} accessToken={this.state.accessToken} handleUser={this.handleUser} />
            </div>
        );
    }
}

export default App;