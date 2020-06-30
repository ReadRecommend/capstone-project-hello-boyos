import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

//import Collection from './components/Collection'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import UserHome from './pages/UserHome'
import Main from './Main'

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {username: 'test297', access_token: ''};

        this.handleUser = this.handleUser.bind(this)
    }

    handleUser = (username, access_token) => {
        this.setState({username: username, access_token: access_token});
        console.log(this.state);
    }

    render() {
        return (
            <div className="App" >
                <Main username={this.state.username} handleUser={this.handleUser} />
            </div>
        );
    }
}

export default App;