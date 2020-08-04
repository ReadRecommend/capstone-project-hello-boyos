import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import BlindCover from "./BlindCover";
import { bookDetailsContext } from "../../BookDetailsContext";

/*
The BookCard class deals with displaying the books. In a collection / search results or similar
*/
class BookCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
        };
    }

    displayCollections = () => {
        const { id: bookID } = this.props.book;
        return (
            <ListGroup variant="flush">
                {this.props.userCollections.map((collection) => (
                    <ListGroupItem
                        action
                        key={collection.id}
                        onClick={this.props.addToCollection.bind(
                            this,
                            bookID,
                            collection.id
                        )}
                    >
                        {collection.name}
                    </ListGroupItem>
                ))}
            </ListGroup>
        );
    };

    handleModal = () => {
        if (this !== null && typeof this !== "undefined") {
            this.setState({ modalShow: !this.state.modalShow });
        }
    };

    addButton = () => {
        if (
            this.props.book !== null &&
            typeof this.props.book !== "undefined" &&
            this.props.editable === true
        ) {
            return (
                <Button
                    variant="success"
                    className="float-left"
                    size="sm"
                    onClick={this.handleModal}
                >
                    +
                </Button>
            );
        }
    };

    /* 
      Remove button checks for the validity of a book before rendering the button that allows the user
      to remove the book from a collection.
      */
    removeButton = () => {
        const { book } = this.props;
        if (
            this !== null &&
            typeof this !== "undefined" &&
            this.props.editable === true
        ) {
            return (
                <Button
                    variant="danger"
                    className="float-right"
                    size="sm"
                    onClick={this.props.removeBook.bind(book, book.id)}
                >
                    x
                </Button>
            );
        }
    };

    render() {
        //const { title, cover, id: bookID } = this.props.book;
        const book = this.props.book;
        const title = book.title;
        const cover = book.cover;
        const bookID = book.id;

        return (
            <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                {this.props.editable === true && (
                    <Modal
                        show={this.state.modalShow}
                        onHide={this.handleModal}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Add to a Collection</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{this.displayCollections()}</Modal.Body>
                        <Modal.Footer></Modal.Footer>
                    </Modal>
                )}
                <Card style={{ width: "314px", marginBottom: "20px" }}>
                    <a href={`/book/${bookID}`}>
                        {!this.context ? (
                            <Card.Img
                                variant="top"
                                src={cover}
                                height="475px"
                            />
                        ) : (
                            <BlindCover book={book} />
                        )}
                    </a>
                    <Card.Body>
                        <Card.Text
                            style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            }}
                        >
                            {!this.context && (
                                <>
                                    <a href={`/book/${bookID}`}>{title}</a>
                                    <br></br>
                                    <small>{book.authors.join(", ")}</small>
                                    <br></br>
                                    <small>{book.publication_date}</small>
                                </>
                            )}
                        </Card.Text>
                        {!this.context && (
                            <>
                                <StarRatings
                                    rating={book.ave_rating}
                                    starRatedColor="gold"
                                    numberOfStars={5}
                                    starDimension="20px"
                                    name="rating"
                                />
                                <br></br>
                                <small>
                                    {book.ave_rating.toFixed(2)} from{" "}
                                    {book.n_ratings.toLocaleString()} reviews
                                </small>
                            </>
                        )}
                    </Card.Body>
                    {this.props.editable && (
                        <Card.Footer>
                            {this.addButton()}
                            {this.removeButton()}
                        </Card.Footer>
                    )}
                </Card>
            </div>
        );
    }
}

BookCard.propTypes = {
    book: PropTypes.object.isRequired,
    userCollections: PropTypes.array,
};

BookCard.contextType = bookDetailsContext;

export default BookCard;
