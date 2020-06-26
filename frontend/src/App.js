import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import CollectionList from "./components/CollectionList/CollectionList";
import Collection from "./components/Collection";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collectionList: [
                {
                    id: 1,
                    name: "Test Collection 1"
                },
                {
                    id: 2,
                    name: "Test Collection 2"
                }
            ],
            currentCollection: []
        };
    }

    componentDidMount() {
        // TODO Check response code and error handle. Also not hardcode url
        fetch('http://localhost:5000/book')
            .then(res => {
                return res.json()
            }).then(json => {

                let books = json.slice(0, 10);
                console.log(books);
                this.setState({ currentCollection: books });

            });

        // Fetch the information about the logged in user
        fetch('http://localhost:5000/user/John')
            .then(res => {
                return res.json()
            }).then(json => {

                let collections = json.collections;
                console.log(collections);

            })
    }

    render() {
        return (
            <div className="App">
                <h1>ReadRecommend</h1>
                <div style={collectionListStyle}>
                    <CollectionList collectionList={this.state.collectionList} />
                </div>
                <Collection currentCollection={this.state.currentCollection} />
            </div>
        );
    }
}

const collectionListStyle = {
    border: "3px #ccc solid",
    width: "500px"
}

export default App;