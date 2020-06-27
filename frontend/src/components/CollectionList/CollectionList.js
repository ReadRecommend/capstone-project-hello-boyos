import React, { Component } from "react";
import PropTypes from "prop-types";
import CollectionListItem from "./CollectionListItem"

class CollectionList extends Component {
    render() {
        return this.props.collectionList.map((collection) => (
            <CollectionListItem key={collection.id} collection={collection} delCollection={this.props.delCollection} />
        ));
    }
}

CollectionList.propTypes = {
    collectionList: PropTypes.array.isRequired,
    delCollection: PropTypes.func.isRequired
}

export default CollectionList;