import React, { Component } from "react";
import { Form, Container, Spinner } from "react-bootstrap";
import SearchResults from "../components/SearchResults.js";
import { getRecommendations, getCollectionOverview } from "../fetchFunctions";
import { toast, ToastContainer } from "react-toastify";
class Discover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendationMode: "Top Rated",
            currentRecommendations: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.handleSubmit();
    }

    updateMode = (event) => {
        // When calling handleSubmit asynchronously the event will
        // be nullified otherwise
        event.persist();
        this.setState({ recommendationMode: event.target.value }, () => {
            this.handleSubmit(event); // Call asynchronously
        });
    };

    getRecentlyReadRecommendations = (books, user) => {
        let promiseArray = [];
        books.forEach((book) => {
            promiseArray = promiseArray.concat(
                getRecommendations("content", user.id, book.id, 2).then((res) =>
                    res.json()
                )
            );
        });
        return Promise.all(promiseArray);
    };

    handleSubmit = (event) => {
        const user = this.props.initialUserInfo;
        this.setState({ loading: true });
        switch (this.state.recommendationMode) {
            case "Top Rated":
                return null;
                break;
            case "People You Follow":
                getRecommendations("following", user.id, null, 20)
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
                            loading: false,
                        });
                        console.log(recommendations);
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
                            this.setState({ loading: false });
                        }
                    });
                break;
            case "Suggested For You":
                getCollectionOverview(user.username, "recently_read")
                    .then((res) => {
                        if (!res.ok) {
                            return res.text().then((text) => {
                                throw Error(text);
                            });
                        }

                        return res.json();
                    })
                    .then((json) => {
                        return this.getRecentlyReadRecommendations(
                            json.books,
                            user
                        );
                    })
                    .then((recommendations) => {
                        recommendations = recommendations.flat();
                        this.setState({
                            currentRecommendations: recommendations,
                            loading: false,
                        });
                        console.log(recommendations);
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
                            this.setState({ loading: false });
                        }
                    });
        }
    };

    render() {
        return (
            <div className="Search">
                <Container>
                    <ToastContainer
                        autoClose={4000}
                        pauseOnHover
                        closeOnClick
                    />
                    <h1> Discover </h1>
                    <br></br>
                    <Form method="POST" onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Control
                                as="select"
                                defaultValue={"Top Rated"}
                                onChange={this.updateMode}
                            >
                                <option>Top Rated</option>
                                {this.props.initialUserInfo && (
                                    <>
                                        <option>People You Follow</option>
                                        <option>Suggested For You</option>
                                    </>
                                )}
                            </Form.Control>
                            {/* <Button
                                variant="primary"
                                type="submit"
                                block
                                value="Recommend"
                            >
                                Recommend
                            </Button> */}
                        </Form.Group>
                    </Form>
                    <br></br>
                    {this.state.loading ? (
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
                            books={this.state.currentRecommendations}
                        ></SearchResults>
                    )}
                </Container>
            </div>
        );
    }
}

export default Discover;
