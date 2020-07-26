import React, { Component } from "react";
import ReviewList from "../components/ReviewList";

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviewList: [],
            bookID: this.props.match.params.bookID,
        };
    }

    componentDidMount() {
        console.log(this.props.match.params);
        this.selectReview(this.props.match.params.bookID);
    }

    selectReview = (bookID) => {
        fetch(`http://localhost:5000/book/${bookID}/reviews`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ reviewList: json });
            });
    };

    render() {
        return (
            <div>
                <h1>Reviews for {this.state.bookID}</h1>
                <b>{this.reviewList}</b>
                <ReviewList reviewList={this.state.reviewList} />
            </div>
        );
    }
}

Reviews.propTypes = {
    // initialUserInfo: PropTypes.object.isRequired
};

export default Reviews;
