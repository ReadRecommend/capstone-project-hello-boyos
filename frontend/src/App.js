import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

//import Collection from './components/Collection'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import UserHome from './pages/UserHome'

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {username: 'test297', access_token: ''};

        this.handleUser = this.handleUser.bind(this)
        
        /*this.state = {
            currentCollection: []
        };*/
    }

    /*
    componentDidMount() {
        fetch('http://localhost:5000/book')
            .then(res => {
                return res.json()
            }).then(json => {

                let books = json.slice(0, 10);
                console.log(books);
                this.setState({ currentCollection: books });

            });
    }
    */

    handleUser = (username, access_token) => {
        this.setState({username: username, access_token: access_token});
        console.log(this.state);
    }

    render() {
        return (
            <Router>
                <div className="App">
                    {/*<Route exact path="/login" component={Login} />*/}
                    <Route exact path="/login" render={(props) => <Login {...props} handleUser={this.handleUser} />} />
                    <Route path="/createAccount" component={CreateAccount} />
                    <Route path="/user" render={(props) => <UserHome {...props} username={this.state.username} />} />
                    {/*<h1>ReadRecommend</h1>*/}
                    {/*<Collection currentCollection={this.state.currentCollection} />*/}
                </div>
            </Router>
        );
    }
}

export default App;