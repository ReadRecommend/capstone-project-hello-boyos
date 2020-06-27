import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Collection from '../components/Collection';
import CollectionList from '../components/CollectionList/CollectionList'

class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collectionList: [
                {
                    id: 1,
                    name: "Collection 1",
                    books: [
                        {
                            id: 1,
                            "ave_rating": 4.45,
                            "cover": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1562726234l/13496.jpg",
                            "isbn": "9780553588484",
                            "language": null,
                            "n_ratings": 53736,
                            "publication_date": 1996,
                            "publisher": "Bantam",
                            "summary": "Here is the first volume in George R. R. Martin’s magnificent cycle of novels that includes A Clash of Kings and A Storm of Swords. As a whole, this series comprises a genuine masterpiece of modern fantasy, bringing together the best the genre has to offer. Magic, mystery, intrigue, romance, and adventure fill these pages and transport us to a world unlike any we have ever experienced. Already hailed as a classic, George R. R. Martin’s stunning series is destined to stand as one of the great achievements of imaginative fiction.A GAME OF THRONESLong ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister and supernatural forces are massing beyond the kingdom’s protective Wall. At the center of the conflict lie the Starks of Winterfell, a family as harsh and unyielding as the land they were born to. Sweeping from a land of brutal cold to a distant summertime kingdom of epicurean plenty, here is a tale of lords and ladies, soldiers and sorcerers, assassins and bastards, who come together in a time of grim omens.Here an enigmatic band of warriors bear swords of no human metal; a tribe of fierce wildlings carry men off into madness; a cruel young dragon prince barters his sister to win back his throne; and a determined woman undertakes the most treacherous of journeys. Amid plots and counterplots, tragedy and betrayal, victory and terror, the fate of the Starks, their allies, and their enemies hangs perilously in the balance, as each endeavors to win that deadliest of conflicts: the game of thrones.source: georgerrmartin.com",
                            "title": "A Game of Thrones"
                        }
                    ]

                }
            ],
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

    selectCollection = (id) => {
        console.log(id)
        this.setState({
            currentCollection: [...this.state.collectionList.filter(collection => collection.id === id)]
        });
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
                <CurrentCollection currentCollection={this.state.currentCollection} />
            </div >
        );
    }
}

const collectionListStyle = {
    border: "3px #ccc solid",
    width: "500px"
}


export default UserHome;