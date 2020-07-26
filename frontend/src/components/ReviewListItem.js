import React, { Component } from "react";
import StarRatings from "react-star-ratings";

class ReviewListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
        };
    }

    displayReview = () => {
        return this.props.user;
    };

    render() {
        return (
            <div>
                <hr></hr>

                <h6>{this.props.reader} </h6>
                <small> {this.props.creation_date.slice(0, 10)}</small>
                <br></br>
                <StarRatings
                    rating={this.props.score}
                    // starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="15px"
                    name="rating"
                    starRatedColor="gold"
                />
                <br></br>
                {this.props.review}
                <br></br>
            </div>
        );
    }
}

export default ReviewListItem;
