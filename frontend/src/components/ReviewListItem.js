import React, { Component } from "react";
import PropTypes from "prop-types";

class ReviewListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false
        };
    };

    displayReview = () => {
        const { isbn } = this.props.book;
        return this.props.user
    }

    render() {
        return (
            <div>

                <p>
                    Score: {this.props.score}
                </p>
                <p>
                    Review <br>
                    </br>
                    {this.props.review}
                </p>


                <p>
                    User: {this.props.reader} Time created: {this.props.creation_date}
                </p>
                <br></br>
            </div>

        )
    }
}


export default ReviewListItem;