import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Collection from './components/Collection'
import SignIn from './components/pages/SignIn'
import SignUp from './components/pages/SignUp'

import './App.css';

class App extends Component {
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

    render() {
        return (
            <Router>
               <div className="App">
                    <Route exact path="/" component={SignIn} />
                    <Route path="/signUp" component={SignUp} />
                    {/*<h1>ReadRecommend</h1>*/}
                    {/*<Collection currentCollection={this.state.currentCollection} />*/}
                </div>
            </Router>
        );
    }
}

export default App;