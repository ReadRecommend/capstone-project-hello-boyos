import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from "react-bootstrap";

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
        this.setState({ reader_id: this.props.readerID })
        this.setState({ book_id: this.props.bookISBN })
    }

    updateReview = (event) => {
        this.setState({ review: event.target.value });
    };

    updateScore = (event) => {
        this.setState({ score: event.target.value });
    };

    handleError() {
        this.setState({ errorShow: false, errorMessage: "" })
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
                        errorMessage:
                            "This book has already been reviewed.",
                    }).then(() => {
                        throw Error;
                    });
                }
                return res.json();
            })
            .then(() => {
                return this.props.history.push("/book/" + this.state.book_id + "/reviews");
            })
            .catch((e) => { });
    }

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

                <h5>Write Review</h5>
                <br></br>

                <form method="POST" onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="review"
                        placeholder="Write a review..."
                        value={this.state.review}
                        onChange={this.updateReview}
                    />
                    <input
                        type="number"
                        name="score"
                        placeholder="1 - 5"
                        value={this.state.score}
                        onChange={this.updateScore}
                        min="1"
                        max="5"
                    />
                    <br></br>
                    <input
                        type="submit"
                        value="Add Review"
                    />

                </form>

            </div>
        )
    }

}

AddReview.propTypes = {
    initialUserInfo: PropTypes.object.isRequired
}

export default AddReview;