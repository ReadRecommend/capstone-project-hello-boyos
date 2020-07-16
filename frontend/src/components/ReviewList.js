import React, { Component } from "react";
import PropTypes from "prop-types";
import { getReview, addToCollection, verifyUser } from "../fetchFunctions";
import ReviewListItem from "./ReviewListItem";

class ReviewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewList: [],
    };
  }

  componentDidMount() {
    getReview(this.props.bookID)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ reviewList: json });
      });
  }

  render() {
    return this.state.reviewList.map((review) => (
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
};

export default ReviewList;
