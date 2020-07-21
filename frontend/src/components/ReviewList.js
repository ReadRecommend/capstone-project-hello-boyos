import React, { Component } from "react";
import PropTypes from "prop-types";
import { getReview, getReviewPages } from "../fetchFunctions";
import ReviewListItem from "./ReviewListItem";

class ReviewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewList: [],
      reviewPage: this.props.reviewPage,
      nReviews: 2,
    };
  }

  componentDidMount() {
    this.updateReviews()
  }



  updateReviews() {
    getReview(this.props.bookID, this.state.reviewPage, this.state.nReviews)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ reviewList: json });
      });
  }

  componentDidUpdate(previousProps) {

    if (previousProps.reviewPage !== this.props.reviewPage) {
      this.setState({ reviewPage: this.props.reviewPage }, () => {
        this.updateReviews();
      })
      this.forceUpdate()
    }
  }


  render() {
    return (
      this.state.reviewList.map((review) => (
        <ReviewListItem
          key={review.reader.id}
          book_id={review.book_id}
          creation_date={review.creation_date}
          reader={review.reader.username}
          score={review.score}
          review={review.review}
        />
      )
      )
    )
  };
}



export default ReviewList;
