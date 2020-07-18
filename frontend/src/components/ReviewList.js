import React, { Component } from "react";
import PropTypes from "prop-types";
import { getReview, addToCollection, verifyUser } from "../fetchFunctions";
import ReviewListItem from "./ReviewListItem"

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

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.reviewPage !== this.props.reviewPage) {
      this.setState({ reviewPage: this.props.reviewPage })
      this.updateReviews();
    }
  }



  updateReviews = () => {
    getReview(this.props.bookID, this.state.reviewPage, this.state.nReviews)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ reviewList: json });
      });
    this.forceUpdate();
  }

  updatePage = (page) => {
    this.setState({ reviewPage: page });
    this.updateReviews();
  }


  render() {
    return this.state.reviewList.map((review) => (
      <div>
        <ReviewListItem
          key={review.id}
          book_id={review.book_id}
          creation_date={review.creation_date}
          reader={review.reader.username}
          score={review.score}
          review={review.review}
        />
      </div>
    ));
  }
}

ReviewList.propTypes = {
  reviewList: PropTypes.array.isRequired,
}

export default ReviewList;