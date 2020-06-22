import React, { Component } from 'react';
import Collection from './components/Collection'

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
            <div className="App">
                <h1>ReadRecommend</h1>
                <Collection currentCollection={this.state.currentCollection} />
            </div>
        );
    }
}

export default App;