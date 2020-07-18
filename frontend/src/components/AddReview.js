import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Form, Button, Accordion, Card } from "react-bootstrap";

class AddReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reader_id: "",
            book_id: "",

            review: "",
            score: "",

            errorShow: false,
            errorMessage: "",
        };
    }

    componentDidMount() {
        this.setState({ reader_id: this.props.readerID });
        this.setState({ book_id: this.props.bookISBN });
    }

    updateReview = (event) => {
        this.setState({ review: event.target.value });
    };

    updateScore = (event) => {
        this.setState({ score: event.target.value });
    };

    handleError() {
        this.setState({ errorShow: false, errorMessage: "" });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.score) {
            this.setState({
                errorShow: true,
                errorMessage: "Please fill in the required fields",
            });
            return;
        }

        const data = {
            reader_id: this.state.reader_id,
            book_id: this.state.book_id,
            review: this.state.review,
            score: this.state.score,
        };

        fetch("http://localhost:5000/book/${book_id}/addreview", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    this.setState({
                        errorShow: true,
                        errorMessage: "You have already reviewed this book.",
                    }).then(() => {
                        throw Error;
                    });
                }
                return res.json();
            })
            .then(() => {
                this.props.notify("Review successfully published!");
                window.location.reload()
                return this.props.history.push(
                    "/book/" + this.state.book_id + "/reviews"
                );
            })
            .catch((e) => {});
    };

    render() {
        return (
            <div className="AddReview">
                <Alert
                    show={this.state.errorShow}
                    onClose={() => this.handleError()}
                    variant="danger"
                    dismissible
                >
                    {this.state.errorMessage}
                </Alert>
                <Accordion>
                    <Card>
                        {/* <Card.Header> */}
                        <Accordion.Toggle
                            as={Card.Header}
                            variant="link"
                            eventKey="0"
                        >
                            <a href="#">
                                <h5>Leave a review</h5>
                            </a>
                        </Accordion.Toggle>
                        {/* </Card.Header> */}
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Form
                                    method="POST"
                                    onSubmit={this.handleSubmit}
                                >
                                    <Form.Group>
                                        <Form.Control
                                            type="number"
                                            name="score"
                                            placeholder="1 - 5"
                                            value={this.state.score}
                                            onChange={this.updateScore}
                                            min="1"
                                            max="5"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Control
                                            as="textarea"
                                            rows="3"
                                            placeholder="What did you think of this book..."
                                            value={this.state.review}
                                            onChange={this.updateReview}
                                            name="review"
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        );
    }
}

AddReview.propTypes = {
    initialUserInfo: PropTypes.object.isRequired,
};

export default AddReview;
