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
        const { name } = this.props.collection;
        return (
            <div style={this.getStyle()}>
                <p>
                    {name}
                    {name !== "main" &&
                        <button onClick={this.props.delCollection.bind(this, name)}>X</button>
                    }
                </p>
            </div>
        )
    }
}

CollectionListItem.propTypes = {
    collection: PropTypes.object.isRequired,
    delCollection: PropTypes.func.isRequired
}

export default CollectionListItem;