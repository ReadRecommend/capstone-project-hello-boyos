import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Collection from '../components/Collection';
import CollectionList from '../components/CollectionList/CollectionList'

class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collectionList: [],
            currentCollection: {
                books: []
            },
            modalShow: false
        };
    };

    componentDidMount() {
        // TODO Check response code and error handle. Also not hardcode url
        fetch('http://localhost:5000/collection/2')
            .then(res => {
                return res.json()
            }).then(json => {
                console.log("Console Log, Json books: " + json.books);
                this.setState({ currentCollection: json });

            });

        // Fetch the information about the logged in user
        fetch('http://localhost:5000/user/JaneDoe')
            .then(res => {
                return res.json()
            }).then(json => {

                let collections = json.collections;
                console.log(collections);
                this.setState({ collectionList: collections });

            });
    };

    handleModal() {
        this.setState({ modalShow: !this.state.modalShow })
    };

    delCollection = (id) => {
        this.setState({
            collectionList: [...this.state.collectionList.filter(collection => collection.id !== id)]
        });
    };

    addCollection = (name) => {
        let newCollection = {
            id: 2,
            name: name
        };
        this.setState({
            collectionList: [...this.state.collectionList, newCollection]
        });
    };

    displayCurrent = (currentCollection, key) => {
        if (!("books" in currentCollection)) {
            return;
        } else {
            return (
                <Collection key={key} currentCollection={currentCollection} />
            )
        }
    };

    selectCollection = (id) => {
        console.log(id)
        console.log("The URL is: " + `http://localhost:5000/collection/${id}`)
        fetch(`http://localhost:5000/collection/${id}`)
            .then(res => { return res.json() })
            .then(json => {
                console.log("New Current Collection is: " + json)
                this.setState({ currentCollection: json });
            })
        console.log("Current Collection ID is:" + this.state.currentCollection.id)
        console.log("Current Name is:" + this.state.currentCollection.name)
        console.log("Current Collection books is:" + this.state.currentCollection.books)
        console.log("Current reader is:" + this.state.currentCollection.reader)
        console.log("Current is:" + Object.keys(this.state.currentCollection))
    };

    render() {

        return (
            <div className="UserHome">

                {/* Modal for creating a new collection */}
                <Modal show={this.state.modalShow}>
                    <Modal.Header>
                        <Modal.Title>Create New Collection</Modal.Title>
                        <button onClick={() => { this.handleModal() }}>x</button>
                    </Modal.Header>
                    <Modal.Body>Create stuff here</Modal.Body>
                    <Modal.Footer>
                        <button onClick={(name) => { this.addCollection("test") }}>x</button>
                    </Modal.Footer>
                </Modal>

                <h1>ReadRecommend</h1>
                <h2>
                    Collections
                    <button onClick={() => { this.handleModal() }}>+</button>
                </h2>
                <div style={collectionListStyle}>
                    <CollectionList
                        collectionList={this.state.collectionList}
                        delCollection={this.delCollection}
                        selectCollection={this.selectCollection}
                    />
                </div>
                <h2>
                    <Collection key={this.state.currentCollection.id} currentCollection={this.state.currentCollection} />
                </h2>

            </div >
        );
    };
}

const collectionListStyle = {
    border: "3px #ccc solid",
    width: "500px"
}



export default UserHome;