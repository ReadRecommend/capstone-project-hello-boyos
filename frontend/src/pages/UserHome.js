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

    /*
    Remove book makes a call to the API to remove a book from the current collection
    upon the user clicking the remove book button. The new collection without the book
    is returned and set as the current collection.
    */
    removeBook = (isbn) => {
        fetch('http://localhost:5000/modify_collection', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: isbn,
                collection_id: this.state.currentCollection.id
            })
        })
            .then(res => { return res.json() })
            .then(json => {
                this.setState({ currentCollection: json });
            })
    }

    /*
    The selectCollection function takes the id of a collection and 
    changes the state of the page and refreshes it so that the 
    selected collection can then be displayed.
    */
    selectCollection = (id) => {
        fetch(`http://localhost:5000/collection/${id}`)
            .then(res => { return res.json() })
            .then(json => {
                this.setState({ currentCollection: json });
            })
    }

    addToCollection = (isbn, id) => {
        console.log("ISBN and Col id are: " + isbn + " and " + id)
        fetch('http://localhost:5000/modify_collection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: isbn,
                collection_id: id
            })
        })
            .then(res => { return res.json() })
            .then(json => {
                this.setState({ currentCollection: json });
            })
    }

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
                    <Collection
                        key={this.state.currentCollection.id}
                        currentCollection={this.state.currentCollection}
                        removeBook={this.removeBook}
                        userCollections={this.state.collectionList}
                        addToCollection={this.addToCollection}
                    />
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