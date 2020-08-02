import React, { Component } from "react";
import { getReview } from "../fetchFunctions";
import ReviewListItem from "./ReviewListItem";
import { Spinner } from "react-bootstrap";

class ReviewList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviewList: [],
            reviewPage: this.props.reviewPage,
            nReviews: this.props.reviewsPerPage,
            loading: false,
        };
    }

    componentDidMount() {
        this.updateReviews();
    }

    updateReviews() {
        this.setState({ loading: true });
        getReview(this.props.bookID, this.state.reviewPage, this.state.nReviews)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                this.setState({ reviewList: json, loading: false });
            });
    }

    componentDidUpdate(previousProps) {
        if (previousProps.reviewPage !== this.props.reviewPage) {
            this.setState({ reviewPage: this.props.reviewPage }, () => {
                this.updateReviews();
            });
            this.forceUpdate();
        }
        if (previousProps.reviewsPerPage !== this.props.reviewsPerPage) {
            this.setState({ nReviews: this.props.reviewsPerPage }, () => {
                this.updateReviews();
            });
            this.forceUpdate();
        }
    }

    render() {
        if (this.state.loading === true) {
            return (
                <Spinner
                    animation="border"
                    style={{
                        position: "relative",
                        left: "50%",
                        top: "50%",
                    }}
                />
            );
        } else {
            return this.state.reviewList.map((review) => (
                <ReviewListItem
                    key={review.reader.id}
                    book_id={review.book_id}
                    creation_date={review.creation_date}
                    reader={review.reader.username}
                    score={review.score}
                    review={review.review}
                />
            ));
        }
    }
}

export default ReviewList;
