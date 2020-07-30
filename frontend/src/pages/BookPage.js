import React, { Component } from "react";
import { getBook, getReviewPages, getRecommendations } from "../fetchFunctions";
import AddBookModal from "../components/AddBookModal";
import BlindCover from "../components/BlindCover";
import {
    Container,
    Row,
    Media,
    Tabs,
    Tab,
    Image,
    Form,
    Pagination,
    Spinner,
    InputGroup,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import ReviewList from "../components/ReviewList";
import AddReview from "../components/AddReview";
import Error from "../components/Error";
import { toast } from "react-toastify";
import SearchResults from "../components/SearchResults.js";
import { bookDetailsContext } from "../BookDetailsContext";
import { BsArrowRepeat } from "react-icons/bs";

class BookPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            book: null,
            collection: {},
            recommendationMode: "Author",
            reviewPage: 1,
            // TODO: Make this an input on the page
            reviewsPerPage: 5,
            totalReviewPages: 0,
            items: [],
            loadingRecommendations: true,
        };
    }

    componentDidMount() {
        // Fetch the book based on the url
        getBook(this.props.match.params.bookID)
            .then((res) => {
                if (!res.ok) {
                    // Something went wrong, likely there is no book with the id specified in the url
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // Found a valid book
                return res.json();
            })
            .then((json) => {
                this.setState(
                    {
                        book: json,
                    },
                    this.handleRecommendation
                );
            });

        getReviewPages(
            this.props.match.params.bookID,
            this.state.reviewsPerPage
        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (!this.state.items) {
                    this.buildPageBar(json.count);
                }
            })
            .then(() => {
                getReviewPages(
                    this.props.match.params.bookID,
                    this.state.reviewsPerPage
                )
                    .then((res) => {
                        if (!res.ok) {
                            // Something went wrong, likely there is no book with the id specified in the url
                            return res.text().then((text) => {
                                throw Error(text);
                            });
                        }

                        // Found a valid book
                        return res.json();
                    })
                    .then((json) => {
                        this.buildPageBar(json.count);
                    })
                    .then(() => {
                        this.forceUpdate();
                        this.setState({ loading: false });
                    });
            })
            .catch(() => {
                this.setState({ book: null, loading: false });
            });
    }

    updateMode = (event) => {
        // When calling handleSubmit asynchronously the event will
        // be nullified otherwise
        event.persist();
        this.setState({ recommendationMode: event.target.value }, () => {
            this.handleRecommendation(event); // Call asynchronously
        });
    };

    handleRecommendation = (event) => {
        const user = this.props.initialUserInfo;
        const book = this.state.book;
        this.setState({ loadingRecommendations: true });
        switch (this.state.recommendationMode) {
            case "Author":
                getRecommendations(
                    "author",
                    user ? user.id : null,
                    book.id,
                    6
                    // book.authors[0]
                )
                    .then((res) => {
                        if (!res.ok) {
                            return res.text().then((text) => {
                                throw Error(text);
                            });
                        }
                        return res.json();
                    })
                    .then((recommendations) => {
                        recommendations = recommendations.flat();
                        this.setState({
                            currentRecommendations: recommendations,
                            loadingRecommendations: false,
                        });
                    })
                    .catch((error) => {
                        // An error occurred
                        let errorMessage = "Something went wrong...";
                        try {
                            errorMessage = JSON.parse(error.message).message;
                        } catch {
                            errorMessage = error.message;
                        } finally {
                            toast.error(errorMessage);
                            this.setState({ loadingRecommendations: false });
                        }
                    });
                break;
            case "Genre":
                getRecommendations(
                    "genre",
                    user ? user.id : null,
                    book.id,
                    6
                    // null,
                    // book.genres[0]
                )
                    .then((res) => {
                        if (!res.ok) {
                            return res.text().then((text) => {
                                throw Error(text);
                            });
                        }
                        return res.json();
                    })
                    .then((recommendations) => {
                        recommendations = recommendations.flat();
                        this.setState({
                            currentRecommendations: recommendations,
                            loadingRecommendations: false,
                        });
                    })
                    .catch((error) => {
                        // An error occurred
                        let errorMessage = "Something went wrong...";
                        try {
                            errorMessage = JSON.parse(error.message).message;
                        } catch {
                            errorMessage = error.message;
                        } finally {
                            toast.error(errorMessage);
                            this.setState({ loadingRecommendations: false });
                        }
                    });
                break;
            case "Editor's Choice":
                getRecommendations("content", user ? user.id : null, book.id, 6)
                    .then((res) => {
                        if (!res.ok) {
                            return res.text().then((text) => {
                                throw Error(text);
                            });
                        }
                        return res.json();
                    })
                    .then((recommendations) => {
                        recommendations = recommendations.flat();
                        this.setState({
                            currentRecommendations: recommendations,
                            loadingRecommendations: false,
                        });
                    })
                    .catch((error) => {
                        // An error occurred
                        let errorMessage = "Something went wrong...";
                        try {
                            errorMessage = JSON.parse(error.message).message;
                        } catch {
                            errorMessage = error.message;
                        } finally {
                            toast.error(errorMessage);
                            this.setState({ loadingRecommendations: false });
                        }
                    });
                break;
            default:
                return null;
        }
    };

    refreshPageBar() {
        this.setState({ items: [] }, () => {
            this.buildPageBar(this.state.totalReviewPages);
        });
    }

    buildPageBar = (reviewPages) => {
        this.setState({ totalReviewPages: reviewPages }, () => {
            if (this.state.reviewPage !== 1) {
                this.state.items.push(
                    <Pagination.First
                        key={this.state.totalReviewPages + 1}
                        disabled={this.state.reviewPage === 1}
                        onClick={() => this.movePage(1)}
                    />
                );
                this.state.items.push(
                    <Pagination.Prev
                        key={this.state.totalReviewPages + 2}
                        disabled={this.state.reviewPage === 1}
                        onClick={() => this.movePage(this.state.reviewPage - 1)}
                    />
                );
            }

            if (this.state.reviewPage - 2 > 1) {
                this.state.items.push(
                    <Pagination.Ellipsis
                        key={this.state.totalReviewPages + 5}
                    />
                );
            }

            for (
                let number = this.state.reviewPage - 2;
                number <= this.state.reviewPage + 2;
                number++
            ) {
                if (number > 0 && number <= this.state.totalReviewPages) {
                    this.state.items.push(
                        <Pagination.Item
                            key={number}
                            active={number === this.state.reviewPage}
                            onClick={() => this.movePage(number)}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
            }

            if (this.state.reviewPage + 2 < this.state.totalReviewPages) {
                this.state.items.push(
                    <Pagination.Ellipsis
                        key={this.state.totalReviewPages + 6}
                    />
                );
            }

            if (
                this.state.reviewPage !== this.state.totalReviewPages &&
                this.state.totalReviewPages !== 0
            ) {
                this.state.items.push(
                    <Pagination.Next
                        key={this.state.totalReviewPages + 3}
                        disabled={
                            this.state.reviewPage ===
                            this.state.totalReviewPages
                        }
                        onClick={() => this.movePage(this.state.reviewPage + 1)}
                    />
                );
                this.state.items.push(
                    <Pagination.Last
                        key={this.state.totalReviewPages + 4}
                        disabled={
                            this.state.reviewPage ===
                            this.state.totalReviewPages
                        }
                        onClick={() =>
                            this.movePage(this.state.totalReviewPages)
                        }
                    />
                );
            }
            this.forceUpdate();
        });
    };

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

    notify = (message, type) => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            default:
                toast.info(message);
        }
    };

    movePage = (page) => {
        this.setState({ reviewPage: page }, () => {
            this.refreshPageBar();
        });
    };

    updatePerPage = (event) => {
        this.setState({ reviewsPerPage: event.target.value }, () => {

            getReviewPages(
                this.props.match.params.bookID,
                this.state.reviewsPerPage
            )
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    this.setState({ totalReviewPages: json.count }, () => {
                        this.movePage(1)
                    }

                    )
                })


        })
    }

    updatePage = () => {
        this.setState({ loading: true }, () => {
            getReviewPages(
                this.props.match.params.bookID,
                this.state.reviewsPerPage
            )
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    this.setState({ totalReviewPages: json.count }, () => {
                        this.movePage(1)

                    })
                })
            this.setState({ loading: false })
        })

    }

    render() {
        const book = this.state.book;
        const user = this.props.initialUserInfo;
        if (this.state.loading) {
            return (
                <Spinner
                    animation="border"
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                    }}
                />
            );
        }
        if (!book) {
            return (
                <Error
                    errorCode={404}
                    errorMessage="The book you are looking for doesn't exist"
                ></Error>
            );
        }
        return (
            <div>
                <Container>
                    <Row>
                        <br></br>
                    </Row>
                    <Row>
                        <Media>
                            {!this.context ? (
                                <div
                                    style={{
                                        position: "relative",
                                        width: "330px",
                                    }}
                                >
                                    <Image
                                        className="mr-3"
                                        src={book.cover}
                                        alt={book.title}
                                        thumbnail
                                        width="314px"
                                    />
                                </div>
                            ) : (
                                    <BlindCover book={book}></BlindCover>
                                )}
                            <Media.Body>
                                {!this.context && (
                                    <>
                                        <h1>{book.title}</h1>
                                        <h5>
                                            <small>
                                                {this.sortAuthors(
                                                    book.authors
                                                ).join(", ")}
                                            </small>
                                        </h5>{" "}
                                    </>
                                )}
                                <h6>
                                    <small>
                                        Read by {book.n_readers} user
                                        {book.n_readers === 1 ? "" : "s"}
                                    </small>
                                </h6>
                                <p>
                                    {user ? (
                                        <AddBookModal
                                            book={book}
                                            user={user}
                                            notify={this.notify}
                                        />
                                    ) : null}
                                </p>
                                <Tabs defaultActiveKey="summary">
                                    <Tab eventKey="summary" title="Summary">
                                        <br></br>

                                        <p>{book.summary}</p>
                                    </Tab>
                                    {!this.context && (
                                        <Tab
                                            eventKey="reviews"
                                            title="Reviews + Ratings"
                                        >
                                            {this.props.initialUserInfo && (
                                                <>
                                                    <br></br>
                                                    <AddReview
                                                        bookID={
                                                            this.props.match
                                                                .params.bookID
                                                        }
                                                        readerID={
                                                            this.props
                                                                .initialUserInfo
                                                                .id
                                                        }
                                                        notify={this.notify}
                                                        success={this.updatePage}
                                                    />
                                                </>
                                            )}
                                            <br></br>
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
                                                {book.ave_rating.toFixed(2)}{" "}
                                                from{" "}
                                                {book.n_ratings.toLocaleString()}{" "}
                                                reviews
                                            </small>

                                            <div>
                                                Reviews per page
                                                <select id="perPage" onChange={this.updatePerPage} value={this.state.reviewsPerPage}>
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                </select>
                                            </div>

                                            <ReviewList
                                                bookID={
                                                    this.props.match.params
                                                        .bookID
                                                }
                                                reviewPage={
                                                    this.state.reviewPage
                                                }
                                                reviewsPerPage={
                                                    this.state.reviewsPerPage
                                                }
                                            />

                                            <Pagination>
                                                {this.state.items}
                                            </Pagination>
                                            <br />
                                        </Tab>
                                    )}
                                    <Tab
                                        eventKey="info"
                                        title="Additional Information"
                                    >
                                        <br></br>
                                        {!this.context && (
                                            <>
                                                <strong>Publisher: </strong>
                                                {book.publisher}
                                                <br></br>
                                            </>
                                        )}
                                        {book.publication_date && (
                                            <>
                                                <strong>
                                                    Publication Year:{" "}
                                                </strong>
                                                {book.publication_date}
                                                <br></br>
                                            </>
                                        )}
                                        <strong>Genres: </strong>
                                        {book.genres.sort().join(", ")}
                                        <br></br>
                                        {book.language && (
                                            <>
                                                <strong>Language: </strong>
                                                {book.language}
                                                <br></br>
                                            </>
                                        )}
                                        {!this.context && book.isbn && (
                                            <>
                                                <strong>ISBN: </strong>
                                                {book.isbn}
                                                <br></br>
                                            </>
                                        )}
                                    </Tab>
                                    <Tab
                                        eventKey="recommend"
                                        title="Recommend Similar"
                                    >
                                        <br></br>
                                        <Form
                                            method="POST"
                                            onSubmit={this.handleSubmit}
                                        >
                                            <InputGroup className="mb3">
                                                <Form.Control
                                                    as="select"
                                                    defaultValue={"Author"}
                                                    onChange={this.updateMode}
                                                >
                                                    <option>Author</option>
                                                    <option>Genre</option>
                                                    <option>
                                                        Editor's Choice
                                                    </option>
                                                </Form.Control>
                                                <InputGroup.Append>
                                                    <InputGroup.Text
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={
                                                            this
                                                                .handleRecommendation
                                                        }
                                                    >
                                                        <BsArrowRepeat />
                                                    </InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            <br></br>
                                            {this.state
                                                .loadingRecommendations ? (
                                                    <Spinner
                                                        animation="border"
                                                        style={{
                                                            position: "absolute",
                                                            left: "50%",
                                                            top: "50%",
                                                        }}
                                                    />
                                                ) : (
                                                    <SearchResults
                                                        books={
                                                            this.state
                                                                .currentRecommendations
                                                        }
                                                    ></SearchResults>
                                                )}
                                        </Form>
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

BookPage.contextType = bookDetailsContext;
export default BookPage;
