import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Collection from '../components/Collection';
import CollectionList from '../components/CollectionList/CollectionList'

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
        fetch('http://localhost:5000/user/John')
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