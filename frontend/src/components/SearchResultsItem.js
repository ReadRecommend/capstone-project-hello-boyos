import React, { Component } from "react";
import { Card } from "react-bootstrap";
import StarRatings from "react-star-ratings";

class SearchResultsItem extends Component {
    constructor(props) {
        super(props);
    }

    // Can move this to a class in css later
    getStyle = () => {
        return {
            background: "#f4f4f4",
            textAlign: "center",
            padding: "10px",
            borderBottom: "1px #ccc dotted",
        };
    };

    render() {
        const book = this.props.book;

        return (
            <div style={{ margin: "auto" }}>
                <Card style={{ width: "300px" }}>
                    <a href={`/book/${book.id}`}>
                        <Card.Img
                            variant="top"
                            src={book.cover}
                            height="475px"
                        />
                    </a>
                    <Card.Body>
                        <Card.Text>
                            <a href={`/book/${book.id}`}>{book.title}</a>
                            <p>
                                <small>{book.authors}</small>
                                <br></br>
                                <small>{book.publication_date}</small>
                            </p>
                        </Card.Text>
                        <StarRatings
                            rating={book.ave_rating}
                            starRatedColor="gold"
                            numberOfStars={5}
                            starDimension="20px"
                            name="rating"
                        />
                        <br></br>
                        <small>
                            {book.ave_rating} from{" "}
                            {book.n_ratings.toLocaleString()} reviews
                        </small>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default SearchResultsItem;
