import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Collection from '../components/Collection';
import CollectionList from '../components/CollectionList/CollectionList'
import AddCollection from '../components/CollectionList/AddCollection';

class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collectionList: [],
            currentCollection: [],
            modalShow: false
        };
    };

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
        fetch('http://localhost:5000/user/JaneDoe')
            .then(res => {
                return res.json()
            }).then(json => {

                let collections = json.collections;
                console.log(collections);
                this.setState({ collectionList: collections });

            });
    };

    // Function that makes the modal show/not show
    handleModal() {
        this.setState({ modalShow: !this.state.modalShow })
    };

    // Function that deletes a collection in a user's collection list
    delCollection = (name) => {

        const data = { reader_id: 2, name: name };
        console.log(data);

        // We will let the backend do the checking for us
        fetch('http://localhost:5000/collection', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => {

                if (!res.ok) {
                    // Do proper error checking somehow
                    throw new Error();
                }

                return res.json();
            })
            .then(json => {
                console.log(json)
                this.setState({ collectionList: json.collections });
            })
            .catch((error) => {
                alert(error);
            });

    };

    // Function that adds a collection to a user's collection list
    addCollection = (name) => {

        const data = { reader_id: 2, name: name };
        console.log(data);

        // We will let the backend do the checking for us
        fetch('http://localhost:5000/collection', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => {

                if (!res.ok) {
                    // Do proper error checking somehow
                    throw new Error();
                }

                return res.json();
            })
            .then(json => {
                console.log(json)
                this.setState({ collectionList: json.collections });
            })
            .catch((error) => {
                alert(error);
            });


    };

    render() {

        return (
            <div className="UserHome">

                {/* Modal for creating a new collection */}
                <Modal show={this.state.modalShow} onHide={() => this.handleModal()}>
                    <Modal.Header>
                        <Modal.Title>Create New Collection</Modal.Title>
                        <button onClick={() => { this.handleModal() }}>x</button>
                    </Modal.Header>
                    <Modal.Body>
                        <AddCollection addCollection={this.addCollection} />
                    </Modal.Body>
                    <Modal.Footer>
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
                    />
                </div>
                <Collection currentCollection={this.state.currentCollection} />
            </div >
        );
    }
}

const collectionListStyle = {
    border: "3px #ccc solid",
    width: "500px"
}


export default UserHome;