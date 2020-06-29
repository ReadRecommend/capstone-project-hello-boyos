import React, { Component } from "react";
import PropTypes from "prop-types";

class CollectionListItem extends Component {
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
        const { id, name } = this.props.collection;
        return (
            <div style={this.getStyle()}>
                <p >
                    {/* When one clicks the name of the collection, it is selected as the current collection. */}
                    <button style={linkButton} onClick={this.props.selectCollection.bind(this, id)}>{name}</button>
                    {" "}
                    {/* When the button is pressed, this collection will be removed from the collection list. */}
                    <button style={buttonStyle} onClick={this.props.delCollection.bind(this, id)}>X</button>
                </p>
            </div>
        )
    }
}

CollectionListItem.propTypes = {
    collection: PropTypes.object.isRequired,
    delCollection: PropTypes.func.isRequired,
    selectCollection: PropTypes.func.isRequired
}

const buttonStyle = {
    padding: '5px'
}

const linkButton = {
    backgroundcolor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textdecoration: 'underline',
    display: 'inline',
    margin: '0',
    padding: '0'
}

export default CollectionListItem;