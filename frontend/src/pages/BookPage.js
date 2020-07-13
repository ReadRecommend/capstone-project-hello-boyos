import React, { Component } from "react";
import { getBook } from "../fetchFunctions";
import AddBookModal from "../components/AddBookModal";

import { Container, Row, Media, Tabs, Tab } from "react-bootstrap";
import StarRatings from "react-star-ratings";

class BookPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {},
            collection: {},
        };
    }

    componentDidMount() {
        // Fetch the book based on the url
        getBook(this.props.match.params.bookISBN)
            .then((res) => {
                if (!res.ok) {
                    // Something went wrong, likely there is no book with the isbn specified in the url
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // Found a valid book
                return res.json();
            })
            .then((json) => {
                this.setState({
                    book: json,
                });
            });
    }

    sortAuthors = (authors) => {
        return authors.sort(function (a, b) {
            if (a.includes("(") && !b.includes("(")) {
                return 1e9;
            } else if (b.includes("(") && !a.includes("(")) {
                return -1e9;
            } else {
                return a.localeCompare(b);
            }
        });
    };

    render() {
        const book = this.state.book;
        const user = this.props.initialUserInfo;
        if (!book.authors) {
            return null;
        }
        return (
            <div>
                <Container>
                    <Row>
                        <br></br>
                    </Row>
                    <Row>
                        <Media>
                            <img
                                className="mr-3"
                                src={book.cover}
                                alt={book.title}
                            />
                            <Media.Body>
                                <h1>{book.title}</h1>
                                <h5>
                                    <small>
                                        {this.sortAuthors(book.authors).join(
                                            ", "
                                        )}
                                    </small>
                                </h5>
                                <p>
                                    {user ? (
                                        <AddBookModal book={book} user={user} />
                                    ) : null}
                                </p>
                                <Tabs defaultActiveKey="summary">
                                    <Tab eventKey="summary" title="Summary">
                                        <p>{book.summary}</p>
                                    </Tab>
                                    <Tab
                                        eventKey="reviews"
                                        title="Reviews + Ratings"
                                    >
                                        <h5>Average Rating</h5>
                                        <StarRatings
                                            rating={book.ave_rating}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            starDimension="30px"
                                            name="rating"
                                        />
                                        <br></br>
                                        <small>
                                            {book.ave_rating} from{" "}
                                            {book.n_ratings.toLocaleString()}{" "}
                                            reviews
                                        </small>
                                    </Tab>
                                    <Tab
                                        eventKey="info"
                                        title="Additional Information"
                                    >
                                        <strong>Publisher: </strong>
                                        {book.publisher}
                                        <br></br>
                                        <strong>Publication Year: </strong>
                                        {book.publication_date}
                                        <br></br>
                                        <strong>Genres: </strong>
                                        {book.genres.sort().join(", ")}
                                        <br></br>
                                        <strong>Language: </strong>
                                        {book.language}
                                        <br></br>
                                        <strong>ISBN: </strong>
                                        {book.isbn}
                                        <br></br>
                                    </Tab>
                                </Tabs>
                            </Media.Body>
                        </Media>
                    </Row>
                    <br></br>
                </Container>
            </div>
        );
    }
}

export default BookPage;