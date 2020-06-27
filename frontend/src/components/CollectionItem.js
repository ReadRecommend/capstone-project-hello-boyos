import React, { Component } from "react";
import PropTypes from "prop-types";

class CollectionItem extends Component {
    // Can move this to a class in css later
    getStyle = () => {
        return {
            background: "#f4f4f4",
            textAlign: "center",
            padding: "10px",
            borderBottom: "1px #ccc dotted"
        }
    }

    render() {
        const { title, summary, cover } = this.props.book;
        return (
            <div style={this.getStyle()}>
                <h1>{title}</h1>
                <img src={cover} alt={title} />
                <p>{summary}</p>
            </div>
        )
    }
}

// CollectionItem.propTypes = {
//     book: PropTypes.object.isRequired
// }

export default CollectionItem;