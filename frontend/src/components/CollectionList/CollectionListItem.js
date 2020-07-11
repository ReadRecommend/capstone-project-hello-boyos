import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroupItem, Button } from "react-bootstrap";
class CollectionListItem extends Component {
    render() {
        const { name, id } = this.props.collection;
        return (
            <ListGroupItem
                action
                active={this.props.isSelected}
                onClick={this.props.selectCollection.bind(this, id)}
                variant="secondary"
            >
                {/* When one clicks the collection, it is selected as the current collection. */}
                {name}
                {/* When the button is pressed, this collection will be removed from the collection list. */}
                {name !== "Main" && this.props.editable && (
                    <Button
                        variant="danger"
                        onClick={this.props.delCollection.bind(this, name)}
                        className="float-right"
                        size="sm"
                    >
                        X
                    </Button>
                )}
            </ListGroupItem>
        );
    }
}

CollectionListItem.propTypes = {
    collection: PropTypes.object.isRequired,
    selectCollection: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
};

export default CollectionListItem;
