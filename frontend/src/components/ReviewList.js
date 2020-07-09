import React, { Component } from "react";
import PropTypes from "prop-types";
import ReviewListItem from "./ReviewListItem"

class ReviewList extends Component {
    render() {
        return this.props.reviewList.map((review) => (
            <ReviewListItem
                key={review.id}
                book_id={review.book_id}
                creation_date={review.creation_date}
                reader={review.reader.username}
                score={review.score}
                review={review.review}
            />
        ));
    }
}

ReviewList.propTypes = {
    reviewList: PropTypes.array.isRequired,
}

export default ReviewList;