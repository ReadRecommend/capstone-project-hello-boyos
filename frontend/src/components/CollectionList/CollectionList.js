import React, { Component } from "react";
import PropTypes from "prop-types";
import CollectionListItem from "./CollectionListItem";
import { ListGroup } from "react-bootstrap";

class CollectionList extends Component {
    render() {
        return (
            <ListGroup>
                {this.props.collectionList.map((collection) => (
                    <CollectionListItem
                        key={collection.id}
                        collection={collection}
                        delCollection={this.props.delCollection}
                        selectCollection={this.props.selectCollection}
                        editable={this.props.editable}
                        isSelected={
                            this.props.currentCollection &&
                            collection.id === this.props.currentCollection.id
                        }
                    />
                ))}
            </ListGroup>
        );
    }
}

CollectionList.propTypes = {
    collectionList: PropTypes.array.isRequired,
    editable: PropTypes.bool.isRequired,
    selectCollection: PropTypes.func.isRequired,
    currentCollection: PropTypes.object.isRequired,
};

export default CollectionList;
