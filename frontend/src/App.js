import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Collection from './components/Collection'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'

import './App.css';

class App extends Component {
    /*
    constructor(props) {
        super(props);

        this.state = {
            currentCollection: []
        };
    }

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

    render() {
        return (
            <Router>
               <div className="App">
                    <Route exact path="/login" component={Login} />
                    <Route path="/createAccount" component={CreateAccount} />
                    {/*<h1>ReadRecommend</h1>*/}
                    {/*<Collection currentCollection={this.state.currentCollection} />*/}
                </div>
            </Router>
        );
    }
}

export default App;